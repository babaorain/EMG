import type { MuscleArea } from '../../clinical/clinicalAreas'

export type AreaFilter = 'all' | MuscleArea

export function activeFilterCount(area: AreaFilter, root: string): number {
  return (area === 'all' ? 0 : 1) + (root === 'all' ? 0 : 1)
}
