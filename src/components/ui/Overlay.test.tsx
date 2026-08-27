import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Overlay } from './Overlay'

afterEach(cleanup)

function OverlayHarness() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>開啟圖譜</button>
      {open && (
        <Overlay labelledBy="test-dialog-title" onClose={() => setOpen(false)}>
          <h2 id="test-dialog-title">扎針圖譜</h2>
          <button type="button">第一個動作</button>
          <a href="https://example.com/reference">最後一個連結</a>
        </Overlay>
      )}
    </>
  )
}

describe('Overlay', () => {
  it('moves focus into the dialog, traps Tab, and restores the opener on Escape', async () => {
    const user = userEvent.setup()
    render(<OverlayHarness />)

    const opener = screen.getByRole('button', { name: '開啟圖譜' })
    await user.click(opener)

    const first = screen.getByRole('button', { name: '第一個動作' })
    const last = screen.getByRole('link', { name: '最後一個連結' })
    expect(first).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')

    last.focus()
    await user.tab()
    expect(first).toHaveFocus()

    first.focus()
    await user.tab({ shift: true })
    expect(last).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })
})
