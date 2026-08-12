import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { findMuscleByName } from '../../clinical/catalog'
import { NeedlePointDialog } from './NeedlePointDialog'

afterEach(cleanup)

describe('NeedlePointDialog', () => {
  it('does not show generic pre-examination reminders or an empty safety section', () => {
    render(
      <NeedlePointDialog
        muscle={findMuscleByName('Flexor Hallucis Brevis')}
        side="L"
        onClose={vi.fn()}
      />,
    )

    expect(screen.queryByText('檢查前確認')).not.toBeInTheDocument()
    expect(screen.queryByText('橫切面構造與避險')).not.toBeInTheDocument()
  })

  it('keeps muscle-specific anatomy and safety notes', () => {
    render(
      <NeedlePointDialog
        muscle={findMuscleByName('Abductor Hallucis')}
        side="R"
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('橫切面構造與避險')).toBeInTheDocument()
    expect(screen.getByText('進針太深可能傷及內側足底神經。')).toBeInTheDocument()
    expect(screen.getAllByText(/P&S 4e/).length).toBeGreaterThan(4)
    expect(screen.queryByText('檢查前確認')).not.toBeInTheDocument()
  })
})
