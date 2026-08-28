export type NeedleEvidenceKind =
  | 'textbook'
  | 'peer-reviewed'
  | 'professional-guidance'
  | 'institutional-atlas'
  | 'teaching-atlas'

export type NeedleEvidenceTier = 'primary' | 'reviewed-reference' | 'teaching-supplement'

export interface NeedleEvidenceSource {
  id: string
  shortLabel: string
  citation: string
  url: string
  kind: NeedleEvidenceKind
  tier: NeedleEvidenceTier
  note: string
  lastReviewed: string
}

export interface NeedleCitationRef {
  sourceId: string
  locator: string
  href?: string
  relation?: 'direct-technique' | 'anatomy-only' | 'safety-only' | 'teaching-support'
}

export type NeedleResourceKind = 'localization' | 'technique' | 'ultrasound' | 'safety'

export interface NeedleGuideResource {
  kind: NeedleResourceKind
  title: string
  summary: string
  citation: NeedleCitationRef
  rights: 'link-only'
}

export interface NeedleGuideEvidence {
  defaultCitations: NeedleCitationRef[]
  fieldCitations?: Partial<Record<'innervation' | 'insertion' | 'activation', NeedleCitationRef[]>>
  clinicalPointCitations?: NeedleCitationRef[][]
  anatomyPointCitations?: NeedleCitationRef[][]
  resources: NeedleGuideResource[]
  evidenceStatus: 'book-mapped' | 'source-mapped' | 'limited-evidence'
  sourceCheckedOn: string
  clinicalReviewStatus: 'pending-emg-physician'
}

const reviewedOn = '2026-08-28'

export const needleEvidenceSources: Record<string, NeedleEvidenceSource> = {
  'preston-shapiro-2020': {
    id: 'preston-shapiro-2020',
    shortLabel: 'P&S 4e',
    citation: 'Preston DC, Shapiro BE. Electromyography and Neuromuscular Disorders: Clinical-Electrophysiologic-Ultrasound Correlations. 4th ed. Elsevier; 2020.',
    url: 'https://shop.elsevier.com/books/electromyography-and-neuromuscular-disorders/preston/978-0-323-66180-5',
    kind: 'textbook',
    tier: 'reviewed-reference',
    note: '本站原始第 13 章圖版與文字的來源。',
    lastReviewed: reviewedOn,
  },
  'lee-delisa-2005': {
    id: 'lee-delisa-2005',
    shortLabel: 'Lee & DeLisa',
    citation: 'Lee HJ, DeLisa JA. Manual of Nerve Conduction Study and Surface Anatomy for Needle Electromyography. 4th ed. Lippincott Williams & Wilkins; 2005. ISBN 9780781758215.',
    url: 'https://shop.lww.com/Manual-of-Nerve-Conduction-Study-and-Surface-Anatomy-for-Needle-Electromyography/p/9780781758215',
    kind: 'textbook',
    tier: 'reviewed-reference',
    note: '肌肉表面定位、activation、needle insertion 與臨床注意事項的第二本教科書來源。',
    lastReviewed: reviewedOn,
  },
  'barkhaus-nandedkar-2002': {
    id: 'barkhaus-nandedkar-2002',
    shortLabel: 'SIU Atlas',
    citation: 'Barkhaus PE, Nandedkar SD. Electronic Myoanatomic Atlas for Clinical Electromyography. PDF metadata 2002; hosted by Southern Illinois University School of Medicine.',
    url: 'https://www.siumed.edu/sites/default/files/2021-11/Muscle%20anatomy%20for%20EMG.pdf',
    kind: 'institutional-atlas',
    tier: 'reviewed-reference',
    note: '大學官方託管的 EMG 肌肉定位教材；PDF 頁碼與書內印刷頁碼並列。',
    lastReviewed: reviewedOn,
  },
  'menkes-pierce-2019': {
    id: 'menkes-pierce-2019',
    shortLabel: 'Menkes & Pierce 2019',
    citation: 'Menkes DL, Pierce R. Needle EMG muscle identification: A systematic approach to needle EMG examination. Clinical Neurophysiology Practice. 2019;4:199-211. doi:10.1016/j.cnp.2019.08.003.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6921208/',
    kind: 'peer-reviewed',
    tier: 'primary',
    note: '開放取用的 needle EMG 系統性技術文章；包含多條肌肉的精確 landmark、activation 與 pitfalls。',
    lastReviewed: reviewedOn,
  },
  'saddler-et-al-2026': {
    id: 'saddler-et-al-2026',
    shortLabel: 'Saddler et al. 2026',
    citation: 'Saddler N, Ro H, Bristol S, Khayambashi S, Berger MJ. Ultrasound Guidance to Augment Needle Electromyography Precision in the Complex Nerve Injury Setting. Muscle & Nerve. 2026;73(2):133-148. doi:10.1002/mus.70100.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12803594/',
    kind: 'peer-reviewed',
    tier: 'primary',
    note: '開放取用的肌肉專屬 ultrasound localization review；圖中標出神經血管與鄰肌。',
    lastReviewed: reviewedOn,
  },
  'aanem-risks-2025': {
    id: 'aanem-risks-2025',
    shortLabel: 'AANEM Risks 2025',
    citation: 'American Association of Neuromuscular & Electrodiagnostic Medicine. Risks in Electrodiagnostic Medicine. Modified and approved by the AANEM Board of Directors, November 2025.',
    url: 'https://www.aanem.org/docs/default-source/documents/aanem/practice/risksinedx.pdf?sfvrsn=a112b935_0',
    kind: 'professional-guidance',
    tier: 'primary',
    note: '只用於一般風險與減害原則，不能替代肌肉專屬定位來源。',
    lastReviewed: reviewedOn,
  },
  'online-emg-atlas-2019': {
    id: 'online-emg-atlas-2019',
    shortLabel: 'Online EMG Atlas',
    citation: 'Online Atlas of Electromyography. Non-commercial educational website; ©2019. Accessed 2026-08-28.',
    url: 'https://emg-atlas.neurol.ru/',
    kind: 'teaching-atlas',
    tier: 'teaching-supplement',
    note: '次級教學圖譜，非 guideline、未標示同儕審查；僅以外部連結提供，不複製其圖片。',
    lastReviewed: reviewedOn,
  },
  'ics-clinical-neurophysiology': {
    id: 'ics-clinical-neurophysiology',
    shortLabel: 'ICS Committee 8B',
    citation: 'Fowler CJ, Benson JT, Craggs MD, Vodušek DB, Yang CC, Podnar S. Clinical Neurophysiology. Committee 8B, 2nd International Consultation on Incontinence.',
    url: 'https://www.ics.org/publications/ici_2/chapters/Chap08B.pdf',
    kind: 'professional-guidance',
    tier: 'reviewed-reference',
    note: '骨盆底與括約肌為專科技術；頁碼均指 PDF 頁碼。',
    lastReviewed: reviewedOn,
  },
  'statpearls-shoulder-2023': {
    id: 'statpearls-shoulder-2023',
    shortLabel: 'StatPearls Shoulder',
    citation: 'Miniato MA, Anand P, Varacallo MA. Anatomy, Shoulder and Upper Limb, Shoulder. [Updated 2023 Jul 24]. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. NCBI Bookshelf NBK536933.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK536933/',
    kind: 'institutional-atlas',
    tier: 'reviewed-reference',
    note: '用於肩帶肌的解剖、動作與神經支配，不用來支持 needle insertion 路徑。',
    lastReviewed: reviewedOn,
  },
  'yun-et-al-2015': {
    id: 'yun-et-al-2015',
    shortLabel: 'Yun et al. 2015',
    citation: 'Yun JS, Chung MJ, Kim HR, So JI, Park JE, Oh HM. Accuracy of Needle Placement in Cadavers: Non-Guided versus Ultrasound-Guided. Ann Rehabil Med. 2015;39(2):163-169. doi:10.5535/arm.2015.39.2.163.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4414961/',
    kind: 'peer-reviewed',
    tier: 'primary',
    note: '屍體研究；比較四條下肢肌的 surface landmark 與 ultrasound-guided placement，不能外推為所有肌肉的絕對準確率。',
    lastReviewed: reviewedOn,
  },
  'kassardjian-et-al-2016': {
    id: 'kassardjian-et-al-2016',
    shortLabel: 'Kassardjian et al. 2016',
    citation: "Kassardjian CD, O'Gorman CM, Sorenson EJ. The risk of iatrogenic pneumothorax after electromyography. Muscle Nerve. 2016;53(4):518-521. doi:10.1002/mus.24883.",
    url: 'https://pubmed.ncbi.nlm.nih.gov/26333600/',
    kind: 'peer-reviewed',
    tier: 'primary',
    note: '64,490 次 EMG 的回溯資料；7 例相關氣胸皆於 24 小時內出現症狀。',
    lastReviewed: reviewedOn,
  },
  'cushman-et-al-2018': {
    id: 'cushman-et-al-2018',
    shortLabel: 'Cushman et al. 2018',
    citation: 'Cushman D, Henrie M, Scholl LV, Ludlow M, Teramoto M. Ultrasound Verification of Safe Needle Examination of the Rhomboid Major Muscle. Muscle Nerve. 2018;57(1):61-64. doi:10.1002/mus.25642.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28271533/',
    kind: 'peer-reviewed',
    tier: 'primary',
    note: '健康受試者 ultrasound 驗證；肋骨中心觸診正確率 66.3%，作者建議短暫 ultrasound depth check。',
    lastReviewed: reviewedOn,
  },
  'lim-et-al-2023': {
    id: 'lim-et-al-2023',
    shortLabel: 'Lim et al. 2023',
    citation: 'Lim HY, Kim SH, Choi JW, et al. Optimal needle electromyography approach to the serratus anterior muscle. Muscle Nerve. 2023;68(3):303-307. doi:10.1002/mus.27933.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/37439385/',
    kind: 'peer-reviewed',
    tier: 'primary',
    note: '屍體定位研究；新 approach 尚需活體影像研究驗證，不作為已確立的臨床標準。',
    lastReviewed: reviewedOn,
  },
  'aapmr-radiculopathy-2023': {
    id: 'aapmr-radiculopathy-2023',
    shortLabel: 'AAPM&R 2023',
    citation: 'Lefkowitz TR. Electrodiagnosis of Radiculopathies (Cervical, Thoracic, and Lumbar). PM&R KnowledgeNow. Last updated 2023 Jun 22.',
    url: 'https://now.aapmr.org/electrodiagnosis-of-radiculopathies-cervical-thoracic-and-lumbar/',
    kind: 'professional-guidance',
    tier: 'reviewed-reference',
    note: '用於 paraspinal timing、sensitivity 與 false-positive caveats；不是肌肉進針圖譜。',
    lastReviewed: reviewedOn,
  },
  'statpearls-obturator-2023': {
    id: 'statpearls-obturator-2023',
    shortLabel: 'StatPearls Obturator',
    citation: 'Larson MR, Ryan W. Anatomy, Abdomen and Pelvis, Obturator Muscles. [Updated 2023 Jan 17]. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. NCBI Bookshelf NBK589636.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK589636/',
    kind: 'institutional-atlas',
    tier: 'reviewed-reference',
    note: '只支持 obturator muscle anatomy、function、innervation、vascular adjacency 與變異；不是 diagnostic needle EMG route。',
    lastReviewed: reviewedOn,
  },
  'statpearls-piriformis-2023': {
    id: 'statpearls-piriformis-2023',
    shortLabel: 'StatPearls Piriformis',
    citation: 'Chang C, Jeno SH, Varacallo MA. Anatomy, Bony Pelvis and Lower Limb: Piriformis Muscle. [Updated 2023 Nov 13]. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. NCBI Bookshelf NBK519497.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK519497/',
    kind: 'institutional-atlas',
    tier: 'reviewed-reference',
    note: '只支持 piriformis anatomy、function、innervation 與 sciatic-nerve variation；不是 diagnostic needle EMG route。',
    lastReviewed: reviewedOn,
  },
  'statpearls-gemelli-2026': {
    id: 'statpearls-gemelli-2026',
    shortLabel: 'StatPearls Gemelli',
    citation: 'Lezak B, Massel DH. Anatomy, Bony Pelvis and Lower Limb, Gemelli Muscles. [Updated 2026 May 13]. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. NCBI Bookshelf NBK557420.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK557420/',
    kind: 'institutional-atlas',
    tier: 'reviewed-reference',
    note: '只支持 gemelli／obturator internus／quadratus femoris 的 anatomy、function 與 distinct innervation；不是 diagnostic needle EMG route。',
    lastReviewed: reviewedOn,
  },
  'statpearls-femoral-triangle-2023': {
    id: 'statpearls-femoral-triangle-2023',
    shortLabel: 'StatPearls Femoral Triangle',
    citation: 'Basinger H, Hogg JP. Anatomy, Abdomen and Pelvis: Femoral Triangle. [Updated 2023 Mar 11]. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2026 Jan-. NCBI Bookshelf NBK541140.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK541140/',
    kind: 'institutional-atlas',
    tier: 'reviewed-reference',
    note: '用於 sartorius anterior-division innervation 與 femoral triangle anatomy；不是 needle insertion source。',
    lastReviewed: reviewedOn,
  },
  'facial-edx-guideline-2020': {
    id: 'facial-edx-guideline-2020',
    shortLabel: 'Facial EDX CPG 2020',
    citation: 'Guntinas-Lichius O, Volk GF, Olsen KD, et al. Facial nerve electrodiagnostics for patients with facial palsy: a clinical practice guideline. Eur Arch Otorhinolaryngol. 2020;277(7):1855-1874. doi:10.1007/s00405-020-05949-1.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7286870/',
    kind: 'professional-guidance',
    tier: 'primary',
    note: '臉神經疾病的 EDX guideline；支持 facial nEMG 的 indication、method 與 interpretation，不支持其他 bulbar diagnosis 的單肌推論。',
    lastReviewed: reviewedOn,
  },
}

const cite = (
  sourceId: string,
  locator: string,
  href?: string,
  relation: NeedleCitationRef['relation'] = 'direct-technique',
): NeedleCitationRef => ({
  sourceId,
  locator,
  ...(href ? { href } : {}),
  relation,
})

const googleBookPage = (page: number, query: string) =>
  `https://books.google.com/books?id=7JFnxYu7zsMC&pg=PA${page}&vq=${encodeURIComponent(query)}`

const lee = (locator: string, page: number, query: string) =>
  cite('lee-delisa-2005', locator, googleBookPage(page, query))

const atlas = (locator: string, href: string) => cite('online-emg-atlas-2019', locator, href, 'teaching-support')

const resource = (
  kind: NeedleResourceKind,
  title: string,
  summary: string,
  citation: NeedleCitationRef,
): NeedleGuideResource => ({ kind, title, summary, citation, rights: 'link-only' })

const verified = (
  defaultCitations: NeedleCitationRef[],
  resources: NeedleGuideResource[],
  overrides: Partial<Omit<NeedleGuideEvidence, 'defaultCitations' | 'resources' | 'evidenceStatus' | 'sourceCheckedOn' | 'clinicalReviewStatus'>> = {},
): NeedleGuideEvidence => ({
  defaultCitations,
  resources,
  evidenceStatus: 'source-mapped',
  sourceCheckedOn: reviewedOn,
  clinicalReviewStatus: 'pending-emg-physician',
  ...overrides,
})

const limited = (
  defaultCitations: NeedleCitationRef[],
  resources: NeedleGuideResource[],
  overrides: Partial<Omit<NeedleGuideEvidence, 'defaultCitations' | 'resources' | 'evidenceStatus' | 'sourceCheckedOn' | 'clinicalReviewStatus'>> = {},
): NeedleGuideEvidence => ({
  defaultCitations,
  resources,
  evidenceStatus: 'limited-evidence',
  sourceCheckedOn: reviewedOn,
  clinicalReviewStatus: 'pending-emg-physician',
  ...overrides,
})

const siu = cite('barkhaus-nandedkar-2002', 'PDF pp. 107-108 (printed pp. 99-100), Orbicularis Oris', undefined, 'teaching-support')
const siuSupinator = cite('barkhaus-nandedkar-2002', 'PDF pp. 45-46 (printed pp. 37-38), Supinator', undefined, 'teaching-support')
const siuEdb = cite('barkhaus-nandedkar-2002', 'PDF pp. 65-66 (printed pp. 57-58), Extensor Digitorum Brevis; medial slip is EHB', undefined, 'teaching-support')
const siuFootFdi = cite('barkhaus-nandedkar-2002', 'PDF pp. 67-68 (printed pp. 59-60), First Dorsal Interosseous (Foot)', undefined, 'teaching-support')
const menkesBrachialis = cite('menkes-pierce-2019', 'Appendix A, Brachialis; Fig. 3')
const saddlerBrachialis = cite('saddler-et-al-2026', '§3.3 Brachialis; Fig. 3')
const saddlerForearm = cite('saddler-et-al-2026', '§3.4 and Fig. 4, Supinator/ECRL/ECRB')
const saddlerFhl = cite('saddler-et-al-2026', '§3.8 Flexor Hallucis Longus; Fig. 8')
const aanemChest = cite('aanem-risks-2025', 'Risk of pneumothorax, PDF p. 9', undefined, 'safety-only')
const shoulderAnatomy = (locator: string) => cite('statpearls-shoulder-2023', locator, undefined, 'anatomy-only')
const sacralAtlas = atlas(
  'Sacral Plexus; short deep hip muscles and limitations of direct EMG observation',
  'https://emg-atlas.neurol.ru/sacral_plexus/',
)
const obturatorAnatomy = cite('statpearls-obturator-2023', 'Structure and Function; Blood Supply; Nerves; Muscles', undefined, 'anatomy-only')
const piriformisAnatomy = cite('statpearls-piriformis-2023', 'Structure and Function; Nerves; Physiologic Variants', undefined, 'anatomy-only')
const gemelliAnatomy = cite('statpearls-gemelli-2026', 'Structure and Function; Nerves; Physiologic Variants', undefined, 'anatomy-only')
const sartoriusAnatomy = cite('statpearls-femoral-triangle-2023', 'Nerves: anterior division supplies sartorius; Muscles: sartorius', undefined, 'anatomy-only')
const popliteusAtlas = atlas(
  'Tibial Nerve > Popliteus > EMG Needle Insertion / Pitfalls / Clinical Comments',
  'https://emg-atlas.neurol.ru/tibial_nerve/',
)
const pectoralisMinorAtlas = atlas(
  'Medial/Lateral Pectoral Nerves > Pectoralis Minor > EMG Needle Insertion / Pitfalls',
  'https://emg-atlas.neurol.ru/medial_and_lateral_pectoral_nerves/',
)

export const supplementalGuideEvidence: Record<string, NeedleGuideEvidence> = {
  'supplement-orbicularis-oris': verified([siu], [
    resource('localization', 'SIU 公開定位教材', '含定位文字與肌肉圖示；以大學官方 PDF 外部連結提供。', siu),
    resource('technique', 'Facial nEMG clinical practice guideline', '說明 facial nerve diseases 的 nEMG indication、standardized examination 與 interpretation。', cite('facial-edx-guideline-2020', 'Needle electromyography; Table 2, Step 3')),
  ], {
    clinicalPointCitations: [
      [cite('facial-edx-guideline-2020', 'Purpose; Electrophysiological diagnostic evaluation; Conclusion')],
      [cite('facial-edx-guideline-2020', 'Facial nerve physiology, pathophysiology, and definitions')],
    ],
  }),
  'supplement-nasalis': verified([lee('Ch. 21, Nasalis, p. 249; Fig. 21-4', 249, 'Nasalis')], [
    resource('localization', 'Lee & DeLisa：Nasalis', '精確列出病人姿勢、表淺進針方向與 activation。', lee('Ch. 21, p. 249; Fig. 21-4', 249, 'Nasalis')),
  ]),
  'supplement-temporalis': verified([lee('Ch. 21, Temporalis, pp. 250-251; Fig. 21-7', 251, 'Temporalis')], [
    resource('localization', 'Lee & DeLisa：Temporalis', '以圖版與文字說明薄而表淺的顳肌定位及咬緊牙關 activation。', lee('Ch. 21, pp. 250-251; Fig. 21-7', 251, 'Temporalis')),
  ]),
  'supplement-levator-scapulae': verified([
    atlas('Dorsal Scapular Nerve > Levator Scapulae > EMG Needle Insertion / Pitfalls', 'https://emg-atlas.neurol.ru/dorsal_scapular_nerve/'),
  ], [
    resource('localization', '外部教學圖譜：Levator Scapulae', '提供肌肉解剖圖、superomedial scapular margin 定位與鄰肌 pitfalls；屬次級教材。', atlas('Levator Scapulae section', 'https://emg-atlas.neurol.ru/dorsal_scapular_nerve/')),
  ]),
  'supplement-subclavius': limited([
    shoulderAnatomy('Muscles > Subclavius: function and innervation'),
  ], [
    resource('safety', 'AANEM：supraclavicular region 風險', 'AANEM 將鎖骨上區列入胸膜／肺鄰近區域；本站不提供未經肌肉專屬來源驗證的盲刺路徑。', aanemChest),
  ], {
    fieldCitations: {
      innervation: [shoulderAnatomy('Muscles > Subclavius: innervation (C5-C6)')],
      insertion: [aanemChest],
      activation: [shoulderAnatomy('Muscles > Subclavius: depression and stabilization of the clavicle')],
    },
    clinicalPointCitations: [[shoulderAnatomy('Muscles > Subclavius'), aanemChest], [aanemChest]],
    anatomyPointCitations: [[aanemChest], [shoulderAnatomy('Muscles > Subclavius'), aanemChest]],
  }),
  'supplement-pectoralis-minor': verified([
    pectoralisMinorAtlas,
    shoulderAnatomy('Muscles > Pectoralis minor: function and innervation'),
  ], [
    resource('localization', '外部教學圖譜：Pectoralis Minor', '含定位、activation 與胸大肌誤入風險；次級教材，圖片不在本站重製。', pectoralisMinorAtlas),
    resource('safety', 'AANEM 胸壁安全提醒', '胸壁鄰近胸膜與肺，必要時以 ultrasound 增加定位準確度。', aanemChest),
  ], {
    fieldCitations: {
      innervation: [shoulderAnatomy('Muscles > Pectoralis minor: medial pectoral nerve; C8-T1')],
      insertion: [pectoralisMinorAtlas, aanemChest],
      activation: [pectoralisMinorAtlas, shoulderAnatomy('Muscles > Pectoralis minor: scapular stabilization and protraction')],
    },
    clinicalPointCitations: [[pectoralisMinorAtlas], [pectoralisMinorAtlas]],
    anatomyPointCitations: [[aanemChest], [aanemChest]],
  }),
  'supplement-subscapularis': limited([
    shoulderAnatomy('Muscles > Subscapularis: function and innervation'),
  ], [
    resource('ultrasound', '肩胛下肌周邊橫切面', '此文圖 1 可辨識 subscapularis、腋動靜脈與 brachial plexus；不等同已驗證的盲刺路徑。', cite('saddler-et-al-2026', 'Fig. 1')),
  ], {
    fieldCitations: {
      innervation: [shoulderAnatomy('Muscles > Subscapularis: innervation (C5-C7)')],
      insertion: [cite('saddler-et-al-2026', 'Fig. 1, cross-sectional anatomy', undefined, 'anatomy-only')],
      activation: [shoulderAnatomy('Muscles > Subscapularis: adduction and medial rotation')],
    },
    clinicalPointCitations: [
      [cite('saddler-et-al-2026', 'Fig. 1, cross-sectional anatomy', undefined, 'anatomy-only')],
      [cite('saddler-et-al-2026', '§2, ultrasound as an adjunct to target identification', undefined, 'safety-only')],
    ],
    anatomyPointCitations: [
      [cite('saddler-et-al-2026', 'Fig. 1, axillary neurovascular structures', undefined, 'anatomy-only')],
      [cite('saddler-et-al-2026', '§2, ultrasound as an adjunct to target identification', undefined, 'safety-only')],
    ],
  }),
  'supplement-teres-major': verified([lee('Ch. 14, Teres Major, pp. 191-192; Fig. 14-3', 191, 'Teres Major')], [
    resource('localization', 'Lee & DeLisa：Teres Major', '以肩胛骨下角、肱骨與後腋襞建立定位。', lee('Ch. 14, pp. 191-192; Fig. 14-3', 191, 'Teres Major')),
  ]),
  'supplement-brachialis': verified([menkesBrachialis, saddlerBrachialis], [
    resource('technique', 'Brachialis 外側進針技巧', 'Menkes & Pierce 說明 distal arm landmark；lateral approach 可降低內側神經血管風險。', menkesBrachialis),
    resource('ultrasound', 'Brachialis ultrasound 橫切面', '圖 3 同時標出 biceps、brachial artery、median nerve、basilic vein 與 radial nerve。', saddlerBrachialis),
  ]),
  'supplement-coracobrachialis': verified([lee('Ch. 13, Coracobrachialis, p. 184; Fig. 13-3', 184, 'Coracobrachialis')], [
    resource('localization', 'Lee & DeLisa：Coracobrachialis', '含 proximal-medial arm 定位、activation 與鄰近結構提醒。', lee('Ch. 13, p. 184; Fig. 13-3', 184, 'Coracobrachialis')),
  ]),
  'supplement-ecrb': verified([lee('Ch. 12, ECRL/ECRB, pp. 174-176', 176, 'Extensor Carpi Radialis Brevis'), saddlerForearm], [
    resource('ultrasound', 'ECRB／ECRL／Supinator 同一橫切面', '圖 4 顯示三肌及 PIN、radial artery 等鄰近構造。', saddlerForearm),
  ]),
  'supplement-supinator': verified([siuSupinator, saddlerForearm], [
    resource('localization', 'SIU Supinator 定位教材', '含定位文字與圖示，並提醒需間歇 activation 確認深層肌。', siuSupinator),
    resource('ultrasound', 'Supinator ultrasound 與 PIN', '圖 4 顯示 PIN 於兩頭間的位置與可避開的小血管。', saddlerForearm),
  ]),
  'supplement-apl': verified([
    atlas('Radial Nerve > Abductor Pollicis Longus > EMG Needle Insertion / Pitfalls', 'https://emg-atlas.neurol.ru/radial_nerve/'),
  ], [resource('localization', '外部教學圖譜：APL', '含 needle insertion、activation 與鄰肌 pitfalls；屬次級教材。', atlas('Abductor Pollicis Longus section', 'https://emg-atlas.neurol.ru/radial_nerve/'))]),
  'supplement-epl': verified([lee('Ch. 12, Extensor Pollicis Longus, pp. 179-180; Fig. 12-14', 179, 'Extensor Pollicis Longus')], [
    resource('localization', 'Lee & DeLisa：EPL', '含前臂背側定位、拇指伸展 activation 與鄰肌辨別。', lee('Ch. 12, pp. 179-180; Fig. 12-14', 179, 'Extensor Pollicis Longus')),
  ]),
  'supplement-epb': verified([
    atlas('Radial Nerve > Extensor Pollicis Brevis > EMG Needle Insertion / Pitfalls', 'https://emg-atlas.neurol.ru/radial_nerve/'),
  ], [resource('localization', '外部教學圖譜：EPB', '含肌肉定位、MCP extension activation 與鄰肌 pitfalls。', atlas('Extensor Pollicis Brevis section', 'https://emg-atlas.neurol.ru/radial_nerve/'))]),
  'supplement-palmaris-longus': verified([lee('Ch. 12, Palmaris Longus, pp. 168-169; Fig. 12-3', 168, 'Palmaris Longus')], [
    resource('localization', 'Lee & DeLisa：Palmaris Longus', '含肌腱追蹤、肌腹定位及先天缺如的提醒。', lee('Ch. 12, pp. 168-169; Fig. 12-3', 168, 'Palmaris Longus')),
  ]),
  'supplement-lumbricals-hand': verified([lee('Ch. 11, First Lumbrical, pp. 156-157; Fig. 11-4', 156, 'Lumbricals')], [
    resource('localization', 'Lee & DeLisa：First Lumbrical', '提供第一蚓狀肌的掌側 landmark、動作與鄰近 FDP／掌骨提示。', lee('Ch. 11, pp. 156-157; Fig. 11-4', 156, 'Lumbricals')),
  ]),
  'supplement-palmar-interossei': verified([lee('Ch. 11, Second Palmar Interosseous, p. 161; Fig. 11-7', 161, 'Palmar Interossei')], [
    resource('localization', 'Lee & DeLisa：Palmar Interosseous', '含 second palmar interosseous 圖版與進針定位。', lee('Ch. 11, p. 161; Fig. 11-7', 161, 'Palmar Interossei')),
  ]),
  'supplement-adductor-pollicis': verified([
    atlas('Ulnar Nerve > Adductor Pollicis > EMG Needle Insertion / Pitfalls', 'https://emg-atlas.neurol.ru/nerve_ulnar/'),
  ], [resource('localization', '外部教學圖譜：Adductor Pollicis', '含 first web space 定位、拇指內收 activation 與 FDI 誤入提醒。', atlas('Adductor Pollicis section', 'https://emg-atlas.neurol.ru/nerve_ulnar/'))]),
  'supplement-sartorius': verified([lee('Ch. 17, Sartorius, pp. 223-224; Fig. 17-6', 224, 'Sartorius')], [
    resource('localization', 'Lee & DeLisa：Sartorius', '以 ASIS、帶狀肌腹與複合髖動作建立定位。', lee('Ch. 17, pp. 223-224; Fig. 17-6', 224, 'Sartorius')),
  ], { fieldCitations: { innervation: [sartoriusAnatomy] } }),
  'supplement-pectineus': verified([lee('Ch. 17, Pectineus, pp. 220-221; Fig. 17-2', 220, 'Pectineus')], [
    resource('localization', 'Lee & DeLisa：Pectineus', '含 femoral pulse landmark、肌肉圖版與鄰近結構。', lee('Ch. 17, pp. 220-221; Fig. 17-2', 220, 'Pectineus')),
  ]),
  'supplement-obturator-externus': limited([obturatorAnatomy], [
    resource('safety', '深層髖外旋肌的證據限制', '此圖譜明載深層短髖肌難以直接觀察、鄰近重要神經血管且缺乏人類 EMG 資料；本站不提供盲刺路徑。', sacralAtlas),
  ], {
    fieldCitations: {
      innervation: [cite('statpearls-obturator-2023', 'Nerves: posterior obturator branch; L2-L4', undefined, 'anatomy-only')],
      insertion: [sacralAtlas],
      activation: [cite('statpearls-obturator-2023', 'Structure and Function: external rotation and flexed-hip adduction', undefined, 'anatomy-only')],
    },
    clinicalPointCitations: [[sacralAtlas], [obturatorAnatomy]],
    anatomyPointCitations: [[cite('statpearls-obturator-2023', 'Blood Supply and Lymphatics: obturator and medial circumflex femoral artery branches', undefined, 'anatomy-only')], [sacralAtlas]],
  }),
  'supplement-gluteus-minimus': verified([lee('Ch. 18, Gluteus Minimus, pp. 231-232; Fig. 18-3', 231, 'Gluteus Minimus')], [
    resource('localization', 'Lee & DeLisa：Gluteus Minimus', '提供病人姿勢、深層定位與臀中肌辨別。', lee('Ch. 18, pp. 231-232; Fig. 18-3', 231, 'Gluteus Minimus')),
  ]),
  'supplement-piriformis': limited([piriformisAnatomy], [resource('safety', '深層臀肌證據限制', '非例行表面 landmark 取樣；圖譜指出深層短髖肌缺乏直接人類 EMG 資料。', sacralAtlas)], {
    fieldCitations: {
      innervation: [cite('statpearls-piriformis-2023', 'Nerves and Physiologic Variants: S1-S2 with reported variation', undefined, 'anatomy-only')],
      insertion: [sacralAtlas],
      activation: [cite('statpearls-piriformis-2023', 'Structure and Function: lateral rotation in extension; abduction in flexion', undefined, 'anatomy-only')],
    },
    clinicalPointCitations: [[sacralAtlas], [piriformisAnatomy]],
    anatomyPointCitations: [[cite('statpearls-piriformis-2023', 'Structure and Function; Physiologic Variants: relationship to sciatic nerve', undefined, 'anatomy-only')], [sacralAtlas]],
  }),
  'supplement-obturator-internus-gemelli': limited([gemelliAnatomy, obturatorAnatomy], [resource('safety', '深層臀肌證據限制', '不提供固定深度或盲刺路徑；若有特殊適應症，須由具專門訓練者依個案與院內程序決定是否使用即時影像。', sacralAtlas)], {
    fieldCitations: {
      innervation: [cite('statpearls-gemelli-2026', 'Nerves: distinct superior/inferior gemellus innervation; Physiologic Variants', undefined, 'anatomy-only'), cite('statpearls-obturator-2023', 'Nerves: obturator internus and superior gemellus; dual-innervation variation', undefined, 'anatomy-only')],
      insertion: [gemelliAnatomy, sacralAtlas],
      activation: [cite('statpearls-gemelli-2026', 'Structure and Function: shared external rotation', undefined, 'anatomy-only')],
    },
    clinicalPointCitations: [[sacralAtlas], [gemelliAnatomy]],
    anatomyPointCitations: [[gemelliAnatomy], [cite('statpearls-obturator-2023', 'Nerves: superior gemellus dual innervation reported in 60.4%', undefined, 'anatomy-only')]],
  }),
  'supplement-quadratus-femoris': limited([gemelliAnatomy], [resource('safety', '深層臀肌證據限制', '此肌與重要神經血管相鄰，且缺乏一般 needle EMG 定位資料。', sacralAtlas)], {
    fieldCitations: {
      innervation: [cite('statpearls-gemelli-2026', 'Nerves: nerve to quadratus femoris (L4-S1)', undefined, 'anatomy-only')],
      insertion: [sacralAtlas],
      activation: [cite('statpearls-gemelli-2026', 'Structure and Function: short external rotators work synergistically', undefined, 'anatomy-only')],
    },
    clinicalPointCitations: [[sacralAtlas], [sacralAtlas]],
    anatomyPointCitations: [[gemelliAnatomy], [sacralAtlas]],
  }),
  'supplement-ehb': verified([siuEdb], [
    resource('localization', 'SIU EDB／EHB 複合定位', 'SIU 將最內側 slip 說明為 EHB；因此本頁不宣稱能以同一路徑完全隔離 EHB。', siuEdb),
  ]),
  'supplement-peroneus-brevis': verified([
    atlas('Common Peroneal Nerve > Peroneus Brevis > EMG Needle Insertion / Pitfalls', 'https://emg-atlas.neurol.ru/common_peroneal_nerve/'),
  ], [resource('localization', '外部教學圖譜：Peroneus Brevis', '含遠端外側小腿定位、eversion activation 與鄰肌 pitfalls。', atlas('Peroneus Brevis section', 'https://emg-atlas.neurol.ru/common_peroneal_nerve/'))]),
  'supplement-popliteus': limited([popliteusAtlas], [resource('safety', 'Popliteus：低效益、高鄰近風險', '圖譜指出肌肉薄、臨床用途有限且鄰近 popliteal vessels；本站不把其盲刺路徑列為常規建議。', popliteusAtlas)], {
    fieldCitations: {
      innervation: [popliteusAtlas],
      insertion: [popliteusAtlas],
      activation: [popliteusAtlas],
    },
    clinicalPointCitations: [[popliteusAtlas], [popliteusAtlas]],
    anatomyPointCitations: [[popliteusAtlas], [popliteusAtlas]],
  }),
  'supplement-fhl': verified([lee('Ch. 16, Flexor Hallucis Longus, p. 217', 217, 'Flexor Hallucis Longus'), saddlerFhl], [
    resource('ultrasound', 'FHL ultrasound 橫切面', '圖 8 同時標出 FDL、TP、soleus、tibial nerve 與 fibula，適合深層後側小腿定位。', saddlerFhl),
  ]),
  'supplement-fdb': verified([lee('Ch. 15, Flexor Digitorum Brevis, pp. 202-203', 203, 'Flexor Digitorum Brevis')], [
    resource('localization', 'Lee & DeLisa：Flexor Digitorum Brevis', '含足底定位、activation 與 abductor hallucis 鄰界。', lee('Ch. 15, pp. 202-203', 203, 'Flexor Digitorum Brevis')),
  ]),
  'supplement-foot-interossei': verified([siuFootFdi], [
    resource('localization', 'SIU First Dorsal Interosseous (Foot)', '含第一、二蹠骨間的精確定位、activation 與深度警語。', siuFootFdi),
  ]),
  'supplement-eas': verified([
    cite('ics-clinical-neurophysiology', '§B.I.2 Electromyography, PDF p. 6, EAS technique'),
    lee('Ch. 20, External Anal Sphincter, pp. 242-243; Fig. 20-1', 242, 'External Anal Sphincter'),
  ], [
    resource('technique', 'ICS 骨盆底專科技術', '說明 EAS 表淺／深層取樣、象限與限制；僅供受訓專科醫師參考。', cite('ics-clinical-neurophysiology', 'PDF p. 6')),
  ]),
  'supplement-bulbocavernosus': verified([
    cite('ics-clinical-neurophysiology', '§B.I.2 Electromyography, PDF p. 6, male/female bulbocavernosus routes'),
    lee('Ch. 20, Bulbocavernosus, pp. 242-243; Fig. 20-2', 243, 'Bulbocavernosus'),
  ], [
    resource('technique', 'ICS 骨盆底專科技術', '分列男性與女性 needle route，並強調這是專科 invasive study。', cite('ics-clinical-neurophysiology', 'PDF p. 6')),
  ]),
}

export const externalResourcesByCatalogName: Record<string, NeedleGuideResource[]> = {
  'Opponens Pollicis': [resource('technique', '較低疼痛的 distal median 選項', 'Menkes & Pierce 指出 OP 取樣通常比 APB 不適感低。', cite('menkes-pierce-2019', 'Appendix A, Opponens pollicis; Fig. 2'))],
  'Flexor Carpi Ulnaris': [resource('technique', 'FCU 精確表面 landmark', '沿 medial epicondyle 至 pisiform 的連線，在內上髁遠端 5-8 cm 進針。', cite('menkes-pierce-2019', 'Appendix A, Flexor carpi ulnaris; Fig. 1'))],
  'Pronator Teres': [resource('technique', '以 elbow flexion 降低不適', '文中建議以屈肘作次要 activation，可減少旋前造成的疼痛與 needle bending。', cite('menkes-pierce-2019', 'Appendix A, Pronator teres'))],
  'Serratus Anterior': [
    resource('technique', '兩指夾住肋骨的定位法', '在 mid/anterior axillary line 隔著肋骨固定目標，針在兩指間進入；需同時注意胸膜風險。', cite('menkes-pierce-2019', 'Appendix A, Serratus anterior; Fig. 4')),
    resource('safety', 'AANEM 氣胸風險', 'AANEM 將 serratus anterior 列為鄰近胸膜與肺的風險肌肉。', aanemChest),
    resource('technique', '新進針點仍屬 cadaver evidence', '研究提出由肩胛下角連至劍突線近端三分之一的新位置；作者明確要求再以活體影像驗證。', cite('lim-et-al-2023', 'Abstract: Methods, Results, Discussion')),
    resource('safety', '氣胸症狀多在 24 小時內出現', '64,490 次 EMG 的回溯研究中，7 例相關氣胸皆有症狀並於 24 小時內就醫；應告知新發呼吸困難或胸膜性胸痛須立即評估。', cite('kassardjian-et-al-2016', 'Abstract: Results and Conclusions', undefined, 'safety-only')),
  ],
  'Rhomboid Major/Minor': [
    resource('technique', 'Root collateral 的定位價值', 'Rhomboid 異常可支持 C5 root lesion 相對於 upper trunk plexopathy。', cite('menkes-pierce-2019', 'Appendix A, Rhomboid')),
    resource('safety', 'AANEM 氣胸風險', 'Rhomboid 取樣需避免穿越胸壁；可考慮 ultrasound 增加準確度。', aanemChest),
    resource('ultrasound', '單靠 rib palpation 可能不準', '88 個肋骨定位中，觸診肋骨中心正確率為 66.3%；肌肉較厚或 BMI 較高時錯誤較多。', cite('cushman-et-al-2018', 'Abstract: Methods, Results, Discussion')),
  ],
  'Extensor Indicis Proprius': [resource('technique', '以 ulna 建立 EIP 定位', '在 ulnar styloid 近端 5-7 cm、緊鄰 ulna radial side 進針。', cite('menkes-pierce-2019', 'Appendix A, Extensor indicis'))],
  'Extensor Digitorum Communis': [resource('technique', '用 movable-wad groove 分界', '以 middle-finger extension 觸診，並利用與 radial wrist extensors 間的 groove 避免誤入。', cite('menkes-pierce-2019', 'Appendix A, Extensor digitorum'))],
  'Extensor Hallucis Longus': [resource('technique', '薄而縱向的 EHL 進針方向', '由小腿外側向內側斜入，比垂直下刺更符合肌腹走向；收縮前先退出皮下可避免 needle bending。', cite('menkes-pierce-2019', 'Appendix A, Extensor hallucis longus; Fig. 5'))],
  'Gluteus Medius': [resource('technique', 'ASIS—greater trochanter 線', '在兩 landmark 中點稍後方進針，internal rotation 可協助 activation。', cite('menkes-pierce-2019', 'Appendix A, Gluteus medius'))],
  'Biceps Femoris (Short Head)': [resource('technique', '遠端位置才有助分離 short head', '靠近 proximal popliteal crease、在 lateral hamstring tendon 下方取樣；太近端無法可靠區分兩頭。', cite('menkes-pierce-2019', 'Appendix A, Biceps femoris short head'))],
  'Peroneus Longus': [resource('technique', '表淺且可觸診的 proximal target', '定位於小腿近端三分之一、tibialis anterior 外側，以 plantar flexion 加最小 eversion activation。', cite('menkes-pierce-2019', 'Appendix A, Fibularis longus'))],
  'Tibialis Posterior': [resource('ultrasound', '深層下肢肌的命中率限制', '四肌 cadaver 研究中，surface landmark 組整體命中率 71.9%，ultrasound-guided 組 96.9%；TP 的 blind accuracy 最低。', cite('yun-et-al-2015', 'Results, Tables 1-2; Figs. 1-2'))],
  'Paraspinal (Cervical)': [resource('safety', 'PSP timing 與 false-positive caveats', 'SA 約 7-10 天可先在 PSP 出現；年長無症狀者也可能異常，孤立 PSP findings 不宜單獨定論。', cite('aapmr-radiculopathy-2023', 'Definition: NEE timing, sensitivity, and paraspinal limitations', undefined, 'safety-only'))],
  'Paraspinal (Thoracic)': [resource('safety', '胸椎 PSP：定位價值與胸膜風險分開判斷', '胸椎 radiculopathy 少見；取樣需把診斷效益與胸膜風險個案化衡量。', cite('aapmr-radiculopathy-2023', 'Overview and Description: thoracic radiculopathy prevalence', undefined, 'safety-only')), resource('safety', 'AANEM 胸膜風險', 'AANEM 將 thoracic paraspinals 列為可能造成氣胸的取樣區。', aanemChest)],
  'Paraspinal (L2)': [resource('safety', 'PSP timing 與 false-positive caveats', 'SA 約 7-10 天可先在 PSP 出現；年長無症狀者也可能異常，孤立 PSP findings 不宜單獨定論。', cite('aapmr-radiculopathy-2023', 'Definition: NEE timing, sensitivity, and paraspinal limitations', undefined, 'safety-only'))],
  'Paraspinal (L3)': [resource('safety', 'PSP timing 與 false-positive caveats', 'SA 約 7-10 天可先在 PSP 出現；年長無症狀者也可能異常，孤立 PSP findings 不宜單獨定論。', cite('aapmr-radiculopathy-2023', 'Definition: NEE timing, sensitivity, and paraspinal limitations', undefined, 'safety-only'))],
  'Paraspinal (L4)': [resource('safety', 'PSP timing 與 false-positive caveats', 'SA 約 7-10 天可先在 PSP 出現；年長無症狀者也可能異常，孤立 PSP findings 不宜單獨定論。', cite('aapmr-radiculopathy-2023', 'Definition: NEE timing, sensitivity, and paraspinal limitations', undefined, 'safety-only'))],
  'Paraspinal (L5)': [resource('safety', 'PSP timing 與 false-positive caveats', 'SA 約 7-10 天可先在 PSP 出現；年長無症狀者也可能異常，孤立 PSP findings 不宜單獨定論。', cite('aapmr-radiculopathy-2023', 'Definition: NEE timing, sensitivity, and paraspinal limitations', undefined, 'safety-only'))],
  'Paraspinal (S1)': [resource('safety', 'PSP timing 與 false-positive caveats', 'SA 約 7-10 天可先在 PSP 出現；年長無症狀者也可能異常，孤立 PSP findings 不宜單獨定論。', cite('aapmr-radiculopathy-2023', 'Definition: NEE timing, sensitivity, and paraspinal limitations', undefined, 'safety-only'))],
  'Flexor Digitorum Longus': [resource('technique', '貼 tibia 後緣辨別深層屈肌', 'distal third leg、緊貼 tibia 後方 2-3 cm；可用 toe flexion 與 slight plantar flexion 區分鄰近 TP。', cite('menkes-pierce-2019', 'Appendix A, Flexor digitorum longus'))],
  'Teres Minor': [resource('ultrasound', 'Teres minor 與 infraspinatus／posterior deltoid 分層', '圖 1 顯示三肌與 axillary neurovascular structures，可降低共同 external rotation 造成的誤認。', cite('saddler-et-al-2026', '§3.1 Teres Minor; Fig. 1'))],
  'Flexor Pollicis Longus': [resource('ultrasound', 'FPL 與 median nerve／radial artery', '動態 IP flexion 可凸顯 FPL；橫切面可同時辨識鄰近神經血管。', cite('saddler-et-al-2026', '§3.6 Flexor Pollicis Longus; Fig. 6'))],
  'Flexor Digitorum Superficialis': [resource('ultrasound', 'FDS／FDP 同一視野辨認 slips', 'distal one-third forearm 橫切面可利用 median nerve 作層次 landmark，並以個別手指活動辨識肌束。', cite('saddler-et-al-2026', '§3.5 FDS/FDP; Fig. 5'))],
  'Flexor Digitorum Profundus (1,2)': [resource('ultrasound', 'FDS／FDP 同一視野辨認 slips', 'ultrasound 配合個別 DIP flexion，有助確認 FDP 2-3 slips 與 median nerve 的關係。', cite('saddler-et-al-2026', '§3.5 FDS/FDP; Fig. 5'))],
  'Gracilis': [resource('ultrasound', 'Gracilis 與 adductor compartment 分層', '作者以 ultrasound 建立 gracilis 的 donor-muscle 定位與周邊結構辨識。', cite('saddler-et-al-2026', '§3.9 Gracilis; Fig. 9'))],
}

export function textbookGuideEvidence(figures: number[], catalogNames: string[]): NeedleGuideEvidence {
  const locator = `Ch. 13, Fig. ${figures.map((figure) => `13.${figure}`).join(', ')}`
  const defaultCitations = [cite('preston-shapiro-2020', locator)]
  return {
    defaultCitations,
    resources: catalogNames.flatMap((name) => externalResourcesByCatalogName[name] ?? []),
    evidenceStatus: 'book-mapped',
    sourceCheckedOn: reviewedOn,
    clinicalReviewStatus: 'pending-emg-physician',
  }
}

export function citationsForGuidePart(
  evidence: NeedleGuideEvidence,
  part: 'innervation' | 'insertion' | 'activation' | 'clinicalPoint' | 'anatomyPoint',
  index = 0,
): NeedleCitationRef[] {
  if (part === 'clinicalPoint') return evidence.clinicalPointCitations?.[index] ?? evidence.defaultCitations
  if (part === 'anatomyPoint') return evidence.anatomyPointCitations?.[index] ?? evidence.defaultCitations
  return evidence.fieldCitations?.[part] ?? evidence.defaultCitations
}

export function evidenceSource(sourceId: string): NeedleEvidenceSource {
  const source = needleEvidenceSources[sourceId]
  if (!source) throw new Error(`Unknown needle evidence source: ${sourceId}`)
  return source
}
