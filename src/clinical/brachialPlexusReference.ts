export type PlexusReferenceLevel = 'trunk' | 'cord'

export interface PlexusLocalizationCard {
  id: string
  level: PlexusReferenceLevel
  title: string
  roots: string
  composition: string
  muscles: Array<{ name: string; nerve: string }>
  sensory: string
  discriminator: string
  relativeSparing: string
}

export const plexusFlowRows = [
  {
    roots: 'C5–C6',
    trunk: 'Upper trunk',
    anterior: 'Lateral cord',
    posterior: 'Posterior cord',
  },
  {
    roots: 'C7',
    trunk: 'Middle trunk',
    anterior: 'Lateral cord',
    posterior: 'Posterior cord',
  },
  {
    roots: 'C8–T1',
    trunk: 'Lower trunk',
    anterior: 'Medial cord',
    posterior: 'Posterior cord',
  },
] as const

export const plexusLocalizationCards: PlexusLocalizationCard[] = [
  {
    id: 'upper-trunk',
    level: 'trunk',
    title: 'Upper trunk',
    roots: 'C5–C6',
    composition: 'C5 + C6；病變需跨越 Lateral 與 Posterior cord，並可波及 trunk 直接分出的 Suprascapular N.',
    muscles: [
      { name: 'Supraspinatus / Infraspinatus', nerve: 'Suprascapular N.' },
      { name: 'Deltoid', nerve: 'Axillary N.' },
      { name: 'Biceps Brachii', nerve: 'Musculocutaneous N.' },
      { name: 'Brachioradialis', nerve: 'Radial N.' },
    ],
    sensory: 'LAC、Radial SNAP、Median digit I 可異常；需與對側比較。',
    discriminator: 'Deltoid／Supraspinatus／Infraspinatus 異常，可將範圍由單純 Lateral cord 往 Upper trunk 推進。',
    relativeSparing: 'Cervical paraspinals 在純 plexopathy 應相對保留。',
  },
  {
    id: 'middle-trunk',
    level: 'trunk',
    title: 'Middle trunk',
    roots: 'C7',
    composition: 'C7 延續形成 Middle trunk，再分至 anterior 與 posterior divisions。',
    muscles: [
      { name: 'Triceps Brachii', nerve: 'Radial N.' },
      { name: 'Extensor Digitorum Communis', nerve: 'Radial / PIN' },
      { name: 'Pronator Teres', nerve: 'Median N.' },
      { name: 'Flexor Carpi Radialis', nerve: 'Median N.' },
    ],
    sensory: '以受影響的 postganglionic sensory response 與對側比較；單一 SNAP 不足以定義 Middle trunk。',
    discriminator: '同時取樣 Radial 與 Median N. 的 C7 肌肉；跨 terminal nerve 的一致異常比單一肌肉更有意義。',
    relativeSparing: '非 C7 優勢肌肉與 Cervical paraspinals 相對保留。',
  },
  {
    id: 'lower-trunk',
    level: 'trunk',
    title: 'Lower trunk',
    roots: 'C8–T1',
    composition: 'C8 + T1；同時送入 Medial cord 與 Posterior cord。',
    muscles: [
      { name: 'First Dorsal Interosseous', nerve: 'Ulnar N.' },
      { name: 'Abd. Pollicis Brevis', nerve: 'Median N.' },
      { name: 'Extensor Indicis Proprius', nerve: 'Radial / PIN' },
      { name: 'Ext. Pollicis Brevis', nerve: 'Radial / PIN' },
    ],
    sensory: 'MAC 與 Ulnar SNAP 常具定位價值；正常值也應注意 side-to-side asymmetry。',
    discriminator: 'EIP／EPB 等 Radial C8 肌肉異常支持 Lower trunk；它們在單純 Medial cord lesion 應保留。',
    relativeSparing: 'Cervical paraspinals 保留，且病灶不應只侷限於單一 Ulnar N. 分布。',
  },
  {
    id: 'lateral-cord',
    level: 'cord',
    title: 'Lateral cord',
    roots: 'C5–C7',
    composition: 'Upper + Middle trunk 的 anterior divisions；形成 Musculocutaneous N. 與 Median N. 的 lateral root。',
    muscles: [
      { name: 'Biceps Brachii / Brachialis', nerve: 'Musculocutaneous N.' },
      { name: 'Pronator Teres', nerve: 'Median N.' },
      { name: 'Flexor Carpi Radialis', nerve: 'Median N.' },
      { name: 'Pectoralis Major (Clav)', nerve: 'Lateral Pectoral N.' },
    ],
    sensory: 'LAC 與 Median SNAP 可異常；Radial SNAP 應相對保留。',
    discriminator: 'Musculocutaneous + C6–C7 Median 肌肉異常，但 Deltoid、Supraspinatus 與 Radial 肌肉相對保留。',
    relativeSparing: 'Posterior cord 與 Suprascapular N. 肌肉相對保留。',
  },
  {
    id: 'posterior-cord',
    level: 'cord',
    title: 'Posterior cord',
    roots: 'C5–T1',
    composition: '三條 trunk 的 posterior divisions 匯合；主要通往 Axillary 與 Radial N.',
    muscles: [
      { name: 'Deltoid', nerve: 'Axillary N.' },
      { name: 'Triceps Brachii', nerve: 'Radial N.' },
      { name: 'Brachioradialis', nerve: 'Radial N.' },
      { name: 'Extensor Indicis Proprius', nerve: 'Radial / PIN' },
    ],
    sensory: 'Radial SNAP 可異常；Median 與 LAC SNAP 相對保留。',
    discriminator: 'Axillary + 多層級 Radial 肌肉共同異常，且 Musculocutaneous／Median 肌肉相對保留。',
    relativeSparing: 'Biceps、Pronator Teres、FCR 與 Ulnar-innervated hand muscles 相對保留。',
  },
  {
    id: 'medial-cord',
    level: 'cord',
    title: 'Medial cord',
    roots: 'C8–T1',
    composition: 'Lower trunk 的 anterior division；形成 Ulnar N. 與 Median N. 的 medial root。',
    muscles: [
      { name: 'First Dorsal Interosseous / ADM', nerve: 'Ulnar N.' },
      { name: 'Flexor Carpi Ulnaris', nerve: 'Ulnar N.' },
      { name: 'Abd. Pollicis Brevis', nerve: 'Median N.' },
      { name: 'Flexor Pollicis Longus', nerve: 'Median / AIN' },
    ],
    sensory: 'MAC 與 Ulnar SNAP 可異常；MAC 無法單獨區分 Medial cord 與 Lower trunk。',
    discriminator: 'Ulnar + C8–T1 Median 肌肉異常，但 EIP／EPB／ECU 等 Radial C8 肌肉相對保留。',
    relativeSparing: 'Posterior cord 的 C8 extensors 相對保留。',
  },
]

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
