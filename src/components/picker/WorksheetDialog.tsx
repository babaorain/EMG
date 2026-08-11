import { Download, Printer, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { worksheetColumns, worksheetCsv, worksheetRow } from '../../domain/muscleSelection'
import type { ResolvedSelectedMuscle } from './SelectedMusclesPanel'

interface WorksheetDialogProps {
  rows: ResolvedSelectedMuscle[]
  onClose: () => void
}

export function WorksheetDialog({ rows, onClose }: WorksheetDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [headerText, setHeaderText] = useState('')

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const downloadCsv = () => {
    const csv = worksheetCsv(rows.map(({ muscle, selection }) => ({ muscle, side: selection.side })))
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'needle-emg-worksheet.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog worksheet-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="worksheet-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dialog-header worksheet-dialog-header">
          <div>
            <h2 id="worksheet-dialog-title">空白 Needle EMG 檢查表</h2>
            <p>已依 Root 由上至下排序 · {rows.length} muscles</p>
          </div>
          <button ref={closeRef} className="dialog-close" type="button" onClick={onClose} aria-label="關閉">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="worksheet-context-editor">
          <label htmlFor="worksheet-header-text">列印頁首文字</label>
          <textarea
            id="worksheet-header-text"
            value={headerText}
            onChange={(event) => setHeaderText(event.target.value)}
            rows={3}
            placeholder="可貼入病人資料、檢查日期、臨床問題或其他備註；此內容會印在表格上方。"
          />
        </div>

        <div className="worksheet-scroll">
          <div className="worksheet-print-header">
            <h1>Needle EMG Worksheet</h1>
            <p>{headerText}</p>
          </div>
          <table className="worksheet-table">
            <thead>
              <tr>{worksheetColumns.map((column) => <th key={column}>{column}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map(({ selection, muscle }) => (
                <tr key={selection.key}>
                  {worksheetRow(muscle, selection.side).map((cell, index) => (
                    <td key={`${selection.key}-${worksheetColumns[index]}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="dialog-footer worksheet-footer">
          <button type="button" onClick={onClose}>返回選擇</button>
          <button type="button" onClick={downloadCsv}>
            <Download size={16} aria-hidden="true" />
            下載 CSV
          </button>
          <button className="primary-small-button" type="button" onClick={() => window.print()}>
            <Printer size={16} aria-hidden="true" />
            列印 / PDF
          </button>
        </footer>
      </section>
    </div>
  )
}
