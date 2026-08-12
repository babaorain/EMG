import { RotateCcw } from 'lucide-react'
import {
  muscleAreaDefinitions,
  type MuscleArea,
} from '../../clinical/clinicalAreas'
import { THORACIC_PARASPINAL_FILTER } from '../../domain/muscleSelection'
import { activeFilterCount, type AreaFilter } from './filterState'

interface FilterPanelProps {
  area: AreaFilter
  onAreaChange: (area: AreaFilter) => void
  root: string
  onRootChange: (root: string) => void
  roots: string[]
  /** matches per area with the area filter itself ignored */
  areaCounts: Map<MuscleArea, number>
  /** matches per root with the root filter itself ignored */
  rootCounts: Map<string, number>
  totalCount: number
  onReset: () => void
}

const areaGroups = [
  { id: 'upper', label: '上肢' },
  { id: 'lower', label: '下肢' },
  { id: 'other', label: '其他' },
] as const

function rootChipLabel(root: string): string {
  return root === THORACIC_PARASPINAL_FILTER ? 'T PSP' : root
}

export function FilterPanel(props: FilterPanelProps) {
  const hasFilters = activeFilterCount(props.area, props.root) > 0

  return (
    <div className="filters">
      <div className="filters-head">
        <h2>篩選條件</h2>
        <button
          type="button"
          className="ghost-button"
          onClick={props.onReset}
          disabled={!hasFilters}
        >
          <RotateCcw size={14} aria-hidden="true" />
          重設
        </button>
      </div>

      <fieldset className="filter-block">
        <legend>臨床區域</legend>
        <button
          type="button"
          className={`chip chip-wide${props.area === 'all' ? ' is-active' : ''}`}
          aria-pressed={props.area === 'all'}
          onClick={() => props.onAreaChange('all')}
        >
          <span>全部區域</span>
          <em>{props.totalCount}</em>
        </button>

        {areaGroups.map((group) => (
          <div className="filter-group" key={group.id}>
            <span className="filter-group-label">{group.label}</span>
            <div className="chip-stack">
              {muscleAreaDefinitions
                .filter((definition) => definition.group === group.id)
                .map((definition) => {
                  const count = props.areaCounts.get(definition.id) ?? 0
                  return (
                    <button
                      key={definition.id}
                      type="button"
                      className={`chip chip-wide${props.area === definition.id ? ' is-active' : ''}${count === 0 ? ' is-empty' : ''}`}
                      aria-pressed={props.area === definition.id}
                      onClick={() => props.onAreaChange(definition.id)}
                    >
                      <span>{definition.label}</span>
                      <em>{count}</em>
                    </button>
                  )
                })}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="filter-block">
        <legend>神經根 / 顱神經</legend>
        <div className="chip-grid">
          <button
            type="button"
            className={`chip chip-root${props.root === 'all' ? ' is-active' : ''}`}
            aria-pressed={props.root === 'all'}
            onClick={() => props.onRootChange('all')}
          >
            全部
          </button>
          {props.roots.map((root) => {
            const count = props.rootCounts.get(root) ?? 0
            return (
              <button
                key={root}
                type="button"
                className={`chip chip-root${props.root === root ? ' is-active' : ''}${count === 0 ? ' is-empty' : ''}`}
                aria-pressed={props.root === root}
                aria-label={root === THORACIC_PARASPINAL_FILTER ? 'T1 至 T12 胸椎 paraspinal' : root}
                onClick={() => props.onRootChange(root)}
              >
                {rootChipLabel(root)}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
