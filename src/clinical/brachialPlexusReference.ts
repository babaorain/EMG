export interface PlexusPatternMuscle {
  name: string
  nerve: string
  key?: boolean
}

export interface PlexusPatternBlock {
  title: string
  muscles: PlexusPatternMuscle[]
  sensory: string[]
}

export interface PlexusPatternRow {
  roots: string
  trunk: PlexusPatternBlock
  cord: PlexusPatternBlock
}

export const plexusFlowRows = [
  { roots: 'C5–C6', trunk: 'Upper trunk', anterior: 'Lateral cord', posterior: 'Posterior cord' },
  { roots: 'C7', trunk: 'Middle trunk', anterior: 'Lateral cord', posterior: 'Posterior cord' },
  { roots: 'C8–T1', trunk: 'Lower trunk', anterior: 'Medial cord', posterior: 'Posterior cord' },
] as const

/**
 * Bedside sampling matrix transcribed from the clinician's handwritten card.
 * The flow diagram above remains the anatomic reference; this matrix is the
 * compact muscle / sensory set used during an actual BPI examination.
 */
export const plexusPatternRows: PlexusPatternRow[] = [
  {
    roots: 'C5–C6',
    trunk: {
      title: 'Upper trunk',
      muscles: [
        { name: 'Supraspinatus', nerve: 'Suprascapular N.', key: true },
        { name: 'Biceps Brachii', nerve: 'Musculocutaneous / Lateral cord', key: true },
        { name: 'Deltoid', nerve: 'Axillary / Posterior cord', key: true },
        { name: 'Brachioradialis', nerve: 'Radial / Posterior cord' },
      ],
      sensory: ['LABC', 'Median', 'Radial'],
    },
    cord: {
      title: 'Lateral cord',
      muscles: [
        { name: 'Biceps Brachii', nerve: 'Musculocutaneous N.' },
        { name: 'Flexor Carpi Radialis', nerve: 'Median N.' },
      ],
      sensory: ['LABC', 'Median'],
    },
  },
  {
    roots: 'C7',
    trunk: {
      title: 'Middle trunk',
      muscles: [
        { name: 'Triceps Brachii', nerve: 'Radial / Posterior cord', key: true },
        { name: 'Flexor Carpi Radialis', nerve: 'Median / Lateral cord' },
      ],
      sensory: [],
    },
    cord: {
      title: 'Posterior cord',
      muscles: [
        { name: 'Deltoid', nerve: 'Axillary N.' },
        { name: 'Brachioradialis', nerve: 'Radial N.' },
        { name: 'Triceps Brachii', nerve: 'Radial N.' },
        { name: 'Extensor Indicis Proprius', nerve: 'PIN / Radial N.' },
      ],
      sensory: ['Radial'],
    },
  },
  {
    roots: 'C8–T1',
    trunk: {
      title: 'Lower trunk',
      muscles: [
        { name: 'Abd. Pollicis Brevis', nerve: 'Median N.' },
        { name: 'First Dorsal Interosseous', nerve: 'Ulnar N.' },
        { name: 'Extensor Indicis Proprius', nerve: 'PIN / Radial N.' },
      ],
      sensory: ['MABC', 'Ulnar'],
    },
    cord: {
      title: 'Medial cord',
      muscles: [
        { name: 'Abd. Pollicis Brevis', nerve: 'Median N.' },
        { name: 'First Dorsal Interosseous', nerve: 'Ulnar N.' },
      ],
      sensory: ['MABC', 'Ulnar'],
    },
  },
]

export const plexusNcsChecklist = [
  "Radial motor：Erb's point → Triceps / Brachioradialis（L/R）",
  'LABC sensory（L/R）；Upper trunk 重要對照',
  'MABC sensory（L/R）；Lower trunk / Medial cord 重要對照',
  '完整上肢 NCS：Median / Ulnar motor + sensory；健側作 control',
  '疑似 C5 root lesion：考慮 Phrenic N. conduction ± CXR',
  'CMAP amplitude L/R ratio：協助量化 axonal loss',
] as const

export const plexusSources = [
  {
    label: 'AANEM Course — Neuroanatomy for Nerve Conduction Studies',
    href: 'https://www.aanem.org/docs/default-source/documents/abem/technologists/2-coursebook-neuroanatomy-for-ncs-cnct-study-material2.pdf?sfvrsn=51d9536d_0',
    note: 'root vs plexus、LAC／MAC、Upper／Lower trunk 與 cord 的 EDX 鑑別',
  },
  {
    label: 'NCBI Bookshelf — Anatomy, Head and Neck: Brachial Plexus',
    href: 'https://www.ncbi.nlm.nih.gov/books/NBK531473/',
    note: 'C5–T1、trunk、division、cord 與 terminal nerve 解剖路徑',
  },
  {
    label: 'Brachial and lumbosacral plexopathies: A review',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7484503/',
    note: 'plexopathy 的臨床與 electrodiagnostic evaluation 綜述',
  },
] as const
