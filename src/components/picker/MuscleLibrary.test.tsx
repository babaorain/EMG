import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { findMuscleByName } from '../../clinical/catalog'
import { MuscleLibrary } from './MuscleLibrary'

afterEach(cleanup)

describe('MuscleLibrary guide indicators', () => {
  it('uses separate indicators for textbook figures and web-reference guides', () => {
    const { container } = render(
      <MuscleLibrary
        muscles={[
          findMuscleByName('Flexor Hallucis Brevis'),
          findMuscleByName('Popliteus'),
        ]}
        query=""
        onQueryChange={vi.fn()}
        selectedKeys={new Set()}
        onAdd={vi.fn()}
        onNeedlePoint={vi.fn()}
        expandedId={null}
        onToggleExpanded={vi.fn()}
        compact={false}
        activeFilterCount={0}
        onOpenFilters={vi.fn()}
        onResetFilters={vi.fn()}
        stickyTop={60}
      />,
    )

    expect(screen.getByRole('button', { name: /Flexor Hallucis Brevis 扎針點，有課本圖版/ })).toHaveClass('has-book-guide')
    expect(screen.getByRole('button', { name: /Popliteus 扎針點，有補充圖譜/ })).toHaveClass('has-web-guide')
    expect(container.querySelectorAll('.guide-dot.is-book')).toHaveLength(1)
    expect(container.querySelectorAll('.guide-dot.is-web')).toHaveLength(1)
  })
})
