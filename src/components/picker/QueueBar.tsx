import { ChevronUp, FileSpreadsheet, Trash2, X } from 'lucide-react'
import { Overlay } from '../ui/Overlay'
import { QueueList, QueueSummary, type ResolvedSelectedMuscle } from './SelectedMusclesPanel'

interface QueueBarProps {
  rows: ResolvedSelectedMuscle[]
  onOpenQueue: () => void
  onOpenWorksheet: () => void
}

/** Fixed bottom bar on phones: the queue is one thumb-reach away at all times. */
export function QueueBar({ rows, onOpenQueue, onOpenWorksheet }: QueueBarProps) {
  return (
    <div className="action-bar">
      <button type="button" className="action-bar-open" onClick={onOpenQueue}>
        <span className="count-badge">{rows.length}</span>
        <span className="action-bar-label">
          已選肌肉
          <em>{rows.length === 0 ? '尚未加入' : '檢視或移除'}</em>
        </span>
        <ChevronUp size={17} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="primary-button"
        disabled={rows.length === 0}
        onClick={onOpenWorksheet}
      >
        <FileSpreadsheet size={17} aria-hidden="true" />
        檢查表
      </button>
    </div>
  )
}

interface QueueSheetProps extends QueueBarProps {
  onRemove: (key: string) => void
  onClear: () => void
  onClose: () => void
}

export function QueueSheet({ rows, onRemove, onClear, onOpenWorksheet, onClose }: QueueSheetProps) {
  return (
    <Overlay labelledBy="queue-sheet-title" panelClass="sheet queue-sheet" onClose={onClose}>
      <header className="sheet-head">
        <div>
          <span className="eyebrow">Worksheet queue</span>
          <h2 id="queue-sheet-title">已選肌肉 <span className="count-badge">{rows.length}</span></h2>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="關閉">
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      {rows.length > 0 ? (
        <div className="sheet-subhead">
          <QueueSummary rows={rows} />
          <button className="ghost-button" type="button" onClick={onClear}>
            <Trash2 size={14} aria-hidden="true" />
            清除全部
          </button>
        </div>
      ) : null}

      <div className="sheet-body">
        <QueueList rows={rows} onRemove={onRemove} />
      </div>

      <footer className="sheet-foot">
        <button
          className="primary-button"
          type="button"
          disabled={rows.length === 0}
          onClick={onOpenWorksheet}
        >
          <FileSpreadsheet size={17} aria-hidden="true" />
          產生空白檢查表
        </button>
      </footer>
    </Overlay>
  )
}
