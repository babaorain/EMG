import { siteById } from './anatomy'
import type { MuscleCatalogEntry } from '../clinical/catalog'
import type { Side } from './types'

export interface SelectedMuscle {
  key: string
  muscleId: string
  side: Side
}

export interface PathwayStage {
  label: string
  value: string
}

const rootOrder = [
  'V',
  'VII',
  'XI',
  'XII',
  'C1',
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
  'C7',
  'C8',
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'T10',
  'T11',
  'T12',
  'L1',
  'L2',
  'L3',
  'L4',
  'L5',
  'S1',
  'S2',
  'S3',
  'S4',
  'S5',
]

const rootRanks = new Map(rootOrder.map((root, index) => [root, index]))

function labels(siteIds: string[]): string[] {
  return siteIds.flatMap((id) => {
    const site = siteById(id)
    return site ? [site.label.replace(/ root$/, '')] : []
  })
}

function divisionLabel(muscle: MuscleCatalogEntry): string {
  const cords = new Set(muscle.pathway.cordSiteIds)
  if (cords.has('cord-posterior')) return 'Posterior division(s)'
  if (cords.has('cord-lateral') || cords.has('cord-medial')) return 'Anterior division(s)'
  if (muscle.pathway.trunkSiteIds.length > 0) return 'Pre-division branch'
  return '—'
}

export function pathwayStages(muscle: MuscleCatalogEntry): PathwayStage[] {
  const roots = labels(muscle.pathway.rootSiteIds)
  const trunks = labels(muscle.pathway.trunkSiteIds)
  const cords = labels(muscle.pathway.cordSiteIds)
  const plexus = labels(muscle.pathway.plexusSiteIds)
  const nerveChain = labels([...muscle.pathway.nerveSiteIds].reverse())

  return [
    { label: 'Root', value: roots.length ? roots.join('–') : muscle.rootLabel },
    {
      label: 'Trunk / upstream',
      value: muscle.pathway.posteriorRamus
        ? 'Posterior ramus'
        : trunks.length
          ? trunks.join(' + ')
          : muscle.pathway.prePlexus
            ? 'Pre-plexus branch'
            : '—',
    },
    { label: 'Division', value: divisionLabel(muscle) },
    {
      label: 'Cord / plexus',
      value: cords.length ? cords.join(' + ') : plexus.length ? plexus.join(' + ') : '—',
    },
    { label: 'Downstream nerve', value: nerveChain.length ? nerveChain.join(' → ') : muscle.nerveLabel },
    { label: 'Muscle', value: muscle.name },
  ]
}

export function rootRank(muscle: MuscleCatalogEntry): number {
  const ranks = muscle.roots
    .map((root) => rootRanks.get(root))
    .filter((rank): rank is number => rank !== undefined)
  return ranks.length ? Math.min(...ranks) : Number.MAX_SAFE_INTEGER
}

export function primaryRoot(muscle: MuscleCatalogEntry): string {
  return [...muscle.roots].sort(
    (a, b) => (rootRanks.get(a) ?? 999) - (rootRanks.get(b) ?? 999),
  )[0] ?? muscle.rootLabel
}

export function compareMuscles(a: MuscleCatalogEntry, b: MuscleCatalogEntry): number {
  return rootRank(a) - rootRank(b) || a.name.localeCompare(b.name)
}

export function selectedKey(muscleId: string, side: Side): string {
  return `${side}:${muscleId}`
}

export const worksheetColumns = [
  'Root',
  'Side',
  'Muscle',
  'Nerve',
  'IA',
  'Fib',
  'PSW',
  'Fasc',
  'CRD',
  'Myotonic',
  'Amplitude',
  'Duration',
  'Polyphasia',
  'Recruitment',
  'Activation',
  'Notes',
] as const

export function worksheetRow(muscle: MuscleCatalogEntry, side: Side): string[] {
  return [
    muscle.rootLabel,
    side,
    muscle.name,
    muscle.nerveLabel,
    ...Array<string>(worksheetColumns.length - 4).fill(''),
  ]
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

export function worksheetCsv(rows: Array<{ muscle: MuscleCatalogEntry; side: Side }>): string {
  return [
    worksheetColumns.map(csvCell).join(','),
    ...rows.map(({ muscle, side }) => worksheetRow(muscle, side).map(csvCell).join(',')),
  ].join('\r\n')
}
