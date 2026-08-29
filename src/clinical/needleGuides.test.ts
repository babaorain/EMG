import { describe, expect, it } from 'vitest'
import { muscleCatalog } from './catalog'
import {
  hasExternalNeedleGuide,
  hasNeedleGuideImage,
  needleGuideAvailabilityForMuscle,
  needleGuideImageCatalogNames,
  needleGuideWebCatalogNames,
} from './needleGuideAvailability'
import { needleGuides, needleGuidesForMuscle } from './needleGuides'
import { supplementalNeedleMediaByGuideId } from './supplementalNeedleMedia'

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
    expect(needleGuidesForMuscle('Paraspinal (Cervical)')[0]?.figures).toEqual([56])
    expect(needleGuidesForMuscle('Paraspinal (Thoracic)')[0]?.figures).toEqual([57])
    expect(needleGuidesForMuscle('Paraspinal (L5)')[0]?.figures).toEqual([58])
  })

  it('distinguishes web-reference guidance from textbook images', () => {
    const guide = needleGuidesForMuscle('Popliteus')[0]
    expect(guide?.sourceKind).toBe('supplemental')
    expect(guide?.images.length).toBeGreaterThan(0)
    expect(guide?.images[0]?.credit).toBeDefined()
    expect(hasNeedleGuideImage('Popliteus')).toBe(false)
    expect(hasExternalNeedleGuide('Popliteus')).toBe(true)
    expect(needleGuideAvailabilityForMuscle('Popliteus')).toBe('web-reference')
    expect(needleGuideAvailabilityForMuscle('Tibialis Anterior')).toBe('textbook-image')
  })

  it('keeps the first-load image manifest synchronized with guide data', () => {
    const actual = [...new Set(
      needleGuides
        .filter((guide) => guide.sourceKind === 'textbook' && guide.images.length > 0)
        .flatMap((guide) => guide.catalogNames),
    )].sort()
    expect([...needleGuideImageCatalogNames].sort()).toEqual(actual)
  })

  it('keeps all 34 web-reference indicators synchronized with supplemental guides', () => {
    const actual = [...new Set(
      needleGuides
        .filter((guide) => guide.sourceKind === 'supplemental')
        .flatMap((guide) => guide.catalogNames),
    )].sort()
    expect(needleGuideWebCatalogNames).toHaveLength(34)
    expect([...needleGuideWebCatalogNames].sort()).toEqual(actual)
  })

  it('embeds attributable media for all 34 supplemental guides', () => {
    const supplementalGuides = needleGuides.filter((guide) => guide.sourceKind === 'supplemental')
    expect(Object.keys(supplementalNeedleMediaByGuideId).sort()).toEqual(
      supplementalGuides.map((guide) => guide.id).sort(),
    )
    supplementalGuides.forEach((guide) => {
      expect(guide.images.length, guide.id).toBeGreaterThan(0)
      guide.images.forEach((image) => {
        expect(image.src, guide.id).toMatch(/^https:\/\//)
        expect(image.kind, guide.id).toMatch(/^(anatomy|surface-landmark|ultrasound)$/)
        expect(image.credit?.url, guide.id).toMatch(/^https:\/\//)
        expect(image.credit?.license, guide.id).toBeTruthy()
        expect(image.credit?.licenseUrl, guide.id).toMatch(/^https:\/\//)
      })
    })
  })
})
