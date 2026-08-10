/**
 * Lesion-site graph for needle EMG localization.
 *
 * A lesion at site S affects muscle M exactly when S appears in M's upstream
 * set. The upstream set is assembled from four layers:
 *
 *   roots -> trunks -> cords -> nerve chain        (brachial plexus)
 *   roots -> plexus -> nerve chain                 (lumbosacral, coarser)
 *   roots -> nerve chain                           (pre-plexus branches)
 *   root  -> posterior ramus                       (paraspinals)
 *
 * Pre-plexus branches (dorsal scapular, long thoracic) and the posterior rami
 * leave the root proximal to the plexus, so they never carry trunk or cord
 * sites. That asymmetry is what separates a root lesion from a plexus lesion,
 * and it is the whole basis of the preganglionic screen in brachial plexus
 * injury.
 */

export type SiteLevel = 'root' | 'trunk' | 'cord' | 'plexus' | 'nerve'
export type SiteRegion = 'upper' | 'lower' | 'cranial' | 'axial'

/**
 * `coarse` marks a site whose anatomical mapping is genuinely approximate in
 * the source literature rather than uncertain in this data set. The lumbosacral
 * plexus has no clinically usable trunk/cord equivalent, so those sites are
 * coarse by nature and the UI says so.
 */
export type SiteConfidence = 'high' | 'coarse'

export interface LesionSite {
  id: string
  label: string
  level: SiteLevel
  region: SiteRegion
  confidence: SiteConfidence
}

type TrunkId = 'trunk-upper' | 'trunk-middle' | 'trunk-lower'
type CordId = 'cord-lateral' | 'cord-posterior' | 'cord-medial'

type NerveOrigin =
  | { kind: 'preplexus' }
  | { kind: 'posterior_ramus' }
  | { kind: 'trunk'; trunks: TrunkId[] }
  | { kind: 'cord'; cords: CordId[] }
  | { kind: 'cord_by_roots' }
  | { kind: 'plexus'; plexus: 'plexus-lumbar' | 'plexus-sacral' }
  | { kind: 'cranial' }

interface NerveDef {
  id: string
  /** Matches the `n` field of the muscle catalog, when the nerve is one a muscle names directly. */
  label: string
  /** Immediate parent trunk in the nerve tree, e.g. PIN -> radial. */
  parent?: string
  origin: NerveOrigin
  region: SiteRegion
  confidence?: SiteConfidence
}

const nerveDefs: NerveDef[] = [
  { id: 'facial', label: 'Facial N.', origin: { kind: 'cranial' }, region: 'cranial' },
  { id: 'trigeminal', label: 'Trigeminal N.', origin: { kind: 'cranial' }, region: 'cranial' },
  { id: 'hypoglossal', label: 'Hypoglossal N.', origin: { kind: 'cranial' }, region: 'cranial' },
  { id: 'accessory', label: 'Accessory N.', origin: { kind: 'cranial' }, region: 'cranial' },

  { id: 'post-rami-cervical', label: 'Post. Rami (Cervical)', origin: { kind: 'posterior_ramus' }, region: 'axial' },
  { id: 'post-rami-lumbar', label: 'Post. Rami (Lumbar)', origin: { kind: 'posterior_ramus' }, region: 'axial' },
  { id: 'post-rami-sacral', label: 'Post. Rami (Sacral)', origin: { kind: 'posterior_ramus' }, region: 'axial' },

  { id: 'dorsal-scapular', label: 'Dorsal Scapular N.', origin: { kind: 'preplexus' }, region: 'upper' },
  { id: 'long-thoracic', label: 'Long Thoracic N.', origin: { kind: 'preplexus' }, region: 'upper' },

  { id: 'subclavius', label: 'N. to Subclavius', origin: { kind: 'trunk', trunks: ['trunk-upper'] }, region: 'upper' },
  { id: 'suprascapular', label: 'Suprascapular N.', origin: { kind: 'trunk', trunks: ['trunk-upper'] }, region: 'upper' },

  { id: 'lat-pectoral', label: 'Lat. Pectoral N.', origin: { kind: 'cord', cords: ['cord-lateral'] }, region: 'upper' },
  { id: 'med-pectoral', label: 'Med. Pectoral N.', origin: { kind: 'cord', cords: ['cord-medial'] }, region: 'upper' },
  { id: 'subscapular-upper', label: 'Subscapular N.', origin: { kind: 'cord', cords: ['cord-posterior'] }, region: 'upper' },
  { id: 'subscapular-lower', label: 'Lower Subscapular N.', origin: { kind: 'cord', cords: ['cord-posterior'] }, region: 'upper' },
  { id: 'thoracodorsal', label: 'Thoracodorsal N.', origin: { kind: 'cord', cords: ['cord-posterior'] }, region: 'upper' },
  { id: 'axillary', label: 'Axillary N.', origin: { kind: 'cord', cords: ['cord-posterior'] }, region: 'upper' },
  { id: 'musculocutaneous', label: 'Musculocutaneous', origin: { kind: 'cord', cords: ['cord-lateral'] }, region: 'upper' },
  { id: 'radial', label: 'Radial N.', origin: { kind: 'cord', cords: ['cord-posterior'] }, region: 'upper' },
  { id: 'pin', label: 'PIN (Radial)', parent: 'radial', origin: { kind: 'cord', cords: ['cord-posterior'] }, region: 'upper' },
  { id: 'median', label: 'Median N.', origin: { kind: 'cord_by_roots' }, region: 'upper' },
  { id: 'ain', label: 'AIN (Median)', parent: 'median', origin: { kind: 'cord_by_roots' }, region: 'upper' },
  { id: 'ulnar', label: 'Ulnar N.', origin: { kind: 'cord', cords: ['cord-medial'] }, region: 'upper' },

  { id: 'femoral', label: 'Femoral N.', origin: { kind: 'plexus', plexus: 'plexus-lumbar' }, region: 'lower' },
  { id: 'obturator', label: 'Obturator N.', origin: { kind: 'plexus', plexus: 'plexus-lumbar' }, region: 'lower' },
  { id: 'sup-gluteal', label: 'Sup. Gluteal N.', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'inf-gluteal', label: 'Inf. Gluteal N.', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'sacral-plexus-direct', label: 'Sacral Plexus', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'pudendal', label: 'Pudendal N.', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },

  { id: 'sciatic', label: 'Sciatic N.', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'sciatic-tibial', label: 'Sciatic (Tibial)', parent: 'sciatic', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'sciatic-peroneal', label: 'Sciatic (Peroneal)', parent: 'sciatic', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'tibial', label: 'Tibial N.', parent: 'sciatic-tibial', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'med-plantar', label: 'Med. Plantar N.', parent: 'tibial', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'lat-plantar', label: 'Lat. Plantar N.', parent: 'tibial', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'common-peroneal', label: 'Common Peroneal N.', parent: 'sciatic-peroneal', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'deep-peroneal', label: 'Deep Peroneal N.', parent: 'common-peroneal', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
  { id: 'sup-peroneal', label: 'Sup. Peroneal N.', parent: 'common-peroneal', origin: { kind: 'plexus', plexus: 'plexus-sacral' }, region: 'lower' },
]

export const nerveByLabel = new Map(nerveDefs.map((nerve) => [nerve.label, nerve]))
const nerveById = new Map(nerveDefs.map((nerve) => [nerve.id, nerve]))

const upperRoots = ['C5', 'C6', 'C7', 'C8', 'T1'] as const
const lowerRoots = ['L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4'] as const
const axialRoots = ['C2', 'C3', 'C4'] as const

function rootRegion(root: string): SiteRegion {
  if ((upperRoots as readonly string[]).includes(root)) return 'upper'
  if ((lowerRoots as readonly string[]).includes(root)) return 'lower'
  if ((axialRoots as readonly string[]).includes(root)) return 'axial'
  return 'cranial'
}

/** Cranial nerve numerals appear in the catalog's root list; they are not spinal roots. */
function isSpinalRoot(root: string): boolean {
  return /^[CTLS]\d+$/.test(root)
}

const siteRegistry = new Map<string, LesionSite>()

function defineSite(site: LesionSite): LesionSite {
  const existing = siteRegistry.get(site.id)
  if (existing) return existing
  siteRegistry.set(site.id, site)
  return site
}

for (const root of [...upperRoots, ...lowerRoots, ...axialRoots]) {
  defineSite({
    id: `root-${root}`,
    label: `${root} root`,
    level: 'root',
    region: rootRegion(root),
    confidence: 'high',
  })
}

defineSite({ id: 'trunk-upper', label: 'Upper trunk', level: 'trunk', region: 'upper', confidence: 'high' })
defineSite({ id: 'trunk-middle', label: 'Middle trunk', level: 'trunk', region: 'upper', confidence: 'high' })
defineSite({ id: 'trunk-lower', label: 'Lower trunk', level: 'trunk', region: 'upper', confidence: 'high' })
defineSite({ id: 'cord-lateral', label: 'Lateral cord', level: 'cord', region: 'upper', confidence: 'high' })
defineSite({ id: 'cord-posterior', label: 'Posterior cord', level: 'cord', region: 'upper', confidence: 'high' })
defineSite({ id: 'cord-medial', label: 'Medial cord', level: 'cord', region: 'upper', confidence: 'high' })
defineSite({ id: 'plexus-lumbar', label: 'Lumbar plexus', level: 'plexus', region: 'lower', confidence: 'coarse' })
defineSite({ id: 'plexus-sacral', label: 'Sacral plexus', level: 'plexus', region: 'lower', confidence: 'coarse' })

for (const nerve of nerveDefs) {
  if (nerve.origin.kind === 'posterior_ramus') continue
  defineSite({
    id: `nerve-${nerve.id}`,
    label: nerve.label,
    level: 'nerve',
    region: nerve.region,
    confidence: nerve.confidence ?? (nerve.region === 'lower' ? 'coarse' : 'high'),
  })
}

export function siteById(id: string): LesionSite | undefined {
  return siteRegistry.get(id)
}

export function allSites(): LesionSite[] {
  return [...siteRegistry.values()]
}

function trunksFromRoots(roots: string[]): TrunkId[] {
  const trunks: TrunkId[] = []
  if (roots.includes('C5') || roots.includes('C6')) trunks.push('trunk-upper')
  if (roots.includes('C7')) trunks.push('trunk-middle')
  if (roots.includes('C8') || roots.includes('T1')) trunks.push('trunk-lower')
  return trunks
}

/**
 * The median nerve is formed from both the lateral and medial cords, so its
 * cord assignment depends on which roots the individual muscle draws from.
 * Pronator teres (C6-C7) is a lateral cord muscle; abductor pollicis brevis
 * (C8-T1) is a medial cord muscle. Collapsing them onto one cord would make
 * lateral and medial cord lesions indistinguishable.
 */
function cordsFromRoots(roots: string[]): CordId[] {
  const cords: CordId[] = []
  if (roots.some((root) => ['C5', 'C6', 'C7'].includes(root))) cords.push('cord-lateral')
  if (roots.some((root) => ['C8', 'T1'].includes(root))) cords.push('cord-medial')
  return cords
}

function nerveChain(nerveId: string): string[] {
  const chain: string[] = []
  let current: string | undefined = nerveId
  const guard = new Set<string>()
  while (current && !guard.has(current)) {
    guard.add(current)
    chain.push(current)
    current = nerveById.get(current)?.parent
  }
  return chain
}

export interface MusclePathway {
  nerveId: string
  /** Proximal-to-distal site ids, the material the pathway diagram renders. */
  rootSiteIds: string[]
  trunkSiteIds: string[]
  cordSiteIds: string[]
  plexusSiteIds: string[]
  nerveSiteIds: string[]
  /** Every site whose lesion would affect this muscle. */
  upstreamSiteIds: string[]
  /** True when the branch leaves the root proximal to the plexus. */
  prePlexus: boolean
  posteriorRamus: boolean
}

export function buildPathway(nerveLabel: string, roots: string[]): MusclePathway {
  const nerve = nerveByLabel.get(nerveLabel)
  const spinalRoots = roots.filter(isSpinalRoot)
  const rootSiteIds = spinalRoots.map((root) => `root-${root}`)

  if (!nerve) {
    return {
      nerveId: 'unknown',
      rootSiteIds,
      trunkSiteIds: [],
      cordSiteIds: [],
      plexusSiteIds: [],
      nerveSiteIds: [],
      upstreamSiteIds: rootSiteIds,
      prePlexus: false,
      posteriorRamus: false,
    }
  }

  const chain = nerveChain(nerve.id)
  const nerveSiteIds =
    nerve.origin.kind === 'posterior_ramus' ? [] : chain.map((id) => `nerve-${id}`)

  let trunkSiteIds: string[] = []
  let cordSiteIds: string[] = []
  let plexusSiteIds: string[] = []

  switch (nerve.origin.kind) {
    case 'preplexus':
    case 'posterior_ramus':
    case 'cranial':
      break
    case 'trunk':
      trunkSiteIds = nerve.origin.trunks
      break
    case 'cord':
      trunkSiteIds = trunksFromRoots(spinalRoots)
      cordSiteIds = nerve.origin.cords
      break
    case 'cord_by_roots':
      trunkSiteIds = trunksFromRoots(spinalRoots)
      cordSiteIds = cordsFromRoots(spinalRoots)
      break
    case 'plexus':
      plexusSiteIds = [nerve.origin.plexus]
      break
  }

  const upstreamSiteIds = [
    ...rootSiteIds,
    ...trunkSiteIds,
    ...cordSiteIds,
    ...plexusSiteIds,
    ...nerveSiteIds,
  ]

  return {
    nerveId: nerve.id,
    rootSiteIds,
    trunkSiteIds,
    cordSiteIds,
    plexusSiteIds,
    nerveSiteIds,
    upstreamSiteIds: [...new Set(upstreamSiteIds)],
    prePlexus: nerve.origin.kind === 'preplexus',
    posteriorRamus: nerve.origin.kind === 'posterior_ramus',
  }
}
