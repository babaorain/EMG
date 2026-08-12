import { describe, expect, it } from 'vitest'
import { findMuscleByName, muscleCatalog } from '../clinical/catalog'

function pathwayOf(name: string) {
  return findMuscleByName(name).pathway
}

describe('brachial plexus pathways', () => {
  it('routes a C5-C6 musculocutaneous muscle through upper trunk and lateral cord', () => {
    const biceps = pathwayOf('Biceps Brachii')
    expect(biceps.trunkSiteIds).toEqual(['trunk-upper'])
    expect(biceps.cordSiteIds).toEqual(['cord-lateral'])
    expect(biceps.upstreamSiteIds).toContain('root-C6')
    expect(biceps.upstreamSiteIds).toContain('nerve-musculocutaneous')
  })

  it('splits median muscles between lateral and medial cord by their roots', () => {
    expect(pathwayOf('Pronator Teres').cordSiteIds).toEqual(['cord-lateral'])
    expect(pathwayOf('Abd. Pollicis Brevis').cordSiteIds).toEqual(['cord-medial'])
  })

  it('carries the parent nerve for a distal branch', () => {
    const eip = pathwayOf('Extensor Indicis Proprius')
    expect(eip.nerveSiteIds).toEqual(['nerve-pin', 'nerve-radial'])
  })

  it('keeps pre-plexus branches clear of trunk and cord', () => {
    for (const name of ['Rhomboid Major/Minor', 'Serratus Anterior']) {
      const pathway = pathwayOf(name)
      expect(pathway.prePlexus).toBe(true)
      expect(pathway.trunkSiteIds).toEqual([])
      expect(pathway.cordSiteIds).toEqual([])
    }
  })

  it('keeps paraspinals clear of every post-root site', () => {
    const cervical = pathwayOf('Paraspinal (Cervical)')
    expect(cervical.posteriorRamus).toBe(true)
    expect(cervical.upstreamSiteIds).toEqual(['root-C5', 'root-C6', 'root-C7', 'root-C8'])
  })
})

describe('lumbosacral pathways', () => {
  it('carries the full sciatic chain for a deep peroneal muscle', () => {
    const ta = pathwayOf('Tibialis Anterior')
    expect(ta.nerveSiteIds).toEqual([
      'nerve-deep-peroneal',
      'nerve-common-peroneal',
      'nerve-sciatic-peroneal',
      'nerve-sciatic',
    ])
    expect(ta.plexusSiteIds).toEqual(['plexus-sacral'])
  })

  it('places biceps femoris short head above the common peroneal nerve', () => {
    const shortHead = pathwayOf('Biceps Femoris (Short Head)')
    expect(shortHead.nerveSiteIds).toContain('nerve-sciatic-peroneal')
    expect(shortHead.nerveSiteIds).not.toContain('nerve-common-peroneal')
  })
})

describe('catalog integrity', () => {
  it('resolves a nerve pathway for every muscle', () => {
    const unresolved = muscleCatalog.filter(
      (muscle) => muscle.pathway.nerveId === 'unknown',
    )
    expect(unresolved.map((muscle) => `${muscle.name} (${muscle.nerveLabel})`)).toEqual([])
  })

  it('uses one C PSP entry spanning C5 through C8', () => {
    const cervical = muscleCatalog.filter(
      (muscle) => muscle.nerveLabel === 'Post. Rami (Cervical)',
    )
    expect(cervical.map((muscle) => muscle.rootLabel)).toEqual(['C5-C8'])
    expect(cervical.every((muscle) => muscle.normalIsWeakExclusion)).toBe(true)
  })

  it('assigns unique ids', () => {
    const ids = new Set(muscleCatalog.map((muscle) => muscle.id))
    expect(ids.size).toBe(muscleCatalog.length)
  })
})
