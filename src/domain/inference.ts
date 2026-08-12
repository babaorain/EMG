/**
 * Localization support for needle EMG.
 *
 * This is set intersection over the anatomy graph, not a diagnosis. A site is
 * compatible when every abnormal muscle passes through it and no normal muscle
 * does. Everything the engine reports carries the muscle names that produced
 * it, so the reasoning can be checked by eye and taught out loud.
 *
 * Deliberately not modelled: partial lesions, symptom duration, side-to-side
 * comparison, and nerve conduction data. A normal muscle inside a lesioned
 * territory is treated as a contradiction, which is the useful simplification
 * for planning but is not always true of an incomplete lesion.
 */

import { muscleById, type MuscleCatalogEntry } from '../clinical/catalog'
import { siteById, type LesionSite, type SiteLevel } from './anatomy'
import type { CoverageState, NeedleFinding, Side } from './types'

export interface MuscleRef {
  id: string
  name: string
}

export interface SiteVerdict {
  site: LesionSite
  status: 'compatible' | 'partial' | 'contradicted'
  explains: MuscleRef[]
  unexplained: MuscleRef[]
  contradictedBy: MuscleRef[]
  /** Normal results too insensitive to exclude the site, e.g. paraspinals. */
  softenedBy: MuscleRef[]
  reason: string
  caveats: string[]
}

export type SuggestionKind = 'discriminate' | 'confirm'

export interface MuscleSuggestion {
  muscle: MuscleCatalogEntry
  kind: SuggestionKind
  /** Already in the plan and still unmarked, so it needs no adding. */
  inPlan: boolean
  /** Compatible sites surviving each branch, used to explain the pick. */
  survivorsIfAbnormal: LesionSite[]
  survivorsIfNormal: LesionSite[]
  score: number
  reason: string
}

export interface InferenceResult {
  side: Side
  abnormal: MuscleRef[]
  normal: MuscleRef[]
  inadequate: MuscleRef[]
  compatible: SiteVerdict[]
  partial: SiteVerdict[]
  contradicted: SiteVerdict[]
  suggestions: MuscleSuggestion[]
  /** Set when the compatible set contains a site whose mapping is approximate. */
  hasCoarseSite: boolean
}

const levelOrder: Record<SiteLevel, number> = {
  root: 0,
  trunk: 1,
  cord: 2,
  plexus: 3,
  nerve: 4,
}

function refOf(muscle: MuscleCatalogEntry): MuscleRef {
  return { id: muscle.id, name: muscle.name }
}

function names(refs: MuscleRef[]): string {
  return refs.map((ref) => ref.name).join('、')
}

function upstream(muscle: MuscleCatalogEntry): Set<string> {
  return new Set(muscle.pathway.upstreamSiteIds)
}

/**
 * Whether a normal result in this muscle is strong enough to rule the site out.
 *
 * A muscle receives only part of its supply through any one site it spans, so a
 * lesion at that site can spare it. Triceps brachii is listed as C6-C7-C8: a
 * normal triceps is not evidence against a C6 lesion, because triceps is
 * carried predominantly by C7. Pronator teres draws C6 and C7 and so crosses
 * the upper and middle trunks: a normal pronator teres is not evidence against
 * an upper trunk lesion.
 *
 * The thresholds are read off the pathway structure, never from an assumed root
 * dominance — the catalog carries no primary/secondary root weighting, so none
 * is invented here. Two roots is as root-specific as this catalog gets, so
 * three or more is the catalog itself reporting spread supply. One trunk and
 * one cord are the norm, so two already means spread.
 */
function exclusionStrength(
  muscle: MuscleCatalogEntry,
  site: LesionSite,
): { strong: boolean; softReason?: string } {
  if (muscle.normalIsWeakExclusion) {
    return { strong: false, softReason: muscle.weakExclusionReason }
  }
  if (site.level === 'root' && muscle.pathway.rootSiteIds.length > 2) {
    return {
      strong: false,
      softReason: `${muscle.name} 由 ${muscle.pathway.rootSiteIds.length} 個 root 共同供應，單一 root 病灶可能不足以使其異常。`,
    }
  }
  if (site.level === 'trunk' && muscle.pathway.trunkSiteIds.length > 1) {
    return {
      strong: false,
      softReason: `${muscle.name} 跨越 ${muscle.pathway.trunkSiteIds.length} 個 trunk，單一 trunk 病灶可能不足以使其異常。`,
    }
  }
  if (site.level === 'cord' && muscle.pathway.cordSiteIds.length > 1) {
    return {
      strong: false,
      softReason: `${muscle.name} 由 ${muscle.pathway.cordSiteIds.length} 個 cord 共同供應，單一 cord 病灶可能不足以使其異常。`,
    }
  }
  return { strong: true }
}

/** A normal result in this muscle removes the site from the compatible set. */
function excludes(muscle: MuscleCatalogEntry, site: LesionSite): boolean {
  return upstream(muscle).has(site.id) && exclusionStrength(muscle, site).strong
}

function collect(
  findings: NeedleFinding[],
  coverage: CoverageState,
): MuscleCatalogEntry[] {
  return findings
    .filter((finding) => finding.coverage === coverage)
    .map((finding) => muscleById.get(finding.muscleId))
    .filter((muscle): muscle is MuscleCatalogEntry => Boolean(muscle))
}

function verdictFor(
  site: LesionSite,
  abnormal: MuscleCatalogEntry[],
  normal: MuscleCatalogEntry[],
): SiteVerdict {
  const explains: MuscleRef[] = []
  const unexplained: MuscleRef[] = []
  for (const muscle of abnormal) {
    if (upstream(muscle).has(site.id)) explains.push(refOf(muscle))
    else unexplained.push(refOf(muscle))
  }

  const contradictedBy: MuscleRef[] = []
  const softenedBy: MuscleRef[] = []
  const caveats: string[] = []
  for (const muscle of normal) {
    if (!upstream(muscle).has(site.id)) continue
    const strength = exclusionStrength(muscle, site)
    if (strength.strong) {
      contradictedBy.push(refOf(muscle))
    } else {
      softenedBy.push(refOf(muscle))
      if (strength.softReason) caveats.push(strength.softReason)
    }
  }

  if (site.confidence === 'coarse') {
    caveats.push(
      '此層級的解剖對照在文獻上本身即為粗略分層，定位精度低於 root 與 named nerve。',
    )
  }

  if (contradictedBy.length > 0) {
    return {
      site,
      status: 'contradicted',
      explains,
      unexplained,
      contradictedBy,
      softenedBy,
      reason: `${names(contradictedBy)} 正常，但${contradictedBy.length > 1 ? '它們' : '它'}受此處支配`,
      caveats,
    }
  }

  if (unexplained.length > 0) {
    return {
      site,
      status: 'partial',
      explains,
      unexplained,
      contradictedBy,
      softenedBy,
      reason: `無法解釋 ${names(unexplained)} 異常`,
      caveats,
    }
  }

  return {
    site,
    status: 'compatible',
    explains,
    unexplained,
    contradictedBy,
    softenedBy,
    reason:
      explains.length === 1
        ? `${names(explains)} 異常可由此處解釋，無正常肌肉牴觸`
        : `${explains.length} 條異常肌肉皆經過此處，無正常肌肉牴觸`,
    caveats,
  }
}

function sortVerdicts(verdicts: SiteVerdict[]): SiteVerdict[] {
  return [...verdicts].sort((a, b) => {
    const byExplains = b.explains.length - a.explains.length
    if (byExplains !== 0) return byExplains
    const byLevel = levelOrder[a.site.level] - levelOrder[b.site.level]
    if (byLevel !== 0) return byLevel
    return a.site.label.localeCompare(b.site.label)
  })
}

function candidatePool(
  abnormal: MuscleCatalogEntry[],
  markedIds: Set<string>,
): MuscleCatalogEntry[] {
  const regions = new Set(abnormal.map((muscle) => muscle.region))
  const wantsUpper = regions.has('upper')
  const wantsLower = regions.has('lower')

  return [...muscleById.values()].filter((muscle) => {
    if (markedIds.has(muscle.id)) return false
    if (muscle.region === 'paraspinal') {
      const cervical = muscle.nerveLabel === 'Post. Rami (Cervical)'
      return cervical ? wantsUpper : wantsLower
    }
    if (muscle.region === 'upper') return wantsUpper
    if (muscle.region === 'lower') return wantsLower
    return false
  })
}

function suggestionsFor(
  compatible: SiteVerdict[],
  abnormal: MuscleCatalogEntry[],
  markedIds: Set<string>,
  unmarkedPlanIds: Set<string>,
): MuscleSuggestion[] {
  if (abnormal.length === 0) return []
  const compatibleSites = compatible.map((verdict) => verdict.site)
  if (compatibleSites.length === 0) return []

  const pool = candidatePool(abnormal, markedIds)
  const discriminators: MuscleSuggestion[] = []
  const confirmers: MuscleSuggestion[] = []

  for (const muscle of pool) {
    const up = upstream(muscle)
    const survivorsIfAbnormal = compatibleSites.filter((site) => up.has(site.id))
    // A normal result only removes the sites it can actually exclude.
    const survivorsIfNormal = compatibleSites.filter((site) => !excludes(muscle, site))

    // Expected number of hypotheses removed, treating the two outcomes as
    // equally likely. Worst-case scoring would discard the muscles that are
    // decisive in one direction only — a paraspinal settles root versus plexus
    // when abnormal and says nothing when normal, and that is still the needle
    // most worth placing.
    const eliminatedIfAbnormal = compatibleSites.length - survivorsIfAbnormal.length
    const eliminatedIfNormal = compatibleSites.length - survivorsIfNormal.length
    const score = (eliminatedIfAbnormal + eliminatedIfNormal) / 2
    const labels = (sites: LesionSite[]) => sites.map((site) => site.label).join('、')

    // A discriminator has to actually split the live hypotheses. Sharing no
    // site with any of them is a fishing expedition; sharing all of them is
    // supporting evidence, which is reported separately below.
    const splitsHypotheses =
      survivorsIfAbnormal.length > 0 &&
      survivorsIfAbnormal.length < compatibleSites.length

    if (score > 0 && splitsHypotheses) {
      const normalIsInformative = eliminatedIfNormal > 0
      discriminators.push({
        muscle,
        kind: 'discriminate',
        inPlan: unmarkedPlanIds.has(muscle.id),
        survivorsIfAbnormal,
        survivorsIfNormal,
        score,
        reason: !normalIsInformative
          ? `異常則收斂到 ${labels(survivorsIfAbnormal)}；正常則不排除任何假設（此肌肉的正常結果敏感度不足）`
          : survivorsIfNormal.length === 0
            ? `異常則指向 ${labels(survivorsIfAbnormal)}；正常則現有假設皆不成立，需考慮多發或跨層病灶`
            : `異常則指向 ${labels(survivorsIfAbnormal)}；正常則指向 ${labels(survivorsIfNormal)}`,
      })
      continue
    }

    if (survivorsIfAbnormal.length === compatibleSites.length) {
      confirmers.push({
        muscle,
        kind: 'confirm',
        inPlan: unmarkedPlanIds.has(muscle.id),
        survivorsIfAbnormal,
        survivorsIfNormal,
        score: 0,
        reason:
          compatibleSites.length === 1
            ? `位於 ${compatibleSites[0].label} 支配範圍內，可增加或推翻現有假設的支持度`
            : '位於所有仍相容假設的共同範圍內，可增加支持度但不區分假設',
      })
    }
  }

  const rankedDiscriminators = discriminators
    .sort((a, b) => {
      // Muscles already in the plan come first: the question during a study is
      // which of the needles you already committed to is worth placing next.
      // Additions still surface once the planned candidates run out.
      const byPlan = Number(b.inPlan) - Number(a.inPlan)
      if (byPlan !== 0) return byPlan
      // Paraspinals are the canonical root-level test, then other branches that
      // leave the root proximal to the plexus.
      const byRamus =
        Number(b.muscle.pathway.posteriorRamus) - Number(a.muscle.pathway.posteriorRamus)
      if (byRamus !== 0) return byRamus
      const byScore = b.score - a.score
      if (byScore !== 0) return byScore
      const byPrePlexus =
        Number(b.muscle.pathway.prePlexus) - Number(a.muscle.pathway.prePlexus)
      if (byPrePlexus !== 0) return byPrePlexus
      return a.muscle.name.localeCompare(b.muscle.name)
    })
    .slice(0, 4)

  if (rankedDiscriminators.length > 0) return rankedDiscriminators

  return confirmers
    .sort((a, b) => {
      const byPlan = Number(b.inPlan) - Number(a.inPlan)
      if (byPlan !== 0) return byPlan
      return a.muscle.name.localeCompare(b.muscle.name)
    })
    .slice(0, 3)
}

export function runInference(
  findings: NeedleFinding[],
  side: Side,
): InferenceResult {
  const sideFindings = findings.filter((finding) => finding.side === side)
  const abnormal = collect(sideFindings, 'abnormal')
  const normal = collect(sideFindings, 'normal')
  const inadequate = collect(sideFindings, 'technically_inadequate')

  const candidateSiteIds = new Set<string>()
  for (const muscle of abnormal) {
    for (const id of muscle.pathway.upstreamSiteIds) candidateSiteIds.add(id)
  }

  const verdicts: SiteVerdict[] = []
  for (const id of candidateSiteIds) {
    const site = siteById(id)
    if (!site) continue
    verdicts.push(verdictFor(site, abnormal, normal))
  }

  const compatible = sortVerdicts(
    verdicts.filter((verdict) => verdict.status === 'compatible'),
  )
  const partial = sortVerdicts(verdicts.filter((verdict) => verdict.status === 'partial'))
  const contradicted = sortVerdicts(
    verdicts.filter((verdict) => verdict.status === 'contradicted'),
  )

  const markedIds = new Set(
    sideFindings
      .filter((finding) => finding.coverage !== 'not_tested')
      .map((finding) => finding.muscleId),
  )
  const unmarkedPlanIds = new Set(
    sideFindings
      .filter((finding) => finding.coverage === 'not_tested')
      .map((finding) => finding.muscleId),
  )

  return {
    side,
    abnormal: abnormal.map(refOf),
    normal: normal.map(refOf),
    inadequate: inadequate.map(refOf),
    compatible,
    partial,
    contradicted,
    suggestions: suggestionsFor(compatible, abnormal, markedIds, unmarkedPlanIds),
    hasCoarseSite: compatible.some((verdict) => verdict.site.confidence === 'coarse'),
  }
}
