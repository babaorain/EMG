import { describe, expect, it } from 'vitest'
import { plexusFlowRows, plexusNcsChecklist, plexusPatternRows, plexusSources } from './brachialPlexusReference'

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

  it('names sensory recording sites precisely and does not imply C7 has no usable SNAP', () => {
    expect(plexusPatternRows[0]?.trunk.sensory).toEqual(['LABC', 'Median–D1', 'Superficial radial'])
    expect(plexusPatternRows[1]?.trunk.sensory).toEqual([])
    expect(plexusPatternRows[1]?.trunk.sensoryNote).toMatch(/不代表 C7 沒有可用 sensory response/)
    expect(plexusPatternRows[2]?.trunk.sensory).toEqual(['MABC', 'Ulnar–D5'])
  })

  it('keeps local checklist claims visibly qualified and externally sourced claims traceable', () => {
    expect(plexusNcsChecklist[0]?.evidence).toMatch(/local technique/)
    expect(plexusNcsChecklist.at(-1)?.evidence).toMatch(/不是 axonal-loss 百分比的直接量測/)
    expect(plexusSources[0]).not.toHaveProperty('href')
    for (const source of plexusSources) {
      expect(source.citation).not.toBe('')
      expect(source.locator).not.toBe('')
      if ('href' in source) expect(source.href).toMatch(/^https:\/\//)
    }
  })
})
