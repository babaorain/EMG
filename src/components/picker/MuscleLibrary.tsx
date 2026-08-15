import { ChevronDown, Crosshair, ListFilter, Search, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { MuscleCatalogEntry } from '../../clinical/catalog'
import {
  clinicalAreaForMuscle,
  muscleAreaById,
} from '../../clinical/clinicalAreas'
import { hasNeedleGuideImage } from '../../clinical/needleGuides'
import { pathwayStages } from '../../domain/muscleSelection'
import type { Side } from '../../domain/types'

interface MuscleLibraryProps {
  muscles: MuscleCatalogEntry[]
  query: string
  onQueryChange: (query: string) => void
  selectedKeys: Set<string>
  onAdd: (muscle: MuscleCatalogEntry, side: Side) => void
  onNeedlePoint: (muscle: MuscleCatalogEntry, side: Side) => void
  expandedId: string | null
  onToggleExpanded: (id: string) => void
  /** phone / tablet layout: filters live in a sheet */
  compact: boolean
  activeFilterCount: number
  onOpenFilters: () => void
  onResetFilters: () => void
  /** measured top bar height, so the search row sticks directly beneath it */
  stickyTop: number
}

function SideButton({
  side,
  selected,
  muscleName,
  onClick,
}: {
  side: Side
  selected: boolean
  muscleName: string
  onClick: () => void
}) {
  return (
    <button
      className={`side-button side-${side}${selected ? ' is-on' : ''}`}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${selected ? '移除' : '加入'}${side === 'L' ? '左側' : '右側'} ${muscleName}`}
    >
      <span aria-hidden="true">{side}</span>
    </button>
  )
}

function MuscleRow({
  muscle,
  selectedKeys,
  expanded,
  onToggleExpanded,
  onAdd,
  onNeedlePoint,
}: {
  muscle: MuscleCatalogEntry
  selectedKeys: Set<string>
  expanded: boolean
  onToggleExpanded: () => void
  onAdd: MuscleLibraryProps['onAdd']
  onNeedlePoint: MuscleLibraryProps['onNeedlePoint']
}) {
  const leftSelected = selectedKeys.has(`L:${muscle.id}`)
  const rightSelected = selectedKeys.has(`R:${muscle.id}`)
  const queued = leftSelected || rightSelected
  const hasImage = hasNeedleGuideImage(muscle.name)
  const stages = pathwayStages(muscle).filter((stage) => stage.label !== 'Muscle')
  const detailId = `detail-${muscle.id}`

  return (
    <article className={`mrow${expanded ? ' is-open' : ''}${queued ? ' is-queued' : ''}`}>
      <button
        type="button"
        className="mrow-summary"
        aria-expanded={expanded}
        aria-controls={detailId}
        onClick={onToggleExpanded}
      >
        <span className="root-badge" title={muscle.rootLabel}>{muscle.rootLabel.replaceAll('-', '–')}</span>
        <span className="mrow-id">
          <strong>{muscle.name}</strong>
          <span className="mrow-meta">
            <span className="mrow-nerve">{muscle.nerveLabel}</span>
            {muscle.abbreviations[0] ? <span className="mrow-abbr">{muscle.abbreviations[0]}</span> : null}
          </span>
        </span>
        <span className={`guide-dot${hasImage ? ' has-image' : ''}`} aria-hidden="true" />
        <ChevronDown className="mrow-caret" size={18} aria-hidden="true" />
      </button>

      <div className="mrow-actions">
        <div className="side-pair" role="group" aria-label={`${muscle.name} 加入清單`}>
          <SideButton side="L" selected={leftSelected} muscleName={muscle.name} onClick={() => onAdd(muscle, 'L')} />
          <SideButton side="R" selected={rightSelected} muscleName={muscle.name} onClick={() => onAdd(muscle, 'R')} />
        </div>
        <button
          className={`needle-button${hasImage ? ' has-guide' : ''}`}
          type="button"
          onClick={() => onNeedlePoint(muscle, rightSelected && !leftSelected ? 'R' : 'L')}
          title={hasImage ? '查看扎針圖譜與說明' : '無課本圖片，開啟文字指引'}
          aria-label={`${muscle.name} 扎針點，${hasImage ? '有課本圖譜' : '無圖片，僅文字指引'}`}
        >
          <Crosshair size={16} aria-hidden="true" />
          <span>扎針點</span>
        </button>
      </div>

      <div className="mrow-detail" id={detailId} hidden={!expanded}>
        <ol className="chain">
          {stages.map((stage) => (
            <li className={`chain-step${stage.value === '—' ? ' is-empty' : ''}`} key={stage.label}>
              <span className="chain-label">{stage.label}</span>
              <strong className="chain-value">{stage.value}</strong>
            </li>
          ))}
        </ol>
        <div className="detail-foot">
          <span className={`source-tag${muscle.reviewStatus === 'book-sourced' ? ' is-book' : ''}`}>
            {muscle.reviewStatus === 'book-sourced' ? '課本校正' : 'Legacy 目錄'}
          </span>
          <span className="detail-note">Root {muscle.rootLabel}</span>
          {muscle.innervationSource ? <span className="detail-note">{muscle.innervationSource}</span> : null}
          {muscle.abbreviations.length > 1 ? (
            <span className="detail-note">別名 {muscle.abbreviations.join('、')}</span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function MuscleLibrary(props: MuscleLibraryProps) {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const areaCounts = new Map<string, number>()
  for (const muscle of props.muscles) {
    const area = clinicalAreaForMuscle(muscle)
    areaCounts.set(area, (areaCounts.get(area) ?? 0) + 1)
  }

  return (
    <section className="library" aria-labelledby="library-title">
      <h2 id="library-title" className="sr-only">肌肉清單</h2>

      <div className="library-bar" style={{ top: props.stickyTop }}>
        <div className="searchbar">
          <Search size={18} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            placeholder="搜尋 muscle / nerve / root"
            aria-label="搜尋肌肉、神經或神經根"
          />
          {props.query ? (
            <button type="button" onClick={() => props.onQueryChange('')} aria-label="清除搜尋">
              <X size={16} aria-hidden="true" />
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>

        {props.compact ? (
          <button type="button" className="filter-trigger" onClick={props.onOpenFilters}>
            <ListFilter size={17} aria-hidden="true" />
            <span>篩選</span>
            {props.activeFilterCount > 0 ? <em>{props.activeFilterCount}</em> : null}
          </button>
        ) : null}

        <p className="library-count" aria-live="polite">
          <strong>{props.muscles.length}</strong> 條肌肉
        </p>
      </div>

      <div className="muscle-results">
        {props.muscles.length === 0 ? (
          <div className="empty-state">
            <Search size={26} strokeWidth={1.5} aria-hidden="true" />
            <strong>找不到符合條件的肌肉</strong>
            <p>試著清除搜尋字串，或重設區域與 root 篩選。</p>
            <div className="empty-actions">
              {props.query ? (
                <button type="button" className="ghost-button" onClick={() => props.onQueryChange('')}>清除搜尋</button>
              ) : null}
              {props.activeFilterCount > 0 ? (
                <button type="button" className="ghost-button" onClick={props.onResetFilters}>重設篩選</button>
              ) : null}
            </div>
          </div>
        ) : (
          props.muscles.map((muscle, index) => {
            const area = clinicalAreaForMuscle(muscle)
            const previous = props.muscles[index - 1]
            const previousArea = previous ? clinicalAreaForMuscle(previous) : undefined
            const definition = muscleAreaById.get(area)

            return (
              <div className="area-block" key={muscle.id}>
                {area !== previousArea ? (
                  <div className="area-band">
                    <span className="area-band-group">{definition?.groupLabel}</span>
                    <h3>{definition?.label}</h3>
                    <span className="area-band-count">{areaCounts.get(area)}</span>
                  </div>
                ) : null}
                <MuscleRow
                  muscle={muscle}
                  selectedKeys={props.selectedKeys}
                  expanded={props.expandedId === muscle.id}
                  onToggleExpanded={() => props.onToggleExpanded(muscle.id)}
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
