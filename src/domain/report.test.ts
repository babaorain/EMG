import { describe, expect, it } from 'vitest'
import { findMuscleByName } from '../clinical/catalog'
import { createEmptyFinding } from './finding'
import { generateDraftImpression, generateReport } from './report'
import type { CoverageState, NeedleFinding, Study } from './types'

function finding(
  name: string,
  coverage: CoverageState,
  changes: Partial<NeedleFinding> = {},
): NeedleFinding {
  return {
    ...createEmptyFinding(findMuscleByName(name).id, 'R', '2026-07-25T00:00:00.000Z'),
    coverage,
    ...changes,
  }
}

function study(findings: NeedleFinding[], impressionDraft = ''): Study {
  return {
    id: 'test',
    label: 'Teaching case',
    studyDate: '2026-07-25',
    findings,
    impressionDraft,
  }
}

const c6Pattern = [
  finding('Biceps Brachii', 'abnormal'),
  finding('Deltoid (Ant/Mid/Post)', 'abnormal'),
  finding('Triceps Brachii', 'normal'),
  finding('Abd. Pollicis Brevis', 'normal'),
]

describe('generateReport', () => {
  it('states that it is not a signed report', () => {
    expect(generateReport(study([]))).toContain('Not a signed diagnostic report.')
  })

  it('lists the nerve and roots beside each finding', () => {
    const report = generateReport(study([finding('Biceps Brachii', 'abnormal')]))
    expect(report).toContain('Right Biceps Brachii [Musculocutaneous, C5-C6]')
  })

  it('carries the localization result into the report', () => {
    const report = generateReport(study(c6Pattern))
    expect(report).toContain('LOCALIZATION SUPPORT')
    expect(report).toContain('C6 root')
    expect(report).toContain('Upper trunk')
  })

  it('separates planned muscles from completed ones', () => {
    const report = generateReport(
      study([finding('Biceps Brachii', 'abnormal'), finding('Triceps Brachii', 'not_tested')]),
    )
    expect(report).toContain('PLANNED / NOT YET TESTED\nRight Triceps Brachii')
  })

  it('records quadrant sampling totals when they exist', () => {
    const report = generateReport(
      study([
        finding('Biceps Brachii', 'abnormal', {
          muap: {
            amplitude: 'large',
            duration: 'long',
            polyphasia: 'increased',
            polyphasiaSampling: {
              quadrants: {
                q1: { observedMuaps: 10, polyphasicMuaps: 2 },
                q2: { observedMuaps: 10, polyphasicMuaps: 2 },
                q3: { observedMuaps: 10, polyphasicMuaps: 2 },
                q4: { observedMuaps: 10, polyphasicMuaps: 2 },
              },
            },
          },
        }),
      ]),
    )
    expect(report).toContain('polyphasic MUAP 8/40 (20%), 4/4 passes sampled')
  })

  it('names the limitations of the localization support', () => {
    const report = generateReport(study(c6Pattern))
    expect(report).toContain('does not model partial lesions')
    expect(report).toContain('nerve conduction')
  })
})

describe('generateDraftImpression', () => {
  it('reports the compatible sites and what argued against the rest', () => {
    const impression = generateDraftImpression(study(c6Pattern))
    expect(impression).toContain('compatible with a lesion at')
    expect(impression).toContain('C6 root')
    expect(impression).toContain('Correlation with the clinical examination')
  })

  it('says so plainly when nothing is abnormal', () => {
    const impression = generateDraftImpression(study([finding('Biceps Brachii', 'normal')]))
    expect(impression).toBe('No abnormal needle findings were recorded.')
  })

  it('flags when no single site explains the pattern', () => {
    const impression = generateDraftImpression(
      study([
        finding('Biceps Brachii', 'abnormal'),
        finding('Abd. Pollicis Brevis', 'abnormal'),
        finding('Deltoid (Ant/Mid/Post)', 'normal'),
      ]),
    )
    expect(impression).toContain('No single lesion site accounts for every abnormal muscle')
  })

  it('excludes technically inadequate muscles and says it did', () => {
    const impression = generateDraftImpression(
      study([
        finding('Biceps Brachii', 'abnormal'),
        finding('Triceps Brachii', 'technically_inadequate'),
      ]),
    )
    expect(impression).toContain('Technical limitations affected Right Triceps Brachii')
    expect(impression).toContain('excluded from the analysis')
  })
})
