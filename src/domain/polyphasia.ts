import {
  samplingQuadrants,
  type PolyphasiaSampling,
  type SamplingQuadrant,
} from './types'

export interface PolyphasiaSummary {
  totalObserved: number
  totalPolyphasic: number
  percent?: number
  quadrantsSampled: number
  completeness: 'none' | 'partial' | 'complete'
  invalidQuadrants: SamplingQuadrant[]
  incompleteQuadrants: SamplingQuadrant[]
}

export function summarizePolyphasia(
  sampling: PolyphasiaSampling,
): PolyphasiaSummary {
  let totalObserved = 0
  let totalPolyphasic = 0
  let quadrantsSampled = 0
  const invalidQuadrants: SamplingQuadrant[] = []
  const incompleteQuadrants: SamplingQuadrant[] = []

  for (const quadrant of samplingQuadrants) {
    const sample = sampling.quadrants[quadrant]
    const observed = sample.observedMuaps ?? 0
    const polyphasic = sample.polyphasicMuaps ?? 0

    if (observed > 0) quadrantsSampled += 1
    if (
      (sample.observedMuaps === undefined) !==
      (sample.polyphasicMuaps === undefined)
    ) {
      incompleteQuadrants.push(quadrant)
    }
    if (polyphasic > observed) invalidQuadrants.push(quadrant)
    totalObserved += observed
    totalPolyphasic += polyphasic
  }

  return {
    totalObserved,
    totalPolyphasic,
    percent:
      totalObserved > 0 &&
      invalidQuadrants.length === 0 &&
      incompleteQuadrants.length === 0
        ? Math.round((totalPolyphasic / totalObserved) * 1000) / 10
        : undefined,
    quadrantsSampled,
    completeness:
      quadrantsSampled === 0
        ? 'none'
        : quadrantsSampled === samplingQuadrants.length
          ? 'complete'
          : 'partial',
    invalidQuadrants,
    incompleteQuadrants,
  }
}
