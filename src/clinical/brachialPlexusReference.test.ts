import { describe, expect, it } from 'vitest'
import { plexusFlowRows, plexusLocalizationCards } from './brachialPlexusReference'

describe('brachial plexus reference', () => {
  it('maps the three root groups through trunks to anterior and posterior cords', () => {
    expect(plexusFlowRows).toEqual([
      { roots: 'C5–C6', trunk: 'Upper trunk', anterior: 'Lateral cord', posterior: 'Posterior cord' },
      { roots: 'C7', trunk: 'Middle trunk', anterior: 'Lateral cord', posterior: 'Posterior cord' },
      { roots: 'C8–T1', trunk: 'Lower trunk', anterior: 'Medial cord', posterior: 'Posterior cord' },
    ])
  })

  it('provides complete trunk and cord localization cards', () => {
    expect(plexusLocalizationCards.filter((card) => card.level === 'trunk')).toHaveLength(3)
    expect(plexusLocalizationCards.filter((card) => card.level === 'cord')).toHaveLength(3)
    expect(new Set(plexusLocalizationCards.map((card) => card.id)).size).toBe(6)
    expect(plexusLocalizationCards.every((card) => card.muscles.length >= 4)).toBe(true)
  })
})
