import legacyMuscles from './legacy-muscles.json'
import { buildPathway, type MusclePathway } from '../domain/anatomy'
import { bookInnervationForCatalogName } from './bookInnervation'

interface LegacyMuscle {
  m: string
  n: string
  r: string
  r_list: string[]
  a: string[]
}

// Runtime validation belongs in the data-quality test so the browser does not
// ship the full schema library for a static, version-controlled JSON file.
const parsedLegacyMuscles: LegacyMuscle[] = legacyMuscles

/**
 * These entries are absent from the legacy catalog. Cervical and thoracic
 * paraspinals complete the chapter 13 needle guide coverage; flexor hallucis
 * brevis is also included because it has its own insertion figure and technique.
 */
const addedMuscles: LegacyMuscle[] = [
  {
    m: 'Paraspinal (Cervical)',
    n: 'Post. Rami (Cervical)',
    r: 'C5-C8',
    r_list: ['C5', 'C6', 'C7', 'C8'],
    a: ['C PSP'],
  },
  {
    m: 'Paraspinal (Thoracic)',
    n: 'Post. Rami (Thoracic)',
    r: 'T1-T12',
    r_list: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    a: ['T PSP'],
  },
  { m: 'Flexor Hallucis Brevis', n: 'Med. Plantar N.', r: 'S1-S2', r_list: ['S1', 'S2'], a: ['FHB'] },
]

export type ReviewStatus = 'legacy-unverified' | 'added-unverified' | 'book-sourced'
export type MuscleRegion = 'cranial' | 'upper' | 'lower' | 'paraspinal' | 'other'

export interface MuscleCatalogEntry {
  id: string
  name: string
  abbreviations: string[]
  nerveLabel: string
  roots: string[]
  rootLabel: string
  region: MuscleRegion
  reviewStatus: ReviewStatus
  innervationSource?: string
  pathway: MusclePathway
  /**
   * A normal result here narrows the differential far less than the raw
   * intersection logic implies. Paraspinals reinnervate early and are commonly
   * normal in a real radiculopathy, so a normal paraspinal must not be allowed
   * to exclude a root.
   */
  normalIsWeakExclusion: boolean
  weakExclusionReason?: string
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function inferRegion(name: string, pathway: MusclePathway): MuscleRegion {
  if (pathway.posteriorRamus || name.includes('Paraspinal')) return 'paraspinal'
  if (pathway.rootSiteIds.some((id) => /^root-(C[5-8]|T1)$/.test(id))) return 'upper'
  if (pathway.rootSiteIds.some((id) => /^root-[LS]\d$/.test(id))) return 'lower'
  return 'cranial'
}

export const CATALOG_VERSION = 'emg-catalog.0.4.0'

function toEntry(
  item: LegacyMuscle,
  index: number,
  fallbackReviewStatus: Exclude<ReviewStatus, 'book-sourced'>,
  idPrefix: 'lg' | 'add',
): MuscleCatalogEntry {
  const bookInnervation = bookInnervationForCatalogName(item.m)
  const nerveLabel = bookInnervation?.nerveLabel ?? item.n
  const roots = bookInnervation?.roots ?? item.r_list
  const rootLabel = bookInnervation?.rootLabel ?? item.r
  const reviewStatus: ReviewStatus = bookInnervation ? 'book-sourced' : fallbackReviewStatus
  const pathway = buildPathway(nerveLabel, roots)
  const region = inferRegion(item.m, pathway)
  return {
    id: `${idPrefix}-${String(index + 1).padStart(3, '0')}-${slug(item.m)}`,
    name: item.m,
    abbreviations: item.a,
    nerveLabel,
    roots,
    rootLabel,
    region,
    reviewStatus,
    innervationSource: bookInnervation?.sourceLocator,
    pathway,
    normalIsWeakExclusion: region === 'paraspinal',
    weakExclusionReason:
      region === 'paraspinal'
        ? 'Paraspinal muscles reinnervate early and are frequently normal in a genuine radiculopathy. A normal result lowers support but does not exclude the root.'
        : undefined,
  }
}

export const muscleCatalog: MuscleCatalogEntry[] = [
  ...parsedLegacyMuscles.map((item, index) => toEntry(item, index, 'legacy-unverified', 'lg')),
  ...addedMuscles.map((item, index) => toEntry(item, index, 'added-unverified', 'add')),
]

export const bookSourcedMuscleCount = muscleCatalog.filter(
  (muscle) => muscle.reviewStatus === 'book-sourced',
).length

export const muscleById = new Map(muscleCatalog.map((muscle) => [muscle.id, muscle]))

export function findMuscleByName(name: string): MuscleCatalogEntry {
  const match = muscleCatalog.find((muscle) => muscle.name === name)
  if (!match) throw new Error(`Muscle not found in catalog: ${name}`)
  return match
}

export function searchMuscles(query: string): MuscleCatalogEntry[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return muscleCatalog

  return muscleCatalog.filter((muscle) =>
    [muscle.name, muscle.nerveLabel, muscle.rootLabel, ...muscle.abbreviations].some(
      (value) => value.toLowerCase().includes(normalized),
    ),
  )
}
