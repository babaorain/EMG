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

  it('shows reusable external media in place and removes repetitive reminder fields', () => {
    render(
      <NeedlePointDialog
        muscle={findMuscleByName('Popliteus')}
        side="L"
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('解剖與定位圖')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Popliteus 解剖位置' })).toHaveAttribute('loading', 'eager')
    expect(screen.getByRole('link', { name: /Henry Vandyke Carter／Wikimedia Commons/ })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'Public Domain' })).toHaveAttribute('href', 'https://creativecommons.org/publicdomain/mark/1.0/')
    expect(screen.getByText('來源')).toBeInTheDocument()
    expect(screen.getByText(/本工具目前不提供常規 blind diagnostic needle route/)).toBeInTheDocument()
    expect(screen.queryByText(/外部連結/)).not.toBeInTheDocument()
    expect(screen.queryByText(/圖片／影片未在本站重製/)).not.toBeInTheDocument()
    expect(screen.queryByText(/臨床內容：待 EMG 醫師複核/)).not.toBeInTheDocument()
    expect(screen.queryByText('完整來源與複核狀態')).not.toBeInTheDocument()
    expect(screen.queryByText('網路來源文字圖譜')).not.toBeInTheDocument()
  })
})
