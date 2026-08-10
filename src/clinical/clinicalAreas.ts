import type { MuscleCatalogEntry } from './catalog'

export const muscleAreas = [
  'shoulder_back',
  'upper_arm',
  'forearm',
  'hand',
  'hip_pelvis',
  'thigh',
  'lower_leg',
  'foot',
  'cranial_neck',
] as const

export type MuscleArea = (typeof muscleAreas)[number]

export interface MuscleAreaDefinition {
  id: MuscleArea
  group: 'upper' | 'lower' | 'other'
  groupLabel: string
  label: string
}

export const muscleAreaDefinitions: MuscleAreaDefinition[] = [
  { id: 'shoulder_back', group: 'upper', groupLabel: '上肢', label: '肩膀與背部' },
  { id: 'upper_arm', group: 'upper', groupLabel: '上肢', label: '上臂' },
  { id: 'forearm', group: 'upper', groupLabel: '上肢', label: '前臂' },
  { id: 'hand', group: 'upper', groupLabel: '上肢', label: '手' },
  { id: 'hip_pelvis', group: 'lower', groupLabel: '下肢', label: '腰臀與骨盆' },
  { id: 'thigh', group: 'lower', groupLabel: '下肢', label: '大腿' },
  { id: 'lower_leg', group: 'lower', groupLabel: '下肢', label: '小腿' },
  { id: 'foot', group: 'lower', groupLabel: '下肢', label: '腳' },
  { id: 'cranial_neck', group: 'other', groupLabel: '其他', label: '顱顏與頸部' },
]

export const muscleAreaById = new Map(
  muscleAreaDefinitions.map((definition) => [definition.id, definition]),
)

const namesByArea: Record<MuscleArea, readonly string[]> = {
  shoulder_back: [
    'Trapezius (Upper)',
    'Rhomboid Major/Minor',
    'Levator Scapulae',
    'Serratus Anterior',
    'Subclavius',
    'Supraspinatus',
    'Infraspinatus',
    'Pectoralis Major (Clav)',
    'Pectoralis Major (Stern)',
    'Pectoralis Minor',
    'Subscapularis',
    'Teres Major',
    'Latissimus Dorsi',
    'Deltoid (Ant/Mid/Post)',
    'Teres Minor',
    'Paraspinal (C5)',
    'Paraspinal (C6)',
    'Paraspinal (C7)',
    'Paraspinal (C8)',
  ],
  upper_arm: [
    'Biceps Brachii',
    'Brachialis',
    'Coracobrachialis',
    'Triceps Brachii',
  ],
  forearm: [
    'Anconeus',
    'Brachioradialis',
    'Extensor Carpi Rad. Longus',
    'Extensor Carpi Rad. Brevis',
    'Supinator',
    'Extensor Digitorum Communis',
    'Extensor Carpi Ulnaris',
    'Extensor Indicis Proprius',
    'Abd. Pollicis Longus',
    'Ext. Pollicis Longus',
    'Ext. Pollicis Brevis',
    'Pronator Teres',
    'Flexor Carpi Radialis',
    'Palmaris Longus',
    'Flexor Digitorum Superficialis',
    'Flexor Pollicis Longus',
    'Flexor Digitorum Profundus (1,2)',
    'Pronator Quadratus',
    'Flexor Carpi Ulnaris',
    'Flexor Digitorum Profundus (3,4)',
  ],
  hand: [
    'Abd. Pollicis Brevis',
    'Opponens Pollicis',
    'Flexor Pollicis Brevis',
    'Lumbricals (1,2)',
    'Abd. Digiti Minimi',
    'First Dorsal Interosseous',
    'Palmar Interossei',
    'Adductor Pollicis',
  ],
  hip_pelvis: [
    'Paraspinal (L2)',
    'Paraspinal (L3)',
    'Paraspinal (L4)',
    'Paraspinal (L5)',
    'Paraspinal (S1)',
    'Iliopsoas',
    'Gluteus Medius',
    'Gluteus Minimus',
    'Tensor Fasciae Latae',
    'Gluteus Major',
    'Piriformis',
    'Obturator Int / Gemelli',
    'Quadratus Femoris',
    'Ext. Anal Sphincter',
    'Bulbocavernosus',
  ],
  thigh: [
    'Quadriceps (Vastus/Rectus)',
    'Sartorius',
    'Pectineus',
    'Adductor Longus/Brevis',
    'Adductor Magnus',
    'Gracilis',
    'Obturator Externus',
    'Semitendinosus',
    'Semimembranosus',
    'Biceps Femoris (Long Head)',
    'Biceps Femoris (Short Head)',
  ],
  lower_leg: [
    'Tibialis Anterior',
    'Extensor Hallucis Longus',
    'Extensor Digitorum Longus',
    'Peroneus Longus',
    'Peroneus Brevis',
    'Gastrocnemius (Med/Lat)',
    'Soleus',
    'Popliteus',
    'Tibialis Posterior',
    'Flexor Digitorum Longus',
    'Flexor Hallucis Longus',
  ],
  foot: [
    'Extensor Digitorum Brevis',
    'Extensor Hallucis Brevis',
    'Abductor Hallucis',
    'Flexor Digitorum Brevis',
    'Abductor Digiti Quinti',
    'Interossei (Foot)',
  ],
  cranial_neck: [
    'Frontalis',
    'Orbicularis Oculi',
    'Orbicularis Oris',
    'Nasalis',
    'Mentalis',
    'Masseter',
    'Temporalis',
    'Tongue (Genioglossus)',
    'Sternocleidomastoid',
  ],
}

const areaByMuscleName = new Map<MuscleAreaDefinition['id'] | string, MuscleArea>()

for (const [area, names] of Object.entries(namesByArea) as Array<[MuscleArea, readonly string[]]>) {
  for (const name of names) areaByMuscleName.set(name, area)
}

const areaRanks = new Map(muscleAreas.map((area, index) => [area, index]))

export function clinicalAreaForMuscle(muscle: MuscleCatalogEntry): MuscleArea {
  const explicitArea = areaByMuscleName.get(muscle.name)
  if (explicitArea) return explicitArea
  if (muscle.region === 'cranial') return 'cranial_neck'
  if (muscle.region === 'lower') return 'hip_pelvis'
  return 'shoulder_back'
}

export function clinicalAreaRank(muscle: MuscleCatalogEntry): number {
  return areaRanks.get(clinicalAreaForMuscle(muscle)) ?? muscleAreas.length
}

export function clinicalAreaLabel(muscle: MuscleCatalogEntry): string {
  return muscleAreaById.get(clinicalAreaForMuscle(muscle))?.label ?? ''
}
