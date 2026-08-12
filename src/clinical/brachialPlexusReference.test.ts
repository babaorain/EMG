import { describe, expect, it } from 'vitest'
import { plexusFlowRows, plexusPatternRows } from './brachialPlexusReference'

describe('brachial plexus reference', () => {
  it('maps the three root groups through trunks to anterior and posterior cords', () => {
    expect(plexusFlowRows).toEqual([
      { roots: 'C5–C6', trunk: 'Upper trunk', anterior: 'Lateral cord', posterior: 'Posterior cord' },
      { roots: 'C7', trunk: 'Middle trunk', anterior: 'Lateral cord', posterior: 'Posterior cord' },
      { roots: 'C8–T1', trunk: 'Lower trunk', anterior: 'Medial cord', posterior: 'Posterior cord' },
    ])
  })

  it('matches the three handwritten trunk and cord sampling rows', () => {
    expect(plexusPatternRows.map((row) => [row.roots, row.trunk.title, row.cord.title])).toEqual([
      ['C5–C6', 'Upper trunk', 'Lateral cord'],
      ['C7', 'Middle trunk', 'Posterior cord'],
      ['C8–T1', 'Lower trunk', 'Medial cord'],
    ])
    expect(plexusPatternRows[0]?.trunk.muscles.filter((muscle) => muscle.key).map((muscle) => muscle.name)).toEqual([
      'Supraspinatus',
      'Biceps Brachii',
      'Deltoid',
    ])
  })
})
