import { describe, expect, it } from 'vitest'
import { summarizePolyphasia } from './polyphasia'
import type { PolyphasiaQuadrants } from './types'

function quadrants(partial: Partial<PolyphasiaQuadrants>): PolyphasiaQuadrants {
  return { q1: {}, q2: {}, q3: {}, q4: {}, ...partial }
}

describe('summarizePolyphasia', () => {
  it('reports nothing sampled for an untouched muscle', () => {
    const summary = summarizePolyphasia({ quadrants: quadrants({}) })
    expect(summary.completeness).toBe('none')
    expect(summary.percent).toBeUndefined()
    expect(summary.totalObserved).toBe(0)
  })

  it('totals four complete passes and derives a percentage', () => {
    const summary = summarizePolyphasia({
      quadrants: quadrants({
        q1: { observedMuaps: 10, polyphasicMuaps: 2 },
        q2: { observedMuaps: 10, polyphasicMuaps: 2 },
        q3: { observedMuaps: 8, polyphasicMuaps: 1 },
        q4: { observedMuaps: 12, polyphasicMuaps: 2 },
      }),
    })
    expect(summary.totalObserved).toBe(40)
    expect(summary.totalPolyphasic).toBe(7)
    expect(summary.percent).toBe(17.5)
    expect(summary.completeness).toBe('complete')
  })

  it('withholds a percentage while a pass is only half entered', () => {
    const summary = summarizePolyphasia({
      quadrants: quadrants({
        q1: { observedMuaps: 10, polyphasicMuaps: 2 },
        q2: { observedMuaps: 10 },
      }),
    })
    expect(summary.incompleteQuadrants).toEqual(['q2'])
    expect(summary.percent).toBeUndefined()
    expect(summary.completeness).toBe('partial')
  })

  it('withholds a percentage when polyphasic exceeds observed', () => {
    const summary = summarizePolyphasia({
      quadrants: quadrants({ q1: { observedMuaps: 5, polyphasicMuaps: 9 } }),
    })
    expect(summary.invalidQuadrants).toEqual(['q1'])
    expect(summary.percent).toBeUndefined()
  })
})
