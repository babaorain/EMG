import { FileSpreadsheet, Trash2, X } from 'lucide-react'
import type { MuscleCatalogEntry } from '../../clinical/catalog'
import type { SelectedMuscle } from '../../domain/muscleSelection'

export interface ResolvedSelectedMuscle {
  selection: SelectedMuscle
  muscle: MuscleCatalogEntry
}

interface SelectedMusclesPanelProps {
  rows: ResolvedSelectedMuscle[]
  onRemove: (key: string) => void
  onClear: () => void
  onOpenWorksheet: () => void
}

export function SelectedMusclesPanel({
  rows,
  onRemove,
  onClear,
  onOpenWorksheet,
}: SelectedMusclesPanelProps) {
  return (
    <aside className="selected-panel" aria-labelledby="selected-title">
      <div className="selected-header">
        <div>
          <p className="eyebrow">Worksheet queue</p>
          <h2 id="selected-title">已選肌肉 <span>{rows.length}</span></h2>
        </div>
        {rows.length > 0 && (
          <button className="clear-button" type="button" onClick={onClear}>
            <Trash2 size={14} aria-hidden="true" />
            清除
          </button>
        )}
      </div>

      <div className="selected-list-wrap">
        {rows.length === 0 ? (
          <div className="selected-empty">
            <FileSpreadsheet size={25} strokeWidth={1.5} aria-hidden="true" />
            <p>尚未選擇肌肉</p>
            <span>從左側以 L／R 加入，清單會自動依 Root 排序。</span>
          </div>
        ) : (
          <ol className="selected-list">
            {rows.map(({ selection, muscle }) => (
              <li key={selection.key}>
                <div className="selected-root-side">
                  <strong>{muscle.rootLabel}</strong>
                  <span>{selection.side}</span>
                </div>
                <div className="selected-identity">
                  <strong>{muscle.name}</strong>
                  <span>{muscle.nerveLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(selection.key)}
                  aria-label={`移除 ${selection.side} ${muscle.name}`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="selected-footer">
        <p>輸出 IA、SA、MUAP、Recruitment、Activation 等空白欄位。</p>
        <button
          className="worksheet-button"
          type="button"
          disabled={rows.length === 0}
          onClick={onOpenWorksheet}
        >
          <FileSpreadsheet size={18} aria-hidden="true" />
          產生空白檢查表
        </button>
      </div>
    </aside>
  )
}
