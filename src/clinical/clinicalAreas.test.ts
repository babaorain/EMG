import { describe, expect, it } from 'vitest'
import { muscleCatalog } from './catalog'
import {
  clinicalAreaForMuscle,
  muscleAreaDefinitions,
  muscleAreas,
} from './clinicalAreas'

describe('clinical muscle areas', () => {
  it('assigns every catalog muscle to a supported clinical area', () => {
    const assigned = muscleCatalog.map(clinicalAreaForMuscle)
    expect(assigned).toHaveLength(muscleCatalog.length)
    expect(assigned.every((area) => muscleAreas.includes(area))).toBe(true)
  })

  it('keeps the common limb areas before cranial and neck muscles', () => {
    expect(muscleAreaDefinitions.map((area) => area.label)).toEqual([
      '肩膀與背部',
      '上臂',
      '前臂',
      '手',
      '腰臀與骨盆',
      '大腿',
      '小腿',
      '腳',
      '顱顏與頸部',
    ])
  })

  it('places representative muscles in their expected areas', () => {
    const areaOf = (name: string) => clinicalAreaForMuscle(
      muscleCatalog.find((muscle) => muscle.name === name)!,
    )

    expect(areaOf('Deltoid (Ant/Mid/Post)')).toBe('upper_arm')
    expect(areaOf('Biceps Brachii')).toBe('upper_arm')
    expect(areaOf('Pronator Teres')).toBe('forearm')
    expect(areaOf('First Dorsal Interosseous')).toBe('hand')
    expect(areaOf('Gluteus Medius')).toBe('hip_pelvis')
    expect(areaOf('Quadriceps (Vastus/Rectus)')).toBe('thigh')
    expect(areaOf('Tibialis Anterior')).toBe('lower_leg')
    expect(areaOf('Abductor Hallucis')).toBe('foot')
    expect(areaOf('Frontalis')).toBe('cranial_neck')
  })
})
