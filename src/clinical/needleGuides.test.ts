import { describe, expect, it } from 'vitest'
import { muscleCatalog } from './catalog'
import { needleGuides, needleGuidesForMuscle } from './needleGuides'

describe('chapter 13 needle guides', () => {
  it('covers every figure from 13.1 through 13.63 exactly once', () => {
    const figures = needleGuides.flatMap((guide) => guide.figures)
    expect(figures).toEqual(Array.from({ length: 63 }, (_, index) => index + 1))
  })

  it('maps every guide to a muscle in the catalog', () => {
    const catalogNames = new Set(muscleCatalog.map((muscle) => muscle.name))
    const missingNames = needleGuides
      .flatMap((guide) => guide.catalogNames)
      .filter((name) => !catalogNames.has(name))
    expect(missingNames).toEqual([])
  })

  it('supports multiple guide variants and multiple images', () => {
    expect(needleGuidesForMuscle('Quadriceps (Vastus/Rectus)')).toHaveLength(3)
    expect(needleGuidesForMuscle('Paraspinal (C5)')[0]?.images).toHaveLength(3)
    expect(needleGuidesForMuscle('Gluteus Major')[0]?.images).toHaveLength(2)
  })
})
