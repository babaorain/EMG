import { describe, expect, it } from 'vitest'
import { muscleCatalog } from '../clinical/catalog'
import { protocols } from './protocols'

const catalogNames = new Set(muscleCatalog.map((muscle) => muscle.name))

describe('protocol library', () => {
  it('names only muscles that exist in the catalog', () => {
    const missing = protocols.flatMap((protocol) =>
      protocol.muscles
        .filter((muscle) => !catalogNames.has(muscle.name))
        .map((muscle) => `${protocol.id}: ${muscle.name}`),
    )
    expect(missing).toEqual([])
  })

  it('lists each muscle at most once per protocol', () => {
    const duplicates = protocols.flatMap((protocol) => {
      const seen = new Set<string>()
      return protocol.muscles
        .filter((muscle) => {
          if (seen.has(muscle.name)) return true
          seen.add(muscle.name)
          return false
        })
        .map((muscle) => `${protocol.id}: ${muscle.name}`)
    })
    expect(duplicates).toEqual([])
  })

  it('gives every muscle a stated reason for inclusion', () => {
    const unexplained = protocols.flatMap((protocol) =>
      protocol.muscles
        .filter((muscle) => muscle.rationale.trim().length === 0)
        .map((muscle) => `${protocol.id}: ${muscle.name}`),
    )
    expect(unexplained).toEqual([])
  })

  it('can refute as well as confirm outside the pan-plexus and screen sets', () => {
    const confirmOnly = protocols
      .filter(
        (protocol) =>
          protocol.category !== 'screen' && protocol.id !== 'bpi-pan-plexus',
      )
      .filter((protocol) =>
        protocol.muscles.every((muscle) => muscle.role === 'confirm'),
      )
      .map((protocol) => protocol.id)
    expect(confirmOnly).toEqual([])
  })

  it('covers the full brachial plexus injury family', () => {
    const bpi = protocols
      .filter((protocol) => protocol.id.startsWith('bpi-'))
      .map((protocol) => protocol.id)
    expect(bpi).toEqual([
      'bpi-preganglionic',
      'bpi-upper-trunk',
      'bpi-middle-trunk',
      'bpi-lower-trunk',
      'bpi-lateral-cord',
      'bpi-posterior-cord',
      'bpi-medial-cord',
      'bpi-pan-plexus',
    ])
  })

  it('puts a pre-plexus or paraspinal muscle in every plexopathy set', () => {
    const withoutLevelTest = protocols
      .filter((protocol) => protocol.category === 'plexopathy')
      .filter(
        (protocol) =>
          !protocol.muscles.some((muscle) => muscle.role === 'preganglionic'),
      )
      .map((protocol) => protocol.id)
    expect(withoutLevelTest).toEqual([])
  })

  it('uses unique protocol ids', () => {
    const ids = new Set(protocols.map((protocol) => protocol.id))
    expect(ids.size).toBe(protocols.length)
  })
})
