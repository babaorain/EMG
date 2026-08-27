import { useEffect, useRef, type ReactNode } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function focusableElements(panel: HTMLElement) {
  return [...panel.querySelectorAll<HTMLElement>(focusableSelector)]
    .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true')
}

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
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = focusableElements(panel)
      if (!focusable.length) {
        event.preventDefault()
        panel.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const focusIsOutside = !panel.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    if (panel) (focusableElements(panel)[0] ?? panel).focus()
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [onClose])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={panelRef}
        className={`dialog ${panelClass}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </section>
    </div>
  )
}
