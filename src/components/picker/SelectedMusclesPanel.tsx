import { ClipboardList, FileSpreadsheet, Trash2, X } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { MuscleCatalogEntry } from '../../clinical/catalog'
import type { SelectedMuscle } from '../../domain/muscleSelection'

export interface ResolvedSelectedMuscle {
  selection: SelectedMuscle
  muscle: MuscleCatalogEntry
}

interface QueueProps {
  rows: ResolvedSelectedMuscle[]
  onRemove: (key: string) => void
  onClear: () => void
  onOpenWorksheet: () => void
}

interface PanelProps extends QueueProps {
  /** sticky offset and height cap measured from the top bar */
  style?: CSSProperties
}

export function QueueList({ rows, onRemove }: Pick<QueueProps, 'rows' | 'onRemove'>) {
  if (rows.length === 0) {
    return (
      <div className="queue-empty">
        <ClipboardList size={26} strokeWidth={1.4} aria-hidden="true" />
        <strong>清單還是空的</strong>
        <p>在肌肉列上按 <em>L</em> 或 <em>R</em> 加入，清單會自動依 root 由上而下排序。</p>
      </div>
    )
  }

  return (
    <ol className="queue-list">
      {rows.map(({ selection, muscle }) => (
        <li key={selection.key}>
          <span className={`side-tag side-${selection.side}`}>{selection.side}</span>
          <span className="queue-identity">
            <strong>{muscle.name}</strong>
            <span>{muscle.rootLabel.replaceAll('-', '–')} · {muscle.nerveLabel}</span>
          </span>
          <button
            type="button"
            className="queue-remove"
            onClick={() => onRemove(selection.key)}
            aria-label={`移除 ${selection.side === 'L' ? '左側' : '右側'} ${muscle.name}`}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ol>
  )
}

export function QueueSummary({ rows }: { rows: ResolvedSelectedMuscle[] }) {
  const left = rows.filter((row) => row.selection.side === 'L').length
  const right = rows.length - left
  return (
    <p className="queue-summary">
      <span className="side-tag side-L">L</span> {left}
      <span className="side-tag side-R">R</span> {right}
    </p>
  )
}

export function SelectedMusclesPanel({ rows, onRemove, onClear, onOpenWorksheet, style }: PanelProps) {
  return (
    <aside className="queue-panel" aria-labelledby="queue-title" style={style}>
      <header className="queue-head">
        <div>
          <span className="eyebrow">Worksheet queue</span>
          <h2 id="queue-title">已選肌肉 <span className="count-badge">{rows.length}</span></h2>
        </div>
        {rows.length > 0 ? (
          <button className="ghost-button" type="button" onClick={onClear}>
            <Trash2 size={14} aria-hidden="true" />
            清除
          </button>
        ) : null}
      </header>

      {rows.length > 0 ? <QueueSummary rows={rows} /> : null}

      <div className="queue-body">
        <QueueList rows={rows} onRemove={onRemove} />
      </div>

      <footer className="queue-foot">
        <button
          className="primary-button"
          type="button"
          disabled={rows.length === 0}
          onClick={onOpenWorksheet}
        >
          <FileSpreadsheet size={17} aria-hidden="true" />
          產生空白檢查表
        </button>
        <p>包含 IA、Fib／PSW、MUAP、Recruitment、Activation 等空白欄位。</p>
      </footer>
    </aside>
  )
}
