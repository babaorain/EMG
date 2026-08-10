import { describe, expect, it } from 'vitest'
import { findMuscleByName, muscleById } from '../clinical/catalog'
import { protocolById } from './protocols'
import { initialStudy } from './study'
import { studyReducer } from './studyReducer'

describe('studyReducer', () => {
  it('adds a muscle for the active side', () => {
    const muscleId = findMuscleByName('Biceps Brachii').id
    const next = studyReducer(initialStudy, { type: 'add_muscle', muscleId, side: 'R' })
    expect(next.findings).toHaveLength(1)
    expect(next.findings[0].side).toBe('R')
    expect(next.findings[0].coverage).toBe('not_tested')
  })

  it('keeps the same muscle on the two sides apart', () => {
    const muscleId = findMuscleByName('Biceps Brachii').id
    const right = studyReducer(initialStudy, { type: 'add_muscle', muscleId, side: 'R' })
    const both = studyReducer(right, { type: 'add_muscle', muscleId, side: 'L' })
    expect(both.findings).toHaveLength(2)
  })

  it('ignores a muscle already present on that side', () => {
    const muscleId = findMuscleByName('Biceps Brachii').id
    const once = studyReducer(initialStudy, { type: 'add_muscle', muscleId, side: 'R' })
    const twice = studyReducer(once, { type: 'add_muscle', muscleId, side: 'R' })
    expect(twice.findings).toHaveLength(1)
  })

  it('loads every muscle of a protocol and records which one was chosen', () => {
    const protocol = protocolById.get('radic-c6')!
    const next = studyReducer(initialStudy, {
      type: 'load_protocol',
      protocolId: 'radic-c6',
      side: 'R',
    })
    expect(next.protocolId).toBe('radic-c6')
    expect(next.findings).toHaveLength(protocol.muscles.length)
    const loaded = next.findings.map((finding) => muscleById.get(finding.muscleId)?.name)
    expect(loaded).toEqual(protocol.muscles.map((muscle) => muscle.name))
  })

  it('does not duplicate muscles shared by two protocols', () => {
    const first = studyReducer(initialStudy, {
      type: 'load_protocol',
      protocolId: 'radic-c6',
      side: 'R',
    })
    const second = studyReducer(first, {
      type: 'load_protocol',
      protocolId: 'radic-c7',
      side: 'R',
    })
    const ids = second.findings.map((finding) => finding.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('leaves the study untouched for an unknown protocol', () => {
    const next = studyReducer(initialStudy, {
      type: 'load_protocol',
      protocolId: 'does-not-exist',
      side: 'R',
    })
    expect(next).toBe(initialStudy)
  })

  it('clears findings, the chosen protocol, and the impression together', () => {
    const loaded = studyReducer(initialStudy, {
      type: 'load_protocol',
      protocolId: 'radic-c6',
      side: 'R',
    })
    const withImpression = studyReducer(loaded, { type: 'set_impression', value: 'draft' })
    const cleared = studyReducer(withImpression, { type: 'clear_findings' })
    expect(cleared.findings).toEqual([])
    expect(cleared.protocolId).toBeUndefined()
    expect(cleared.impressionDraft).toBe('')
  })

  it('removes a single finding', () => {
    const muscleId = findMuscleByName('Biceps Brachii').id
    const added = studyReducer(initialStudy, { type: 'add_muscle', muscleId, side: 'R' })
    const removed = studyReducer(added, {
      type: 'remove_finding',
      findingId: added.findings[0].id,
    })
    expect(removed.findings).toEqual([])
  })

  it('updates a finding and refreshes its timestamp', () => {
    const muscleId = findMuscleByName('Biceps Brachii').id
    const added = studyReducer(initialStudy, { type: 'add_muscle', muscleId, side: 'R' })
    const updated = studyReducer(added, {
      type: 'update_finding',
      finding: { ...added.findings[0], coverage: 'abnormal', updatedAt: '2000-01-01T00:00:00.000Z' },
    })
    expect(updated.findings[0].coverage).toBe('abnormal')
    expect(updated.findings[0].updatedAt).not.toBe('2000-01-01T00:00:00.000Z')
  })
})
