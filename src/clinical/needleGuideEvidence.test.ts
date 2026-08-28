import { describe, expect, it } from 'vitest'
import { supplementalNeedleGuideInputs } from './supplementalNeedleGuides'
import {
  citationsForGuidePart,
  evidenceSource,
  needleEvidenceSources,
  supplementalGuideEvidence,
} from './needleGuideEvidence'

describe('needle guide evidence registry', () => {
  it('covers every text-only guide without orphan evidence records', () => {
    const guideIds = supplementalNeedleGuideInputs.map((guide) => guide.id).sort()
    expect(Object.keys(supplementalGuideEvidence).sort()).toEqual(guideIds)
  })

  it('resolves a precise locator for every visible supplemental field and point', () => {
    for (const guide of supplementalNeedleGuideInputs) {
      const evidence = supplementalGuideEvidence[guide.id]
      expect(evidence, guide.id).toBeDefined()

      const references = [
        ...citationsForGuidePart(evidence, 'innervation'),
        ...citationsForGuidePart(evidence, 'insertion'),
        ...citationsForGuidePart(evidence, 'activation'),
        ...guide.clinicalPoints.flatMap((_, index) => citationsForGuidePart(evidence, 'clinicalPoint', index)),
        ...guide.anatomyPoints.flatMap((_, index) => citationsForGuidePart(evidence, 'anatomyPoint', index)),
      ]

      expect(references.length, guide.id).toBeGreaterThanOrEqual(3 + guide.clinicalPoints.length + guide.anatomyPoints.length)
      for (const reference of references) {
        expect(reference.locator.trim(), `${guide.id}:${reference.sourceId}`).not.toBe('')
        expect(reference.relation, `${guide.id}:${reference.sourceId}`).toBeDefined()
        expect(() => evidenceSource(reference.sourceId)).not.toThrow()
      }
    }
  })

  it('forbids limited-evidence guides from implicitly laundering one default source across all claims', () => {
    for (const guide of supplementalNeedleGuideInputs) {
      const evidence = supplementalGuideEvidence[guide.id]
      if (evidence.evidenceStatus !== 'limited-evidence') continue

      expect(evidence.fieldCitations?.innervation, `${guide.id}:innervation`).toBeTruthy()
      expect(evidence.fieldCitations?.insertion, `${guide.id}:insertion`).toBeTruthy()
      expect(evidence.fieldCitations?.activation, `${guide.id}:activation`).toBeTruthy()
      expect(evidence.clinicalPointCitations, `${guide.id}:clinical`).toHaveLength(guide.clinicalPoints.length)
      expect(evidence.anatomyPointCitations, `${guide.id}:anatomy`).toHaveLength(guide.anatomyPoints.length)
    }
  })

  it('keeps external media link-only and marks clinical review as pending', () => {
    for (const evidence of Object.values(supplementalGuideEvidence)) {
      expect(evidence.clinicalReviewStatus).toBe('pending-emg-physician')
      expect(evidence.resources.length).toBeGreaterThan(0)
      for (const resource of evidence.resources) expect(resource.rights).toBe('link-only')
    }
  })

  it('stores full HTTPS source records and corrected authorship', () => {
    for (const source of Object.values(needleEvidenceSources)) {
      expect(source.url).toMatch(/^https:\/\//)
      expect(source.citation.trim()).not.toBe('')
      expect(source.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }

    expect(needleEvidenceSources['menkes-pierce-2019'].citation).toContain('Menkes DL, Pierce R')
    expect(needleEvidenceSources['menkes-pierce-2019'].citation).not.toContain('Nayak')
    expect(needleEvidenceSources['statpearls-shoulder-2023'].citation).toContain('Miniato MA')
  })
})
