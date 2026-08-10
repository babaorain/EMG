import { Crosshair, Info, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { MuscleCatalogEntry } from '../../clinical/catalog'
import type { Side } from '../../domain/types'

interface NeedlePointDialogProps {
  muscle: MuscleCatalogEntry
  side: Side
  onClose: () => void
}

const fields = [
  '病人姿勢',
  'Surface landmark',
  'Needle insertion',
  'Direction / depth',
  'Avoid / caution',
]

export function NeedlePointDialog({ muscle, side, onClose }: NeedlePointDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog needle-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="needle-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dialog-header needle-dialog-header">
          <div>
            <div className="needle-title-line">
              <h2 id="needle-dialog-title">{muscle.name}</h2>
              <span>扎針點</span>
            </div>
            <p>{side} · {muscle.rootLabel} · {muscle.nerveLabel}</p>
          </div>
          <button ref={closeRef} className="dialog-close" type="button" onClick={onClose} aria-label="關閉">
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <div className="needle-dialog-body">
          <div className="needle-placeholder" aria-label="示意圖待補">
            <Crosshair size={42} strokeWidth={1.25} aria-hidden="true" />
            <strong>示意圖待補</strong>
          </div>
          <dl className="needle-fields">
            {fields.map((field) => (
              <div key={field}>
                <dt>{field}</dt>
                <dd>待你提供資料</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="needle-review-note">
          <Info size={17} aria-hidden="true" />
          此頁只顯示經臨床覆核的扎針資料
        </div>
        <footer className="dialog-footer">
          <button className="primary-small-button" type="button" onClick={onClose}>關閉</button>
        </footer>
      </section>
    </div>
  )
}
