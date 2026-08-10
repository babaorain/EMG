import type { MuapMorphology, NeedleFinding, Side, SpontaneousActivity } from './types'

const emptySpontaneousActivity: SpontaneousActivity = {
  fibrillation: 'not_assessed',
  psw: 'not_assessed',
  fasciculation: 'not_assessed',
  crd: 'not_assessed',
  myotonicDischarges: 'not_assessed',
  myokymicDischarges: 'not_assessed',
  neuromyotonicDischarges: 'not_assessed',
}

const emptyMuapMorphology: MuapMorphology = {
  amplitude: 'not_assessed',
  duration: 'not_assessed',
  polyphasia: 'not_assessed',
  polyphasiaSampling: {
    quadrants: { q1: {}, q2: {}, q3: {}, q4: {} },
  },
}

export function createEmptyFinding(
  muscleId: string,
  side: Side,
  now = new Date().toISOString(),
): NeedleFinding {
  return {
    id: `${side.toLowerCase()}-${muscleId}`,
    muscleId,
    side,
    coverage: 'not_tested',
    insertionalActivity: 'not_assessed',
    spontaneous: { ...emptySpontaneousActivity },
    muap: {
      ...emptyMuapMorphology,
      polyphasiaSampling: {
        quadrants: { q1: {}, q2: {}, q3: {}, q4: {} },
      },
    },
    recruitment: 'not_assessed',
    activation: 'not_assessed',
    notes: '',
    updatedAt: now,
  }
}
