import { describe, expect, it } from 'vitest'
import { commonNcvStudies, ncvStudies, supplementalNcvStudies } from './ncvStudies'

describe('NCV technique reference', () => {
  it('contains the complete textbook technique set plus F-wave', () => {
    expect(ncvStudies).toHaveLength(34)
    expect(new Set(ncvStudies.map((study) => study.id)).size).toBe(ncvStudies.length)
    expect(ncvStudies.some((study) => study.id === 'blink-reflex')).toBe(true)
    expect(ncvStudies.some((study) => study.id === 'soleus-h-reflex')).toBe(true)
    expect(ncvStudies.some((study) => study.id === 'f-wave')).toBe(true)
  })

  it('keeps every study clinically actionable and linked to a textbook image', () => {
    for (const study of ncvStudies) {
      expect(study.recording.target).not.toBe('')
      expect(study.recording.g1).not.toBe('')
      expect(study.recording.g2).not.toBe('')
      expect(study.recording.ground).not.toBe('')
      expect(study.cathode).not.toBe('')
      expect(study.position).not.toBe('')
      expect(study.stimulations.length).toBeGreaterThan(0)
      expect(study.normalValues.length).toBeGreaterThan(0)
      expect(study.notes.length).toBeGreaterThan(0)
      expect(study.images.length).toBeGreaterThan(0)
      expect(study.images.every((entry) => entry.src.startsWith('/ncv-guides/'))).toBe(true)
      expect(study.sourceLocator).not.toBe('')
    }
  })

  it('keeps common studies visually separate from supplemental studies', () => {
    expect(commonNcvStudies.length).toBeGreaterThan(10)
    expect(supplementalNcvStudies.length).toBeGreaterThan(10)
    expect(commonNcvStudies.length + supplementalNcvStudies.length).toBe(ncvStudies.length)
  })
})
