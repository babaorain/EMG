export interface PlexusPatternMuscle {
  name: string
  nerve: string
  key?: boolean
}

export interface PlexusPatternBlock {
  title: string
  muscles: PlexusPatternMuscle[]
  sensory: string[]
  sensoryNote?: string
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
      sensory: ['LABC', 'Median–D1', 'Superficial radial'],
    },
    cord: {
      title: 'Lateral cord',
      muscles: [
        { name: 'Biceps Brachii', nerve: 'Musculocutaneous N.' },
        { name: 'Flexor Carpi Radialis', nerve: 'Median N.' },
      ],
      sensory: ['LABC', 'Median–D1'],
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
      sensoryNote: '手寫卡未指定核心 sensory study；依臨床分布設計，不代表 C7 沒有可用 sensory response。',
    },
    cord: {
      title: 'Posterior cord',
      muscles: [
        { name: 'Deltoid', nerve: 'Axillary N.' },
        { name: 'Brachioradialis', nerve: 'Radial N.' },
        { name: 'Triceps Brachii', nerve: 'Radial N.' },
        { name: 'Extensor Indicis Proprius', nerve: 'PIN / Radial N.' },
      ],
      sensory: ['Superficial radial'],
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
      sensory: ['MABC', 'Ulnar–D5'],
    },
    cord: {
      title: 'Medial cord',
      muscles: [
        { name: 'Abd. Pollicis Brevis', nerve: 'Median N.' },
        { name: 'First Dorsal Interosseous', nerve: 'Ulnar N.' },
      ],
      sensory: ['MABC', 'Ulnar–D5'],
    },
  },
]

export const plexusNcsChecklist = [
  {
    text: "Radial motor：Erb's point → Triceps / Brachioradialis（L/R）",
    evidence: '手寫卡 local technique；尚缺 montage、normal values 與肌肉專屬驗證，不作通用 protocol。',
  },
  {
    text: 'LABC + Median–D1 sensory（L/R）：Upper trunk 重要對照；Radial 可作補充',
    evidence: 'Ferrante & Wilbourn 1995：upper trunk 26 例中 Med-D1 與 LABC 各 25 例異常；Med-D2 只有 5 例。',
  },
  {
    text: 'Ulnar–D5 + DUC + MABC sensory（L/R）：Lower trunk / Medial cord 對照',
    evidence: 'Ferrante & Wilbourn 1995：lower trunk 以 Uln-D5、DUC、MABC 的組合判讀；不能只寫 generic “Ulnar”。',
  },
  {
    text: '完整上肢 NCS：Median / Ulnar motor + sensory；使用健側作技術與個體對照',
    evidence: 'Rubin 2020 review：plexopathy 檢查須依病灶與臨床分布作 extensive、individualized evaluation。',
  },
  {
    text: 'Traumatic BPI 且疑 C5 preganglionic／avulsion 或 diaphragm dysfunction：考慮 Phrenic N. conduction；CXR 只能作輔助',
    evidence: 'Chen et al. 2001 僅研究 traumatic BPI；Crowe et al. 2023 顯示 CXR sensitivity 56%，不能用於 routine exclusion。',
  },
  {
    text: 'CMAP amplitude L/R ratio：在溫度、電極、刺激、病程與健側正常皆可比時，才可近似描述 severity',
    evidence: '手寫卡項目；不是 axonal-loss 百分比的直接量測，reinnervation 與技術差異可改變 ratio。',
  },
] as const

export const plexusSources = [
  {
    label: '使用者提供的手寫 BPI sampling card',
    citation: 'Clinician-provided handwritten BPI sampling card; transcribed 2026-08-28.',
    locator: 'C5-C6 / C7 / C8-T1 trunk-and-cord sampling matrix and NCS checklist',
    note: '本頁矩陣的直接來源；屬 local bedside card，尚未成為 externally validated protocol。',
  },
  {
    label: 'AANEM education coursebook — not a guideline',
    citation: 'American Association of Neuromuscular & Electrodiagnostic Medicine. Neuroanatomy for Nerve Conduction Studies. Course material; 2010.',
    href: 'https://www.aanem.org/docs/default-source/documents/abem/technologists/2-coursebook-neuroanatomy-for-ncs-cnct-study-material2.pdf?sfvrsn=51d9536d_0',
    locator: 'Brachial plexus anatomy and NCS sections; educational material whose author opinions are not an AANEM guideline',
    note: '補充 root、trunk、cord 與 terminal nerve anatomy；不把它標成 practice guideline。',
  },
  {
    label: 'Ferrante & Wilbourn — sensory NCS',
    citation: 'Ferrante MA, Wilbourn AJ. The utility of various sensory nerve conduction responses in assessing brachial plexopathies. Muscle Nerve. 1995;18(8):879-889. doi:10.1002/mus.880180813.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/7630350/',
    locator: 'Abstract: upper-, middle-, and lower-trunk response frequencies; recording sites Med-D1/D2/D3, Uln-D5, DUC, radial, MABC, LABC',
    note: '支持 sensory recording site 必須具體命名；樣本為單一 truncal axon-loss plexopathy。',
  },
  {
    label: 'Rubin — plexopathy review',
    citation: 'Rubin DI. Brachial and lumbosacral plexopathies: A review. Clin Neurophysiol Pract. 2020;5:173-193. doi:10.1016/j.cnp.2020.07.005.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7484503/',
    locator: '§3.1 anatomy; §3.3 electrodiagnostic evaluation; Table 1',
    note: '支持 extensive、individualized evaluation，並提醒 lesion timing 與 root-plus-plexus coexistence。',
  },
  {
    label: 'Chen et al. — phrenic NCS in traumatic BPI',
    citation: 'Chen ZY, Xu JG, Shen LY, Gu YD. Phrenic nerve conduction study in patients with traumatic brachial plexus palsy. Muscle Nerve. 2001;24(10):1388-1390. doi:10.1002/mus.1160.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/11562921/',
    locator: 'Abstract; 100 traumatic BPI cases and C5 preganglionic-root correlation',
    note: '只支持 traumatic BPI／suspected C5 preganglionic context，不可泛化至所有 C5 root symptoms。',
  },
  {
    label: 'Crowe et al. — CXR limitation',
    citation: 'Crowe CS, Pulos N, Spinner RJ, et al. The diagnostic utility of inspiratory-expiratory radiography for the assessment of phrenic nerve palsy associated with brachial plexus injury. Acta Neurochir (Wien). 2023;165(9):2589-2596. doi:10.1007/s00701-023-05622-6.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/37198276/',
    locator: 'Abstract: Results and Conclusion; sensitivity 56%, specificity 93%',
    note: 'CXR false negatives 多，不宜作 traumatic BPI phrenic dysfunction 的 routine standalone screen。',
  },
] as const
