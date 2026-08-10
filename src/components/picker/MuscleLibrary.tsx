import { Crosshair, Plus, Search } from 'lucide-react'
import type { MuscleCatalogEntry, MuscleRegion } from '../../clinical/catalog'
import { pathwayStages, primaryRoot } from '../../domain/muscleSelection'
import type { Side } from '../../domain/types'

type RegionFilter = 'all' | MuscleRegion

interface MuscleLibraryProps {
  muscles: MuscleCatalogEntry[]
  query: string
  onQueryChange: (query: string) => void
  region: RegionFilter
  onRegionChange: (region: RegionFilter) => void
  root: string
  onRootChange: (root: string) => void
  roots: string[]
  selectedKeys: Set<string>
  onAdd: (muscle: MuscleCatalogEntry, side: Side) => void
  onNeedlePoint: (muscle: MuscleCatalogEntry, side: Side) => void
}

const regionOptions: Array<{ value: RegionFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'cranial', label: '顱顏／頸部' },
  { value: 'upper', label: '上肢' },
  { value: 'lower', label: '下肢' },
  { value: 'paraspinal', label: 'Paraspinal' },
]

function AddButton({
  side,
  selected,
  onClick,
}: {
  side: Side
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`side-add-button${selected ? ' selected' : ''}`}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
    >
      {!selected && <Plus size={13} aria-hidden="true" />}
      <span>{side} {selected ? '已加入' : '加入'}</span>
    </button>
  )
}

function MusclePathRow({
  muscle,
  selectedKeys,
  onAdd,
  onNeedlePoint,
}: {
  muscle: MuscleCatalogEntry
  selectedKeys: Set<string>
  onAdd: MuscleLibraryProps['onAdd']
  onNeedlePoint: MuscleLibraryProps['onNeedlePoint']
}) {
  const stages = pathwayStages(muscle)
  const leftSelected = selectedKeys.has(`L:${muscle.id}`)
  const rightSelected = selectedKeys.has(`R:${muscle.id}`)

  return (
    <article className="muscle-path-row">
      <div className="pathway-track" aria-label={`${muscle.name} 神經路徑`}>
        {stages.map((stage, index) => (
          <div className="pathway-stage" key={stage.label}>
            <span className="pathway-label">{stage.label}</span>
            <span className={`pathway-value${stage.value === '—' ? ' unavailable' : ''}`}>
              {stage.value}
            </span>
            {index < stages.length - 1 && <span className="pathway-line" aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="muscle-row-actions">
        <AddButton side="L" selected={leftSelected} onClick={() => onAdd(muscle, 'L')} />
        <AddButton side="R" selected={rightSelected} onClick={() => onAdd(muscle, 'R')} />
        <button
          className="needle-button"
          type="button"
          onClick={() => onNeedlePoint(muscle, rightSelected ? 'R' : 'L')}
          title="查看扎針點"
        >
          <Crosshair size={16} aria-hidden="true" />
          <span>扎針點</span>
        </button>
      </div>
    </article>
  )
}

export function MuscleLibrary(props: MuscleLibraryProps) {
  return (
    <section className="library-pane" aria-labelledby="library-title">
      <h2 id="library-title" className="sr-only">肌肉清單</h2>
      <div className="library-toolbar">
        <label className="picker-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">搜尋肌肉</span>
          <input
            type="search"
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            placeholder="搜尋 muscle / nerve / root"
          />
          {props.query && (
            <button type="button" onClick={() => props.onQueryChange('')} aria-label="清除搜尋">
              清除
            </button>
          )}
        </label>

        <div className="filter-row" aria-label="依區域篩選">
          <span className="filter-caption">依區域</span>
          {regionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={props.region === option.value ? 'active' : ''}
              onClick={() => props.onRegionChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="filter-row root-filter" aria-label="依 Root 篩選">
          <span className="filter-caption">依 Root</span>
          <button
            type="button"
            className={props.root === 'all' ? 'active' : ''}
            onClick={() => props.onRootChange('all')}
          >
            全部
          </button>
          {props.roots.map((root) => (
            <button
              key={root}
              type="button"
              className={props.root === root ? 'active' : ''}
              onClick={() => props.onRootChange(root)}
            >
              {root}
            </button>
          ))}
        </div>
      </div>

      <div className="pathway-column-head" aria-hidden="true">
        <span>Root</span>
        <span>Trunk / upstream</span>
        <span>Division</span>
        <span>Cord / plexus</span>
        <span>Downstream nerve</span>
        <span>Muscle</span>
          <span>加入／扎針點</span>
      </div>

      <div className="muscle-results" aria-live="polite">
        {props.muscles.length === 0 ? (
          <div className="no-results">
            <p>找不到符合條件的肌肉</p>
            <button type="button" onClick={() => props.onQueryChange('')}>清除搜尋</button>
          </div>
        ) : (
          props.muscles.map((muscle, index) => {
            const root = primaryRoot(muscle)
            const previousRoot = index > 0 ? primaryRoot(props.muscles[index - 1]) : undefined
            return (
              <div className="root-group" key={muscle.id}>
                {root !== previousRoot && <h3 className="root-band">{root}</h3>}
                <MusclePathRow
                  muscle={muscle}
                  selectedKeys={props.selectedKeys}
                  onAdd={props.onAdd}
                  onNeedlePoint={props.onNeedlePoint}
                />
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
