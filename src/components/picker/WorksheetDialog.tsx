import { Download, FileSpreadsheet, Printer, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { worksheetColumns, worksheetCsv, worksheetRow } from '../../domain/muscleSelection'
import { Overlay } from '../ui/Overlay'
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
  }, [])

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
    <Overlay labelledBy="worksheet-dialog-title" panelClass="worksheet-dialog" onClose={onClose}>
      <header className="dialog-head worksheet-dialog-header">
        <div className="dialog-head-copy">
          <span className="eyebrow">
            <FileSpreadsheet size={13} aria-hidden="true" />
            Blank worksheet
          </span>
          <h2 id="worksheet-dialog-title">空白 Needle EMG 檢查表</h2>
          <p className="dialog-head-meta">
            <span>{rows.length} 條肌肉</span>
            <span>依 root 由上至下排序</span>
            <span>A4 橫向列印</span>
          </p>
        </div>
        <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="關閉">
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="worksheet-context-editor">
        <label htmlFor="worksheet-header-text">列印頁首文字</label>
        <textarea
          id="worksheet-header-text"
          value={headerText}
          onChange={(event) => setHeaderText(event.target.value)}
          rows={2}
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

      <footer className="dialog-foot worksheet-footer">
        <button type="button" className="ghost-button" onClick={onClose}>返回選擇</button>
        <button type="button" className="secondary-button" onClick={downloadCsv}>
          <Download size={16} aria-hidden="true" />
          下載 CSV
        </button>
        <button className="primary-button" type="button" onClick={() => window.print()}>
          <Printer size={16} aria-hidden="true" />
          列印 / PDF
        </button>
      </footer>
    </Overlay>
  )
}
