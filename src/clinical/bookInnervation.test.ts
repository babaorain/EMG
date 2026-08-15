import { describe, expect, it } from 'vitest'
import { bookInnervationByCatalogName } from './bookInnervation'
import { bookSourcedMuscleCount, findMuscleByName, muscleCatalog } from './catalog'
import { hasTextbookNeedleGuide } from './needleGuides'

describe('book-sourced muscle innervation', () => {
  it('covers every catalog muscle that has a chapter 13 needle guide', () => {
    const guidedNames = muscleCatalog
      .filter((muscle) => hasTextbookNeedleGuide(muscle.name))
      .map((muscle) => muscle.name)

    expect(bookSourcedMuscleCount).toBe(68)
    expect(bookInnervationByCatalogName.size).toBe(68)
    expect(guidedNames).toHaveLength(68)
    expect(guidedNames.filter((name) => !bookInnervationByCatalogName.has(name))).toEqual([])
  })

  it('applies the material root corrections from chapters 13 and 32', () => {
    expect(findMuscleByName('Flexor Pollicis Longus').roots).toEqual(['C7', 'C8', 'T1'])
    expect(findMuscleByName('Extensor Digitorum Longus').roots).toEqual(['L4', 'L5'])
    expect(findMuscleByName('Tibialis Posterior').roots).toEqual(['L5', 'S1'])
    expect(findMuscleByName('Semimembranosus').roots).toEqual(['L4', 'L5', 'S1'])
    expect(findMuscleByName('Iliopsoas').roots).toEqual(['L2', 'L3', 'L4'])
  })

  it('preserves dual and branch-specific terminal nerve descriptions', () => {
    const flexorPollicisBrevis = findMuscleByName('Flexor Pollicis Brevis')
    expect(flexorPollicisBrevis.nerveLabel).toBe('Median / Ulnar N.')
    expect(flexorPollicisBrevis.pathway.nerveSiteIds).toEqual([
      'nerve-median-ulnar',
      'nerve-median',
      'nerve-ulnar',
    ])
    expect(findMuscleByName('Frontalis').nerveLabel).toBe('Frontal branch (Facial N.)')
    expect(findMuscleByName('Masseter').nerveLabel).toBe('Mandibular N. (V3)')
  })
})
