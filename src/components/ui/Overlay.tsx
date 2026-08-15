import { useEffect, type ReactNode } from 'react'

interface OverlayProps {
  /** id of the element that names the panel */
  labelledBy: string
  /** extra classes on the panel, e.g. `needle-dialog` or `sheet` */
  panelClass?: string
  onClose: () => void
  children: ReactNode
}

/**
 * Shared shell for every dialog and bottom sheet: backdrop dismiss, Escape,
 * and a body scroll lock so the page behind cannot be dragged on touch.
 * Class names are kept stable because the print stylesheet targets them.
 */
export function Overlay({ labelledBy, panelClass = '', onClose, children }: OverlayProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`dialog ${panelClass}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </section>
    </div>
  )
}
