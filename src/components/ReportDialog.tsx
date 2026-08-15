import { Copy, RefreshCw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { generateReport } from '../domain/report'
import type { Study } from '../domain/types'

interface ReportDialogProps {
  open: boolean
  study: Study
  onClose: () => void
  onImpressionChange: (value: string) => void
  onRegenerateImpression: () => void
}

export function ReportDialog({
  open,
  study,
  onClose,
  onImpressionChange,
  onRegenerateImpression,
}: ReportDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (!open) return
    setCopyState('idle')
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const report = useMemo(() => (open ? generateReport(study) : ''), [open, study])

  if (!open) return null

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog report-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="報告草稿"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dialog-header">
          <div>
            <h2>報告草稿</h2>
            <p className="dialog-sub">英文全文，可直接複製。Impression 需由醫師編輯後才可使用。</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="關閉"
          >
            <X size={18} />
          </button>
        </header>

        <div className="report-body">
          <label className="impression-field">
            <span className="impression-label">
              Impression (English)
              <button type="button" className="link-button" onClick={onRegenerateImpression}>
                <RefreshCw size={13} aria-hidden="true" />
                依結構化結果重建
              </button>
            </span>
            <textarea
              rows={5}
              maxLength={4000}
              value={study.impressionDraft}
              placeholder="Physician-authored impression."
              onChange={(event) => onImpressionChange(event.target.value)}
            />
          </label>

          <div className="report-preview">
            <div className="report-preview-head">
              <span>完整報告</span>
              <button type="button" className="link-button" onClick={copyReport}>
                <Copy size={13} aria-hidden="true" />
                {copyState === 'copied' ? '已複製' : copyState === 'failed' ? '複製失敗' : '複製全文'}
              </button>
            </div>
            <pre>{report}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
