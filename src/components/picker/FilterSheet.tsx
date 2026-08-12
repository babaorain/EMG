import { X } from 'lucide-react'
import { Overlay } from '../ui/Overlay'
import { FilterPanel } from './FilterPanel'
import type { ComponentProps } from 'react'

interface FilterSheetProps extends ComponentProps<typeof FilterPanel> {
  resultCount: number
  onClose: () => void
}

export function FilterSheet({ resultCount, onClose, ...panel }: FilterSheetProps) {
  return (
    <Overlay labelledBy="filter-sheet-title" panelClass="sheet filter-sheet" onClose={onClose}>
      <header className="sheet-head">
        <div>
          <span className="eyebrow">Filters</span>
          <h2 id="filter-sheet-title">篩選肌肉</h2>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="關閉">
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="sheet-body">
        <FilterPanel {...panel} />
      </div>

      <footer className="sheet-foot">
        <button type="button" className="primary-button" onClick={onClose}>
          顯示 {resultCount} 條肌肉
        </button>
      </footer>
    </Overlay>
  )
}
