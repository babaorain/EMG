import { z } from 'zod'
import legacyMuscles from './legacy-muscles.json'
import { buildPathway, type MusclePathway } from '../domain/anatomy'

const legacyMuscleSchema = z.object({
  m: z.string().min(1),
  n: z.string().min(1),
  r: z.string().min(1),
  r_list: z.array(z.string().min(1)).min(1),
  a: z.array(z.string()),
})

type LegacyMuscle = z.infer<typeof legacyMuscleSchema>

const parsedLegacyMuscles = z.array(legacyMuscleSchema).parse(legacyMuscles)

/**
 * Cervical paraspinals are absent from the legacy catalog, which only carried
 * L2-L5 and S1. They are added here because the preganglionic screen in
 * brachial plexus injury and the confirmation step in cervical radiculopathy
 * both depend on them. These four entries are additions to the legacy data set,
 * not migrations of it.
 */
const addedMuscles: LegacyMuscle[] = [
  { m: 'Paraspinal (C5)', n: 'Post. Rami (Cervical)', r: 'C5', r_list: ['C5'], a: ['C5 PSP'] },
  { m: 'Paraspinal (C6)', n: 'Post. Rami (Cervical)', r: 'C6', r_list: ['C6'], a: ['C6 PSP'] },
  { m: 'Paraspinal (C7)', n: 'Post. Rami (Cervical)', r: 'C7', r_list: ['C7'], a: ['C7 PSP'] },
  { m: 'Paraspinal (C8)', n: 'Post. Rami (Cervical)', r: 'C8', r_list: ['C8'], a: ['C8 PSP'] },
]

export type ReviewStatus = 'legacy-unverified' | 'added-unverified'
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

export const CATALOG_VERSION = 'emg-catalog.0.2.0'

function toEntry(
  item: LegacyMuscle,
  index: number,
  reviewStatus: ReviewStatus,
): MuscleCatalogEntry {
  const pathway = buildPathway(item.n, item.r_list)
  const region = inferRegion(item.m, pathway)
  return {
    id: `${reviewStatus === 'legacy-unverified' ? 'lg' : 'add'}-${String(index + 1).padStart(3, '0')}-${slug(item.m)}`,
    name: item.m,
    abbreviations: item.a,
    nerveLabel: item.n,
    roots: item.r_list,
    rootLabel: item.r,
    region,
    reviewStatus,
    pathway,
    normalIsWeakExclusion: region === 'paraspinal',
    weakExclusionReason:
      region === 'paraspinal'
        ? 'Paraspinal muscles reinnervate early and are frequently normal in a genuine radiculopathy. A normal result lowers support but does not exclude the root.'
        : undefined,
  }
}

export const muscleCatalog: MuscleCatalogEntry[] = [
  ...parsedLegacyMuscles.map((item, index) => toEntry(item, index, 'legacy-unverified')),
  ...addedMuscles.map((item, index) => toEntry(item, index, 'added-unverified')),
]

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
