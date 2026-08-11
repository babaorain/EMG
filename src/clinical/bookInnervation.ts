export interface BookInnervation {
  nerveLabel: string
  roots: string[]
  rootLabel?: string
  sourceLocator: string
}

type BookInnervationGroup = Omit<BookInnervation, 'sourceLocator'> & {
  names: string[]
  sourceLocator?: string
}

const chapter13 = '第 13 章個別肌肉描述；第 32 章表 32.3／32.4 交叉核對'

const groups: BookInnervationGroup[] = [
  { names: ['Abd. Pollicis Brevis', 'Opponens Pollicis'], nerveLabel: 'Median N.', roots: ['C8', 'T1'] },
  { names: ['Flexor Pollicis Brevis'], nerveLabel: 'Median / Ulnar N.', roots: ['C8', 'T1'] },
  {
    names: ['Pronator Quadratus', 'Flexor Pollicis Longus', 'Flexor Digitorum Profundus (1,2)'],
    nerveLabel: 'AIN (Median)',
    roots: ['C7', 'C8', 'T1'],
  },
  { names: ['Flexor Digitorum Superficialis'], nerveLabel: 'Median N.', roots: ['C7', 'C8'] },
  { names: ['Flexor Carpi Radialis', 'Pronator Teres'], nerveLabel: 'Median N.', roots: ['C6', 'C7'] },
  {
    names: ['First Dorsal Interosseous', 'Abd. Digiti Minimi', 'Flexor Carpi Ulnaris'],
    nerveLabel: 'Ulnar N.',
    roots: ['C8', 'T1'],
  },
  { names: ['Flexor Digitorum Profundus (3,4)'], nerveLabel: 'Ulnar N.', roots: ['C7', 'C8', 'T1'] },
  {
    names: ['Extensor Indicis Proprius', 'Extensor Carpi Ulnaris', 'Extensor Digitorum Communis'],
    nerveLabel: 'PIN (Radial)',
    roots: ['C7', 'C8'],
  },
  { names: ['Extensor Carpi Rad. Longus'], nerveLabel: 'Radial N.', roots: ['C6', 'C7'] },
  { names: ['Brachioradialis'], nerveLabel: 'Radial N.', roots: ['C5', 'C6'] },
  { names: ['Anconeus', 'Triceps Brachii'], nerveLabel: 'Radial N.', roots: ['C6', 'C7', 'C8'] },
  { names: ['Biceps Brachii'], nerveLabel: 'Musculocutaneous', roots: ['C5', 'C6'] },
  { names: ['Pectoralis Major (Clav)'], nerveLabel: 'Lat. Pectoral N.', roots: ['C5', 'C6', 'C7'] },
  { names: ['Pectoralis Major (Stern)'], nerveLabel: 'Med. Pectoral N.', roots: ['C8', 'T1'] },
  { names: ['Deltoid (Ant/Mid/Post)', 'Teres Minor'], nerveLabel: 'Axillary N.', roots: ['C5', 'C6'] },
  {
    names: ['Trapezius (Upper)'],
    nerveLabel: 'Accessory N.',
    roots: ['XI', 'C3', 'C4'],
    rootLabel: 'C3-C4',
  },
  {
    names: ['Sternocleidomastoid'],
    nerveLabel: 'Accessory N.',
    roots: ['XI'],
    rootLabel: '上頸髓（upper cervical cord）',
  },
  { names: ['Supraspinatus', 'Infraspinatus'], nerveLabel: 'Suprascapular N.', roots: ['C5', 'C6'] },
  { names: ['Rhomboid Major/Minor'], nerveLabel: 'Dorsal Scapular N.', roots: ['C4', 'C5'] },
  { names: ['Latissimus Dorsi'], nerveLabel: 'Thoracodorsal N.', roots: ['C6', 'C7', 'C8'] },
  { names: ['Serratus Anterior'], nerveLabel: 'Long Thoracic N.', roots: ['C5', 'C6', 'C7'] },

  {
    names: ['Extensor Digitorum Brevis', 'Extensor Hallucis Longus'],
    nerveLabel: 'Deep Peroneal N.',
    roots: ['L4', 'L5', 'S1'],
  },
  { names: ['Extensor Digitorum Longus', 'Tibialis Anterior'], nerveLabel: 'Deep Peroneal N.', roots: ['L4', 'L5'] },
  { names: ['Peroneus Longus'], nerveLabel: 'Sup. Peroneal N.', roots: ['L5', 'S1'] },
  { names: ['Abductor Hallucis', 'Flexor Hallucis Brevis'], nerveLabel: 'Med. Plantar N.', roots: ['S1', 'S2'] },
  { names: ['Abductor Digiti Quinti'], nerveLabel: 'Lat. Plantar N.', roots: ['S1', 'S2'] },
  { names: ['Gastrocnemius (Med/Lat)', 'Soleus'], nerveLabel: 'Tibial N.', roots: ['S1', 'S2'] },
  { names: ['Tibialis Posterior', 'Flexor Digitorum Longus'], nerveLabel: 'Tibial N.', roots: ['L5', 'S1'] },
  { names: ['Biceps Femoris (Short Head)'], nerveLabel: 'Sciatic (Peroneal)', roots: ['L5', 'S1'] },
  { names: ['Biceps Femoris (Long Head)'], nerveLabel: 'Sciatic (Tibial)', roots: ['L5', 'S1'] },
  { names: ['Semimembranosus', 'Semitendinosus'], nerveLabel: 'Sciatic (Tibial)', roots: ['L4', 'L5', 'S1'] },
  {
    names: ['Adductor Longus/Brevis', 'Adductor Magnus', 'Gracilis'],
    nerveLabel: 'Obturator N.',
    roots: ['L2', 'L3', 'L4'],
  },
  { names: ['Quadriceps (Vastus/Rectus)', 'Iliopsoas'], nerveLabel: 'Femoral N.', roots: ['L2', 'L3', 'L4'] },
  { names: ['Gluteus Medius', 'Tensor Fasciae Latae'], nerveLabel: 'Sup. Gluteal N.', roots: ['L4', 'L5', 'S1'] },
  { names: ['Gluteus Major'], nerveLabel: 'Inf. Gluteal N.', roots: ['L5', 'S1', 'S2'] },

  { names: ['Paraspinal (C5)'], nerveLabel: 'Post. Rami (Cervical)', roots: ['C5'] },
  { names: ['Paraspinal (C6)'], nerveLabel: 'Post. Rami (Cervical)', roots: ['C6'] },
  { names: ['Paraspinal (C7)'], nerveLabel: 'Post. Rami (Cervical)', roots: ['C7'] },
  { names: ['Paraspinal (C8)'], nerveLabel: 'Post. Rami (Cervical)', roots: ['C8'] },
  {
    names: ['Paraspinal (Thoracic)'],
    nerveLabel: 'Post. Rami (Thoracic)',
    roots: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    rootLabel: 'T1-T12',
  },
  { names: ['Paraspinal (L2)'], nerveLabel: 'Post. Rami (Lumbar)', roots: ['L2'] },
  { names: ['Paraspinal (L3)'], nerveLabel: 'Post. Rami (Lumbar)', roots: ['L3'] },
  { names: ['Paraspinal (L4)'], nerveLabel: 'Post. Rami (Lumbar)', roots: ['L4'] },
  { names: ['Paraspinal (L5)'], nerveLabel: 'Post. Rami (Lumbar)', roots: ['L5'] },
  { names: ['Paraspinal (S1)'], nerveLabel: 'Post. Rami (Sacral)', roots: ['S1'] },

  { names: ['Tongue (Genioglossus)'], nerveLabel: 'Hypoglossal N.', roots: ['XII'], rootLabel: 'CN XII' },
  { names: ['Masseter'], nerveLabel: 'Mandibular N. (V3)', roots: ['V'], rootLabel: 'CN V（V3）' },
  { names: ['Frontalis'], nerveLabel: 'Frontal branch (Facial N.)', roots: ['VII'], rootLabel: 'CN VII' },
  { names: ['Mentalis'], nerveLabel: 'Mandibular branch (Facial N.)', roots: ['VII'], rootLabel: 'CN VII' },
  { names: ['Orbicularis Oculi'], nerveLabel: 'Temporal branch (Facial N.)', roots: ['VII'], rootLabel: 'CN VII' },
]

function defaultRootLabel(roots: string[]): string {
  return roots.join('-')
}

export const bookInnervationByCatalogName = new Map<string, BookInnervation>()

for (const group of groups) {
  for (const name of group.names) {
    if (bookInnervationByCatalogName.has(name)) {
      throw new Error(`Duplicate book innervation entry: ${name}`)
    }
    bookInnervationByCatalogName.set(name, {
      nerveLabel: group.nerveLabel,
      roots: group.roots,
      rootLabel: group.rootLabel ?? defaultRootLabel(group.roots),
      sourceLocator: group.sourceLocator ?? chapter13,
    })
  }
}

export function bookInnervationForCatalogName(name: string): BookInnervation | undefined {
  return bookInnervationByCatalogName.get(name)
}
