export type DermatomeRegion = 'cervical' | 'thoracic' | 'lumbar' | 'sacral'

export interface DermatomePoint {
  root: string
  region: DermatomeRegion
  regionLabel: string
  landmark: string
  landmarkEnglish: string
  quickReference?: boolean
}

const regionLabels: Record<DermatomeRegion, string> = {
  cervical: '頸髓',
  thoracic: '胸髓',
  lumbar: '腰髓',
  sacral: '薦髓',
}

function point(
  root: string,
  region: DermatomeRegion,
  landmark: string,
  landmarkEnglish: string,
  quickReference = false,
): DermatomePoint {
  return {
    root,
    region,
    regionLabel: regionLabels[region],
    landmark,
    landmarkEnglish,
    quickReference,
  }
}

/**
 * Bilateral key sensory points from ISNCSCI 2019 (C2 through S4-5).
 * These are standardized examination landmarks, not claims that a dermatome
 * has a sharp or invariant border.
 */
export const dermatomePoints: DermatomePoint[] = [
  point('C2', 'cervical', '枕骨隆凸外側至少 1 公分', 'At least 1 cm lateral to the occipital protuberance'),
  point('C3', 'cervical', '鎖骨上窩、鎖骨中線位置', 'Supraclavicular fossa at the midclavicular line'),
  point('C4', 'cervical', '肩鎖關節上方', 'Over the acromioclavicular joint'),
  point('C5', 'cervical', '肘前窩外側、肘關節近端', 'Lateral antecubital fossa just proximal to the elbow'),
  point('C6', 'cervical', '拇指近節指骨背側', 'Dorsum of the proximal phalanx of the thumb', true),
  point('C7', 'cervical', '中指近節指骨背側', 'Dorsum of the proximal phalanx of the middle finger', true),
  point('C8', 'cervical', '小指近節指骨背側', 'Dorsum of the proximal phalanx of the little finger', true),

  point('T1', 'thoracic', '肘前窩內側、內上髁近端', 'Medial antecubital fossa proximal to the medial epicondyle'),
  point('T2', 'thoracic', '腋窩頂點', 'Apex of the axilla'),
  point('T3', 'thoracic', '鎖骨中線、第 3 肋間', 'Midclavicular line at the third intercostal space'),
  point('T4', 'thoracic', '鎖骨中線、第 4 肋間（乳頭水平）', 'Midclavicular line at the fourth intercostal space', true),
  point('T5', 'thoracic', '鎖骨中線、第 5 肋間（T4 與 T6 中間）', 'Midclavicular line at the fifth intercostal space'),
  point('T6', 'thoracic', '鎖骨中線、第 6 肋間（劍突水平）', 'Midclavicular line at the sixth intercostal space', true),
  point('T7', 'thoracic', '鎖骨中線、第 7 肋間（T6 與 T8 中間）', 'Midclavicular line at the seventh intercostal space'),
  point('T8', 'thoracic', '鎖骨中線、第 8 肋間（T6 與 T10 中間）', 'Midclavicular line at the eighth intercostal space'),
  point('T9', 'thoracic', '鎖骨中線、第 9 肋間（T8 與 T10 中間）', 'Midclavicular line at the ninth intercostal space'),
  point('T10', 'thoracic', '鎖骨中線、第 10 肋間（肚臍水平）', 'Midclavicular line at the tenth intercostal space', true),
  point('T11', 'thoracic', '鎖骨中線、第 11 肋間（T10 與 T12 中間）', 'Midclavicular line at the eleventh intercostal space'),
  point('T12', 'thoracic', '腹股溝韌帶中點', 'Midpoint of the inguinal ligament'),

  point('L1', 'lumbar', 'T12 與 L2 標準點連線的中點', 'Midway between the T12 and L2 key sensory points'),
  point('L2', 'lumbar', '前內側大腿：腹股溝韌帶中點至股骨內髁連線的中點', 'Anterior-medial thigh, midway between T12 and the medial femoral condyle'),
  point('L3', 'lumbar', '膝上方的股骨內髁', 'Medial femoral condyle above the knee'),
  point('L4', 'lumbar', '內踝', 'Medial malleolus', true),
  point('L5', 'lumbar', '足背第 3 蹠趾關節', 'Dorsum of the foot at the third metatarsophalangeal joint', true),

  point('S1', 'sacral', '足跟外側', 'Lateral heel / calcaneus', true),
  point('S2', 'sacral', '膕窩中點', 'Midpoint of the popliteal fossa'),
  point('S3', 'sacral', '坐骨粗隆或臀溝', 'Ischial tuberosity or infragluteal fold'),
  point('S4-5', 'sacral', '肛門周圍、距皮膚黏膜交界外側小於 1 公分', 'Perianal area, less than 1 cm lateral to the mucocutaneous junction', true),
]

export const dermatomeRegionOptions: Array<{
  value: 'all' | DermatomeRegion
  label: string
  range: string
}> = [
  { value: 'all', label: '全部', range: 'C2-S4/5' },
  { value: 'cervical', label: '頸髓', range: 'C2-C8' },
  { value: 'thoracic', label: '胸髓', range: 'T1-T12' },
  { value: 'lumbar', label: '腰髓', range: 'L1-L5' },
  { value: 'sacral', label: '薦髓', range: 'S1-S4/5' },
]
