import { describe, expect, it } from 'vitest'
import { findMuscleByName } from '../clinical/catalog'
import { createEmptyFinding } from './finding'
import { runInference } from './inference'
import type { CoverageState, NeedleFinding } from './types'

function observe(entries: [string, CoverageState][]): NeedleFinding[] {
  return entries.map(([name, coverage]) => ({
    ...createEmptyFinding(findMuscleByName(name).id, 'R', '2026-07-25T00:00:00.000Z'),
    coverage,
  }))
}

function labels(sites: { site: { label: string } }[]): string[] {
  return sites.map((entry) => entry.site.label)
}

describe('C6 radiculopathy pattern', () => {
  const result = runInference(
    observe([
      ['Biceps Brachii', 'abnormal'],
      ['Deltoid (Ant/Mid/Post)', 'abnormal'],
      ['Triceps Brachii', 'normal'],
      ['Abd. Pollicis Brevis', 'normal'],
    ]),
    'R',
  )

  it('keeps C6 root and upper trunk compatible', () => {
    expect(labels(result.compatible)).toContain('C6 root')
    expect(labels(result.compatible)).toContain('Upper trunk')
  })

  it('never raises a root that no abnormal muscle passes through', () => {
    const everySite = [...result.compatible, ...result.partial, ...result.contradicted]
    expect(labels(everySite)).not.toContain('C7 root')
  })

  it('lets a normal triceps soften C6 without excluding it', () => {
    const c6 = result.compatible.find((entry) => entry.site.label === 'C6 root')
    expect(c6?.softenedBy.map((ref) => ref.name)).toEqual(['Triceps Brachii'])
    expect(c6?.contradictedBy).toEqual([])
  })

  it('rejects a single nerve as an explanation for both muscles', () => {
    const musculocutaneous = [...result.compatible, ...result.partial].find(
      (entry) => entry.site.label === 'Musculocutaneous',
    )
    expect(musculocutaneous?.status).toBe('partial')
    expect(musculocutaneous?.unexplained.map((ref) => ref.name)).toEqual([
      'Deltoid (Ant/Mid/Post)',
    ])
  })

  it('offers a cervical paraspinal to separate root from plexus', () => {
    const names = result.suggestions.map((entry) => entry.muscle.name)
    expect(names).toContain('Paraspinal (Cervical)')
  })
})

describe('next-needle ranking', () => {
  it('prefers an unmarked muscle already in the plan over an addition', () => {
    const result = runInference(
      observe([
        ['Biceps Brachii', 'abnormal'],
        ['Deltoid (Ant/Mid/Post)', 'abnormal'],
        ['Triceps Brachii', 'normal'],
        ['Paraspinal (Cervical)', 'not_tested'],
      ]),
      'R',
    )
    expect(result.suggestions[0].muscle.name).toBe('Paraspinal (Cervical)')
    expect(result.suggestions[0].inPlan).toBe(true)
  })

  it('never re-suggests a muscle that already has a result', () => {
    const result = runInference(
      observe([
        ['Biceps Brachii', 'abnormal'],
        ['Deltoid (Ant/Mid/Post)', 'abnormal'],
        ['Paraspinal (Cervical)', 'normal'],
      ]),
      'R',
    )
    expect(result.suggestions.map((entry) => entry.muscle.name)).not.toContain(
      'Paraspinal (Cervical)',
    )
  })
})

describe('structural weakening of exclusion', () => {
  it('does not let a two-trunk muscle exclude a trunk', () => {
    // Pronator teres draws C6 and C7, so it crosses the upper and middle trunks.
    const result = runInference(
      observe([
        ['Biceps Brachii', 'abnormal'],
        ['Deltoid (Ant/Mid/Post)', 'abnormal'],
        ['Pronator Teres', 'normal'],
      ]),
      'R',
    )
    const upperTrunk = result.compatible.find((entry) => entry.site.label === 'Upper trunk')
    expect(upperTrunk).toBeDefined()
    expect(upperTrunk?.softenedBy.map((ref) => ref.name)).toEqual(['Pronator Teres'])
    expect(upperTrunk?.caveats.length).toBeGreaterThan(0)
  })

  it('does not let a normal paraspinal exclude the root', () => {
    const result = runInference(
      observe([
        ['Biceps Brachii', 'abnormal'],
        ['Deltoid (Ant/Mid/Post)', 'abnormal'],
        ['Paraspinal (Cervical)', 'normal'],
      ]),
      'R',
    )
    const c6 = result.compatible.find((entry) => entry.site.label === 'C6 root')
    expect(c6).toBeDefined()
    expect(c6?.softenedBy.map((ref) => ref.name)).toEqual(['Paraspinal (Cervical)'])
  })
})

describe('ulnar neuropathy pattern', () => {
  const result = runInference(
    observe([
      ['First Dorsal Interosseous', 'abnormal'],
      ['Abd. Digiti Minimi', 'abnormal'],
      ['Abd. Pollicis Brevis', 'normal'],
      ['Flexor Digitorum Profundus (3,4)', 'abnormal'],
    ]),
    'R',
  )

  it('keeps the ulnar nerve compatible and drops C8 and T1', () => {
    expect(labels(result.compatible)).toContain('Ulnar N.')
    expect(labels(result.contradicted)).toEqual(
      expect.arrayContaining(['C8 root', 'T1 root', 'Lower trunk', 'Medial cord']),
    )
  })
})

describe('peroneal division versus common peroneal nerve', () => {
  const result = runInference(
    observe([
      ['Tibialis Anterior', 'abnormal'],
      ['Peroneus Longus', 'abnormal'],
      ['Tibialis Posterior', 'normal'],
    ]),
    'R',
  )

  it('keeps both the common peroneal nerve and the peroneal division open', () => {
    expect(labels(result.compatible)).toEqual(
      expect.arrayContaining(['Common Peroneal N.', 'Sciatic (Peroneal)']),
    )
  })

  it('suggests biceps femoris short head to separate them', () => {
    const shortHead = result.suggestions.find(
      (entry) => entry.muscle.name === 'Biceps Femoris (Short Head)',
    )
    expect(shortHead).toBeDefined()
    expect(shortHead?.survivorsIfAbnormal.map((site) => site.label)).toEqual([
      'Sciatic (Peroneal)',
    ])
  })
})

describe('empty and normal studies', () => {
  it('returns nothing when no muscle is abnormal', () => {
    const result = runInference(
      observe([
        ['Biceps Brachii', 'normal'],
        ['Triceps Brachii', 'normal'],
      ]),
      'R',
    )
    expect(result.compatible).toEqual([])
    expect(result.suggestions).toEqual([])
  })

  it('ignores findings recorded on the other side', () => {
    const findings = observe([['Biceps Brachii', 'abnormal']])
    expect(runInference(findings, 'L').compatible).toEqual([])
    expect(runInference(findings, 'R').compatible.length).toBeGreaterThan(0)
  })
})
