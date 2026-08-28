import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import legacyMuscles from './legacy-muscles.json'

const legacyMuscleSchema = z.object({
  m: z.string().min(1),
  n: z.string().min(1),
  r: z.string().min(1),
  r_list: z.array(z.string().min(1)).min(1),
  a: z.array(z.string()),
})

describe('legacy muscle catalog data', () => {
  it('matches the static schema before it is bundled for the browser', () => {
    expect(() => z.array(legacyMuscleSchema).parse(legacyMuscles)).not.toThrow()
  })
})
