import { describe, expect, it } from 'vitest'
import { muscleCatalog } from './catalog'
import { hasNeedleGuideImage, needleGuides, needleGuidesForMuscle } from './needleGuides'

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

  it('provides either an image guide or a text guide for every catalog muscle', () => {
    expect(
      muscleCatalog
        .filter((muscle) => needleGuidesForMuscle(muscle.name).length === 0)
        .map((muscle) => muscle.name),
    ).toEqual([])
  })

  it('supports multiple guide variants and multiple images', () => {
    expect(needleGuidesForMuscle('Quadriceps (Vastus/Rectus)')).toHaveLength(3)
    expect(needleGuidesForMuscle('Gluteus Major')[0]?.images).toHaveLength(2)
  })

  it('keeps cervical, thoracic, and lumbosacral paraspinal figures separate', () => {
    expect(needleGuidesForMuscle('Paraspinal (C5)')[0]?.figures).toEqual([56])
    expect(needleGuidesForMuscle('Paraspinal (Thoracic)')[0]?.figures).toEqual([57])
    expect(needleGuidesForMuscle('Paraspinal (L5)')[0]?.figures).toEqual([58])
  })

  it('provides text-only guidance without marking it as an available image', () => {
    const guide = needleGuidesForMuscle('Popliteus')[0]
    expect(guide?.sourceKind).toBe('supplemental')
    expect(guide?.images).toEqual([])
    expect(hasNeedleGuideImage('Popliteus')).toBe(false)
  })
})
