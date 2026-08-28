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
    expect(screen.queryByText('網路來源文字圖譜')).not.toBeInTheDocument()
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

  it('labels source checking separately from pending physician review', () => {
    render(
      <NeedlePointDialog
        muscle={findMuscleByName('Popliteus')}
        side="L"
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('證據有限／不提供一般盲刺路徑')).toBeInTheDocument()
    expect(screen.getByText(/來源查核：2026-08-28/)).toBeInTheDocument()
    expect(screen.getByText('臨床內容：待 EMG 醫師複核')).toBeInTheDocument()
    expect(screen.queryByText(/臨床複核：/)).not.toBeInTheDocument()
    expect(screen.getByText(/本工具目前不提供常規 blind diagnostic needle route/)).toBeInTheDocument()
    expect(screen.getByText('網路圖譜與來源')).toBeInTheDocument()
    expect(screen.getByText('網路來源文字圖譜')).toBeInTheDocument()
    expect(screen.getByText('Popliteus：低效益、高鄰近風險')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /EMG Atlas.*Popliteus/i })).toHaveAttribute('target', '_blank')
  })
})
