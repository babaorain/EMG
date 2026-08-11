import { describe, expect, it } from 'vitest'
import { findMuscleByName } from '../clinical/catalog'
import {
  compareMuscles,
  matchesRootFilter,
  pathwayStages,
  THORACIC_PARASPINAL_FILTER,
  worksheetColumns,
  worksheetCsv,
} from './muscleSelection'

describe('muscle selection helpers', () => {
  it('sorts cervical muscles before lumbar and sacral muscles', () => {
    const muscles = [
      findMuscleByName('Gastrocnemius (Med/Lat)'),
      findMuscleByName('Tibialis Anterior'),
      findMuscleByName('Deltoid (Ant/Mid/Post)'),
    ].sort(compareMuscles)

    expect(muscles.map((muscle) => muscle.name)).toEqual([
      'Deltoid (Ant/Mid/Post)',
      'Tibialis Anterior',
      'Gastrocnemius (Med/Lat)',
    ])
  })

  it('derives the brachial plexus display stages without inventing needle data', () => {
    const stages = pathwayStages(findMuscleByName('Deltoid (Ant/Mid/Post)'))
    expect(stages.map((stage) => stage.label)).toEqual([
      'Root',
      'Trunk / upstream',
      'Division',
      'Cord / plexus',
      'Downstream nerve',
      'Muscle',
    ])
    expect(stages.find((stage) => stage.label === 'Division')?.value).toBe('Posterior division(s)')
    expect(stages.find((stage) => stage.label === 'Cord / plexus')?.value).toBe('Posterior cord')
  })

  it('uses one thoracic root filter for the thoracic paraspinal only', () => {
    expect(matchesRootFilter(
      findMuscleByName('Paraspinal (Thoracic)'),
      THORACIC_PARASPINAL_FILTER,
    )).toBe(true)
    expect(matchesRootFilter(
      findMuscleByName('Abd. Pollicis Brevis'),
      THORACIC_PARASPINAL_FILTER,
    )).toBe(false)
  })

  it('exports every requested blank worksheet column in CSV order', () => {
    const muscle = findMuscleByName('Deltoid (Ant/Mid/Post)')
    const csv = worksheetCsv([{ muscle, side: 'R' }])
    const [header, row] = csv.split('\r\n')

    expect(header).toContain('"IA","Fib","PSW","Fasc","CRD","Myotonic"')
    expect(header).toContain('"Amplitude","Duration","Polyphasia","Recruitment","Activation","Notes"')
    expect(header?.split(',')).toHaveLength(worksheetColumns.length)
    expect(row?.split(',')).toHaveLength(worksheetColumns.length)
  })
})
