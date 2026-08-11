import { describe, expect, it } from 'vitest'
import { dermatomePoints } from './dermatomes'

describe('ISNCSCI dermatome landmarks', () => {
  it('contains one unique key sensory point for each of the 28 levels', () => {
    expect(dermatomePoints).toHaveLength(28)
    expect(new Set(dermatomePoints.map((point) => point.root)).size).toBe(28)
    expect(dermatomePoints[0]?.root).toBe('C2')
    expect(dermatomePoints.at(-1)?.root).toBe('S4-5')
  })

  it('keeps the high-yield clinical anchors explicit', () => {
    const anchors = new Map(
      dermatomePoints.filter((point) => point.quickReference).map((point) => [point.root, point.landmark]),
    )
    expect([...anchors.keys()]).toEqual(['C6', 'C7', 'C8', 'T4', 'T6', 'T10', 'L4', 'L5', 'S1', 'S4-5'])
    expect(anchors.get('T10')).toContain('肚臍')
    expect(anchors.get('L4')).toBe('內踝')
  })
})
