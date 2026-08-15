export type NcvRegion = 'upper' | 'lower' | 'cranial-respiratory' | 'late-response'
export type NcvModality = 'motor' | 'sensory' | 'mixed' | 'comparison' | 'late-response' | 'reflex'
export type NcvPriority = 'common' | 'supplemental'

export interface NcvImage {
  src: string
  alt: string
  caption: string
}

export interface NcvStimulationSite {
  label: string
  site: string
  distance?: string
}

export interface NcvStudy {
  id: string
  title: string
  englishTitle: string
  nerve: string
  region: NcvRegion
  modality: NcvModality
  priority: NcvPriority
  recording: {
    target: string
    g1: string
    g2: string
    ground: string
  }
  cathode: string
  position: string
  stimulations: NcvStimulationSite[]
  normalValues: string[]
  notes: string[]
  images: NcvImage[]
  sourceLocator: string
  searchTerms?: string[]
}

export const ncvRegionLabels: Record<NcvRegion, string> = {
  upper: '上肢',
  lower: '下肢',
  'cranial-respiratory': '顱神經／呼吸',
  'late-response': '晚期反應',
}

export const ncvModalityLabels: Record<NcvModality, string> = {
  motor: '運動',
  sensory: '感覺',
  mixed: '混合',
  comparison: '比較',
  'late-response': 'F-wave',
  reflex: '反射',
}

export const ncvRegionOptions: Array<{ value: 'all' | NcvRegion; label: string }> = [
  { value: 'all', label: '全部區域' },
  { value: 'upper', label: '上肢' },
  { value: 'lower', label: '下肢' },
  { value: 'cranial-respiratory', label: '顱神經／呼吸' },
  { value: 'late-response', label: '晚期反應' },
]

export const ncvModalityOptions: Array<{ value: 'all' | NcvModality; label: string }> = [
  { value: 'all', label: '全部類型' },
  { value: 'motor', label: '運動' },
  { value: 'sensory', label: '感覺' },
  { value: 'mixed', label: '混合' },
  { value: 'comparison', label: '比較' },
  { value: 'late-response', label: 'F-wave' },
  { value: 'reflex', label: '反射' },
]

const standardGround = '置於刺激器與記錄電極之間的同側肢段；避免導線交疊。'

function montage(target: string, g1: string, g2: string, ground = standardGround) {
  return { target, g1, g2, ground }
}

function image(figure: string, caption: string, alt: string): NcvImage {
  return { src: `/ncv-guides/fig-${figure}.jpg`, caption, alt }
}

export const ncvStudies: NcvStudy[] = [
  {
    id: 'median-motor-apb', title: '正中神經運動傳導（APB）', englishTitle: 'Median motor study — APB',
    nerve: '正中神經（Median nerve）', region: 'upper', modality: 'motor', priority: 'common',
    recording: montage('拇短展肌（abductor pollicis brevis, APB）', 'APB 肌腹。', '第 1 掌指關節。'),
    cathode: '一般朝向 G1；以足夠但不過度的電流取得 supramaximal CMAP。', position: '仰臥或坐姿，前臂旋後、手掌朝上並放鬆。',
    stimulations: [
      { label: '腕部', site: '腕中央略偏橈側，位於橈側屈腕肌與掌長肌肌腱之間。', distance: 'G1 至陰極 7 cm' },
      { label: '肘窩', site: '肘窩內、肱動脈搏動稍內側。' },
    ],
    normalValues: ['CMAP ≥4.0 mV', '傳導速度 ≥49 m/s', '遠端潛時 ≤4.4 ms（7 cm）'],
    notes: ['電流過大可能共同刺激尺神經。', '近端 CMAP 反而大於腕部時，考慮 Martin–Gruber anastomosis。'],
    images: [image('10-01-a', '腕部刺激', '正中神經腕部刺激並記錄 APB'), image('10-01-b', '肘窩刺激', '正中神經肘窩刺激並記錄 APB')], sourceLocator: 'Ch. 10, Fig. 10.1；p. 122 成人正常值表',
  },
  {
    id: 'median-motor-palmar', title: '正中神經掌段運動傳導', englishTitle: 'Median motor palmar study',
    nerve: '正中神經返迴運動支（Recurrent thenar branch）', region: 'upper', modality: 'motor', priority: 'supplemental',
    recording: montage('拇短展肌（APB）', 'APB 肌腹。', '第 1 掌指關節。'),
    cathode: '一般朝向 G1；掌部刺激出現明顯 artifact 時可旋轉陽極方向。', position: '前臂旋後、手掌朝上，手掌與拇指放鬆。',
    stimulations: [
      { label: '腕部', site: '標準正中神經腕部刺激點。', distance: '腕部至 G1 7 cm' },
      { label: '掌部', site: '由腕部沿食指與中指指蹼方向向遠端 7 cm。', distance: '掌部與腕部相距 7 cm' },
    ],
    normalValues: ['掌部／腕部 CMAP 振幅比 >1.2，提示腕部存在部分傳導阻斷。'],
    notes: ['因研究區段很短且路徑不易精確測量，不宜用此段速度作主要判讀。', '掌部刺激須避免 stimulus artifact 污染起始潛時。'],
    images: [image('10-02-a', '腕部刺激', '正中神經掌段運動研究的腕部刺激'), image('10-02-b', '掌部刺激', '正中神經掌段運動研究的掌部刺激')], sourceLocator: 'Ch. 10, Fig. 10.2；p. 123 掌部刺激比較表',
  },
  {
    id: 'median-sensory-digit', title: '正中神經感覺傳導（D2／D3）', englishTitle: 'Median antidromic sensory study',
    nerve: '正中神經（Median nerve）', region: 'upper', modality: 'sensory', priority: 'common',
    recording: montage('食指或中指（digit 2 or 3）', '環狀電極置於掌指關節。', '另一環狀電極置於遠端指間關節，與 G1 相距 3–4 cm。'),
    cathode: '一般朝向 G1；避免過度刺激造成鄰近神經或運動反應污染。', position: '前臂旋後、手掌朝上；手指稍微張開可減少 volume-conducted motor potential。',
    stimulations: [{ label: '腕部', site: '腕中央略偏橈側，位於橈側屈腕肌與掌長肌肌腱之間。', distance: '陰極至 G1 13 cm' }],
    normalValues: ['D2 SNAP ≥20 μV', '傳導速度 ≥50 m/s', 'peak latency ≤3.5 ms（13 cm）'],
    notes: ['此處為 antidromic 技術；orthodromic 時刺激與記錄位置對調。', '拇指與無名指也有部分正中神經支配，可作比較研究。'],
    images: [image('10-03', '腕部刺激、D2／D3 記錄', '正中神經腕部刺激與手指環狀記錄電極')], sourceLocator: 'Ch. 10, Fig. 10.3；p. 122 成人正常值表',
  },
  {
    id: 'median-sensory-palmar', title: '正中神經掌段感覺傳導', englishTitle: 'Median sensory palmar / segmental study',
    nerve: '正中神經（Median nerve）', region: 'upper', modality: 'sensory', priority: 'supplemental',
    recording: montage('中指（digit 3）', '近端指間關節。', '遠端指間關節，與 G1 相距 3–4 cm。'),
    cathode: '一般朝向 G1；掌部 artifact 明顯時旋轉陽極，直到基線可判讀。', position: '前臂旋後、手掌朝上，手指自然放鬆。',
    stimulations: [
      { label: '腕部', site: '標準正中神經腕部刺激點。', distance: '至 G1 14 cm' },
      { label: '掌部', site: '腕部刺激點向中指方向遠端 7 cm。', distance: '至 G1 7 cm' },
    ],
    normalValues: ['掌部／腕部 SNAP 振幅比 >1.6，提示腕部存在部分傳導阻斷。', '正常時 wrist–palm CV 應快於 palm–digit 3；CTS 可出現反轉。'],
    notes: ['兩處都必須取得清楚 onset；常需 averaging。', '距離可調整，但掌到手指距離為腕到手指的一半時，區段計算最簡單。'],
    images: [image('10-04-a', '腕部刺激', '正中神經掌段感覺研究腕部刺激'), image('10-04-b', '掌部刺激', '正中神經掌段感覺研究掌部刺激')], sourceLocator: 'Ch. 10, Fig. 10.4；p. 123 掌部刺激比較表',
  },
  {
    id: 'ulnar-motor-adm', title: '尺神經運動傳導（ADM）', englishTitle: 'Ulnar motor study — ADM',
    nerve: '尺神經（Ulnar nerve）', region: 'upper', modality: 'motor', priority: 'common',
    recording: montage('小指展肌（abductor digiti minimi, ADM）', '小魚際 ADM 肌腹。', '第 5 掌指關節。'),
    cathode: '一般朝向 G1；肘下常需較高電流，肘上所需電流通常約為肘下的一半。', position: '肘屈曲 90–135°，以前臂與手放鬆的姿勢沿彎曲路徑量測跨肘距離。',
    stimulations: [
      { label: '腕部', site: '腕部尺側、尺側屈腕肌肌腱旁。', distance: '至 G1 7 cm' },
      { label: '肘下', site: '內上髁遠端 3 cm。' },
      { label: '肘上', site: '肱骨內側、肱二頭肌與肱三頭肌之間。', distance: '與肘下相距 10–12 cm' },
      { label: '腋窩（選用）', site: '近端腋窩、肱二頭肌內側與腋動脈搏動處。' },
    ],
    normalValues: ['CMAP ≥6.0 mV', '傳導速度 ≥49 m/s', '遠端潛時 ≤3.3 ms（7 cm）'],
    notes: ['腕、肘下、肘上三點都應完成，否則可能漏掉跨肘減慢。', '肘伸直會低估實際距離，造成假性減慢。', '肘下 CMAP 比腕部低 >10% 時考慮 Martin–Gruber anastomosis。'],
    images: [image('10-05-a', '腕部刺激', '尺神經腕部刺激並記錄 ADM'), image('10-05-b', '肘下刺激', '尺神經肘下刺激'), image('10-05-c', '肘上刺激', '尺神經肘上刺激'), image('10-05-d', '腋窩刺激', '尺神經腋窩刺激')], sourceLocator: 'Ch. 10, Fig. 10.5；p. 122 成人正常值表',
  },
  {
    id: 'ulnar-sensory-digit5', title: '尺神經感覺傳導（D5）', englishTitle: 'Ulnar antidromic sensory study',
    nerve: '尺神經（Ulnar nerve）', region: 'upper', modality: 'sensory', priority: 'common',
    recording: montage('小指（digit 5）', '掌指關節。', '遠端指間關節，與 G1 相距 3–4 cm。'),
    cathode: '一般朝向 G1；電流過大可能產生運動反應，遮蔽 SNAP。', position: '前臂旋後、手掌朝上；必要時將 G1 稍向遠端移並把手指輕微張開。',
    stimulations: [{ label: '腕部', site: '腕部尺側、尺側屈腕肌肌腱旁。', distance: '陰極至 G1 11 cm' }],
    normalValues: ['SNAP ≥17 μV（>60 歲成人常以 >10 μV 視為可接受）', '傳導速度 ≥50 m/s', 'peak latency ≤3.1 ms（11 cm）'],
    notes: ['此處為 antidromic 技術；orthodromic 時位置對調。', '近端跨肘感覺反應通常較小，較易受 temporal dispersion 與 phase cancellation 影響。'],
    images: [image('10-06', '腕部刺激、D5 記錄', '尺神經腕部刺激與小指環狀記錄電極')], sourceLocator: 'Ch. 10, Fig. 10.6；p. 122 成人正常值表',
  },
  {
    id: 'dorsal-ulnar-cutaneous', title: '尺背皮神經感覺傳導', englishTitle: 'Dorsal ulnar cutaneous sensory study',
    nerve: '尺背皮神經（Dorsal ulnar cutaneous nerve）', region: 'upper', modality: 'sensory', priority: 'common',
    recording: montage('手背第 4、5 指指蹼', '第 4、5 指蹼。', '沿小指方向遠端 3–4 cm。'),
    cathode: '一般朝向 G1；神經表淺，通常 5–15 mA 即可達 supramaximal。', position: '前臂旋前、手背朝上。',
    stimulations: [{ label: '遠端前臂', site: '尺骨莖突稍近端且偏下方。', distance: '8–10 cm；正常值表以 8 cm' }],
    normalValues: ['SNAP ≥8 μV', '傳導速度 ≥50 m/s', 'peak latency ≤2.5 ms（8 cm）'],
    notes: ['Guyon canal 病灶應保留此反應；肘部尺神經病變則可能異常。', '無反應時可在相同記錄點刺激 superficial radial nerve，排除罕見支配變異。'],
    images: [image('10-07', '尺骨莖突近端刺激', '尺背皮神經刺激與手背記錄')], sourceLocator: 'Ch. 10, Fig. 10.7；p. 122 成人正常值表',
  },
  {
    id: 'ulnar-motor-fdi', title: '尺神經深支運動傳導（FDI）', englishTitle: 'Deep ulnar motor branch study — FDI',
    nerve: '尺神經深支（Deep ulnar motor branch）', region: 'upper', modality: 'motor', priority: 'common',
    recording: montage('第一背側骨間肌（first dorsal interosseous, FDI）', '拇指與食指間背側指蹼的 FDI 肌腹。', '拇指掌指關節。'),
    cathode: '一般朝向 G1；肘下需較高電流，避免鄰近神經共同刺激。', position: '肘屈曲 90–135°；手背朝上或中立位並放鬆。',
    stimulations: [
      { label: '腕部', site: '尺側屈腕肌肌腱旁。', distance: '以產科卡尺量測 8–12 cm' },
      { label: '肘下', site: '內上髁遠端 3 cm。' },
      { label: '肘上', site: '肱骨內側、肱二頭肌與肱三頭肌之間。', distance: '與肘下相距 10–12 cm' },
    ],
    normalValues: ['CMAP ≥7.0 mV', '傳導速度 ≥49 m/s', '遠端潛時 ≤4.5 ms（8–12 cm）'],
    notes: ['G2 必須放在拇指 MCP；放到食指 MCP 會固定出現 initial positive deflection。', 'FDI 對 Guyon canal 深支病灶及跨肘 focal slowing 常比 ADM 敏感。'],
    images: [image('10-08', 'FDI 記錄位置', '尺神經深支運動傳導的 FDI 記錄位置')], sourceLocator: 'Ch. 10, Fig. 10.8；p. 122 成人正常值表',
  },
  {
    id: 'median-ulnar-lumbrical', title: '正中－尺神經蚓狀肌／骨間肌比較', englishTitle: 'Median–ulnar lumbrical–interossei comparison',
    nerve: '正中神經與尺神經（Median vs ulnar）', region: 'upper', modality: 'comparison', priority: 'common',
    recording: montage('第二蚓狀肌與第一掌側骨間肌（共用電極）', '第 3 掌骨中點稍偏橈側。', '食指近端指間關節。'),
    cathode: '兩條神經都使用一般朝向 G1 的配置；避免電流過大造成共同刺激。', position: '前臂旋後、手掌朝上，兩次刺激維持相同姿勢與距離。',
    stimulations: [
      { label: '正中神經', site: '標準正中神經腕部刺激點。', distance: '8–10 cm，兩者必須相同' },
      { label: '尺神經', site: '腕部尺側、尺側屈腕肌肌腱旁。', distance: '8–10 cm，兩者必須相同' },
    ],
    normalValues: ['兩者 distal latency 差 <0.5 ms；0.5 ms 為 borderline，>0.5 ms 明確異常。'],
    notes: ['適合在 polyneuropathy 造成 sensory／mixed response 消失時評估 CTS。', '若 lumbrical CMAP 起始不陡，先重定位 G1；不要把前方小型 mixed potential 當成 motor onset。'],
    images: [image('10-09-a', '正中神經刺激', '蚓狀肌比較研究的正中神經刺激'), image('10-09-b', '尺神經刺激', '骨間肌比較研究的尺神經刺激')], sourceLocator: 'Ch. 10, Fig. 10.9；p. 122 內部比較表',
  },
  {
    id: 'median-ulnar-digit4', title: '正中－尺神經 D4 感覺比較', englishTitle: 'Median–ulnar digit 4 sensory comparison',
    nerve: '正中神經與尺神經（Median vs ulnar）', region: 'upper', modality: 'comparison', priority: 'common',
    recording: montage('無名指（digit 4，共用環狀電極）', '掌指關節。', '遠端指間關節，與 G1 相距 3–4 cm。'),
    cathode: '兩次刺激皆一般朝向 G1；避免 median 與 ulnar co-stimulation。', position: '前臂旋後、手掌朝上，兩次量測保持完全相同距離。',
    stimulations: [
      { label: '正中神經', site: '標準正中神經腕部刺激點。', distance: '12–14 cm，兩者相同' },
      { label: '尺神經', site: '腕部尺側、尺側屈腕肌肌腱旁。', distance: '12–14 cm，兩者相同' },
    ],
    normalValues: ['兩者 peak latency 差 <0.5 ms；差值 ≥0.5 ms 為顯著。'],
    notes: ['無名指通常由正中與尺神經各供應一側，適合作為同肢內部比較。', '此處為 antidromic；orthodromic 時刺激與記錄位置對調。'],
    images: [image('10-10-a', '正中神經刺激', '無名指感覺比較的正中神經刺激'), image('10-10-b', '尺神經刺激', '無名指感覺比較的尺神經刺激')], sourceLocator: 'Ch. 10, Fig. 10.10；p. 122 內部比較表',
  },
  {
    id: 'median-radial-digit1', title: '正中－橈神經 D1 感覺比較', englishTitle: 'Median–radial digit 1 sensory comparison',
    nerve: '正中神經與橈神經（Median vs radial）', region: 'upper', modality: 'comparison', priority: 'common',
    recording: montage('拇指（digit 1，共用環狀電極）', '拇指掌指關節。', '遠端指間關節，與 G1 相距 3–4 cm。'),
    cathode: '兩次刺激皆一般朝向 G1；維持相同距離。', position: '前臂旋後、拇指放鬆，兩次刺激不移動環狀電極。',
    stimulations: [
      { label: '正中神經', site: '標準正中神經腕部刺激點。', distance: '10–12 cm，兩者相同' },
      { label: '橈神經', site: '遠端前臂橈骨上方的 superficial radial nerve。', distance: '10–12 cm，兩者相同' },
    ],
    normalValues: ['兩者 peak latency 差 <0.5 ms；差值 ≥0.5 ms 為顯著。'],
    notes: ['同一組拇指記錄電極可降低個體差異。', '電流過大時需警覺鄰近神經共同刺激。'],
    images: [image('10-11-a', '正中神經刺激', '拇指感覺比較的正中神經刺激'), image('10-11-b', '橈神經刺激', '拇指感覺比較的橈神經刺激')], sourceLocator: 'Ch. 10, Fig. 10.11；p. 122 內部比較表',
  },
  {
    id: 'median-ulnar-palmar-mixed', title: '正中－尺神經掌部混合比較', englishTitle: 'Median–ulnar palmar mixed comparison',
    nerve: '正中神經與尺神經（Median vs ulnar）', region: 'upper', modality: 'comparison', priority: 'common',
    recording: montage('腕部 mixed nerve response', '各神經腕部表面：正中位於腕中央略偏橈；尺神經位於 FCU 旁。', '各自位於 G1 近端 3–4 cm。'),
    cathode: '掌部刺激時陰極朝向腕部 G1；避免共同刺激。', position: '前臂旋後、手掌朝上，掌部與腕部平放。',
    stimulations: [
      { label: '正中掌部', site: '沿食指與中指指蹼方向的掌部。', distance: '至腕部 G1 8 cm' },
      { label: '尺側掌部', site: '沿無名指與小指指蹼方向的掌部。', distance: '至腕部 G1 8 cm' },
    ],
    normalValues: ['Median mixed：≥50 μV、CV ≥50 m/s、peak latency ≤2.2 ms（8 cm）', 'Ulnar mixed：≥12 μV、CV ≥50 m/s、peak latency ≤2.2 ms（8 cm）', '兩者 latency 差 ≥0.4 ms 為顯著。'],
    notes: ['8 cm 必須精確量測，兩條神經使用相同距離。', '若正中反應較慢可支持 CTS；若尺神經較慢則考慮 Guyon canal 病灶。'],
    images: [image('10-12-a', '正中神經掌部刺激', '正中神經掌部混合研究'), image('10-12-b', '尺神經掌部刺激', '尺神經掌部混合研究')], sourceLocator: 'Ch. 10, Fig. 10.12；p. 122 成人正常值與比較表',
  },
  {
    id: 'radial-motor-eip', title: '橈神經運動傳導（EIP）', englishTitle: 'Radial motor study — EIP',
    nerve: '橈神經（Radial nerve）', region: 'upper', modality: 'motor', priority: 'supplemental',
    recording: montage('食指固有伸肌（extensor indicis proprius, EIP）', '尺骨莖突近端約兩指幅。', '尺骨莖突。'),
    cathode: '一般朝向 G1；近端位置較深，需逐步確認 supramaximal。', position: '前臂旋前、手背朝上；量近端距離時使用產科卡尺。',
    stimulations: [
      { label: '遠端前臂', site: '尺骨上方、G1 近端。', distance: '4–6 cm（技術段落亦列 5–7 cm）' },
      { label: '肘部', site: '肱二頭肌與肱橈肌之間的溝。' },
      { label: '螺旋溝下', site: '上臂中段外側、肱二頭肌與肱三頭肌之間。' },
      { label: '螺旋溝上', site: '近端肱骨後側。' },
    ],
    normalValues: ['CMAP ≥2.0 mV', '傳導速度 ≥49 m/s', '遠端潛時 ≤2.9 ms（4–6 cm）'],
    notes: ['CMAP 常有 initial positive deflection。', '螺旋溝上刺激技術較困難；表面距離不準時需用卡尺。'],
    images: [image('10-13-a', '遠端前臂刺激', '橈神經運動傳導遠端刺激'), image('10-13-b', '肘部刺激', '橈神經肘部刺激'), image('10-13-c', '螺旋溝下刺激', '橈神經螺旋溝下刺激'), image('10-13-d', '螺旋溝上刺激', '橈神經螺旋溝上刺激')], sourceLocator: 'Ch. 10, Fig. 10.13；p. 122 成人正常值表',
  },
  {
    id: 'radial-sensory', title: '橈神經表淺支感覺傳導', englishTitle: 'Superficial radial sensory study',
    nerve: '橈神經表淺支（Superficial radial nerve）', region: 'upper', modality: 'sensory', priority: 'common',
    recording: montage('解剖鼻煙窩／拇指伸肌腱上方', '神經跨過拇長伸肌腱、走向拇指處。', '沿拇指方向遠端 3–4 cm。'),
    cathode: '一般朝向 G1。', position: '前臂旋前、手背朝上；伸展拇指可幫助定位 EPL tendon。',
    stimulations: [{ label: '遠端至中段前臂', site: '橈骨上方的 superficial radial nerve。', distance: '10 cm' }],
    normalValues: ['SNAP ≥15 μV', '傳導速度 ≥50 m/s', 'peak latency ≤2.9 ms（10 cm）'],
    notes: ['可用於橈神經與臂神經叢病灶；後骨間神經病變時應保留。', '側對側比較常有幫助。'],
    images: [image('10-14', '橈骨上方刺激、鼻煙窩記錄', '橈神經表淺支感覺研究')], sourceLocator: 'Ch. 10, Fig. 10.14；p. 122 成人正常值表',
  },
  {
    id: 'mabc-sensory', title: '內側前臂皮神經感覺傳導', englishTitle: 'Medial antebrachial cutaneous sensory study',
    nerve: '內側前臂皮神經（Medial antebrachial cutaneous nerve）', region: 'upper', modality: 'sensory', priority: 'supplemental',
    recording: montage('前臂內側', '沿刺激點至尺側腕連線、刺激點遠端 12 cm。', '沿同一路徑遠端 3–4 cm。'),
    cathode: '一般朝向 G1；神經表淺，通常 5–15 mA 即可。', position: '前臂旋後、肘略伸展並充分放鬆。',
    stimulations: [{ label: '內側肘部', site: '肱二頭肌肌腱與內上髁的中點。', distance: '12 cm' }],
    normalValues: ['SNAP ≥5 μV', '傳導速度 ≥50 m/s', 'peak latency ≤3.2 ms（12 cm）'],
    notes: ['可反映下幹或內側束病灶；真性 neurogenic thoracic outlet syndrome 常低或消失。', '移動記錄電極並做側對側比較，通常比單一正常值更可靠。'],
    images: [image('10-15', '內側肘刺激、前臂內側記錄', '內側前臂皮神經感覺研究')], sourceLocator: 'Ch. 10, Fig. 10.15；p. 122 成人正常值表',
  },
  {
    id: 'labc-sensory', title: '外側前臂皮神經感覺傳導', englishTitle: 'Lateral antebrachial cutaneous sensory study',
    nerve: '外側前臂皮神經（Lateral antebrachial cutaneous nerve）', region: 'upper', modality: 'sensory', priority: 'supplemental',
    recording: montage('前臂外側', '沿刺激點至橈側腕連線、刺激點遠端 12 cm。', '沿同一路徑遠端 3–4 cm。'),
    cathode: '一般朝向 G1；神經表淺，通常 5–15 mA 即可。', position: '前臂旋後、肘略伸展並充分放鬆。',
    stimulations: [{ label: '肘窩', site: '肱二頭肌肌腱稍外側。', distance: '12 cm' }],
    normalValues: ['SNAP ≥10 μV', '傳導速度 ≥55 m/s', 'peak latency ≤3.0 ms（12 cm）'],
    notes: ['電流過大可能直接刺激肱二頭肌。', '可用於 musculocutaneous nerve、外側束或上幹病灶；建議側對側比較。'],
    images: [image('10-16', '肘窩外側刺激、前臂外側記錄', '外側前臂皮神經感覺研究')], sourceLocator: 'Ch. 10, Fig. 10.16；p. 122 成人正常值表',
  },
  {
    id: 'upper-proximal-stimulation', title: '上肢近端刺激（Erb’s point／神經根）', englishTitle: 'Upper-extremity proximal stimulation',
    nerve: '臂神經叢／頸神經根（Brachial plexus / cervical roots）', region: 'upper', modality: 'motor', priority: 'supplemental',
    recording: montage('依目標選定近端肌肉', '肌腹；亦可用 monopolar needle 作 G1。', '肌腱；needle montage 時以表面 disc electrode 作 G2。'),
    cathode: 'Erb’s point 使用表面 cathode；神經根刺激以插至椎板的 monopolar needle 作 cathode。', position: '坐姿或仰臥，頸部與肩帶放鬆；需固定姿勢以利側對側比較。',
    stimulations: [
      { label: 'Erb’s point', site: '鎖骨上窩、鎖骨後方、胸鎖乳突肌後緣。' },
      { label: '頸神經根', site: '目標節段棘突外側 1–2 cm 的旁脊肌內，進針至椎板；表面陽極置棘突上。' },
    ],
    normalValues: ['Erb’s point：Axillary–deltoid ≤4.9 ms（15–21 cm）', 'Musculocutaneous–biceps ≤5.7 ms（23–29 cm）', 'Suprascapular–supraspinatus ≤3.7 ms；infraspinatus ≤4.3 ms'],
    notes: ['兩處都可能難以達到 supramaximal；近端距離以產科卡尺較準。', '神經根刺激過於外側有氣胸風險，僅限熟悉解剖與技術者執行。'],
    images: [image('10-17-a', 'Erb’s point 表面刺激', 'Erb’s point 刺激並記錄近端肌肉'), image('10-17-b', '頸神經根針刺激', '頸神經根近端針刺激')], sourceLocator: 'Ch. 10, Fig. 10.17；p. 123 近端運動潛時表',
  },
  {
    id: 'phrenic-motor', title: '膈神經運動傳導', englishTitle: 'Phrenic motor study',
    nerve: '膈神經（Phrenic nerve）', region: 'cranial-respiratory', modality: 'motor', priority: 'supplemental',
    recording: montage('膈肌（Diaphragm）', '劍突上方兩指幅，約 5 cm。', '前側肋緣，與 G1 相距 16 cm。', '置於胸壁，介於頸部刺激器與膈肌記錄電極之間。'),
    cathode: '依選用頸部位置朝向 G1；刺激器需施加穩定壓力。', position: '仰臥，記錄時註明吸氣或呼氣相位。',
    stimulations: [
      { label: '方案 A', site: '胸鎖乳突肌後方、鎖骨上約 3 cm。' },
      { label: '方案 B', site: '胸鎖乳突肌胸骨頭與鎖骨頭之間、鎖骨正上方。' },
    ],
    normalValues: ['簡表：振幅 597 ± 139 μV，>320 μV；潛時 6.3 ± 0.8 ms，<8.0 ms', '吸氣時 onset latency 6.55 ± 0.69 ms、amplitude 1.00 ± 0.27 mV；呼氣時 6.59 ± 0.67 ms、0.71 ± 0.19 mV'],
    notes: ['避免誤刺激副神經或臂神經叢；肥胖者較困難。', '外接式心律調節器患者不可在 ICU 執行；附近有頸內靜脈導管、植入式節律器或 ICD 時需審慎評估。'],
    images: [image('10-18-a', '胸鎖乳突肌後方刺激', '膈神經刺激方案 A'), image('10-18-b', '胸鎖乳突肌兩頭之間刺激', '膈神經刺激方案 B')], sourceLocator: 'Ch. 10, Fig. 10.18；p. 123 膈神經正常值表',
  },
  {
    id: 'facial-motor', title: '顏面神經運動傳導', englishTitle: 'Facial motor study — nasalis',
    nerve: '顏面神經（Facial nerve, CN VII）', region: 'cranial-respiratory', modality: 'motor', priority: 'supplemental',
    recording: montage('鼻肌（Nasalis）', '鼻中段外側。', '對側鼻部相同位置。', '置於臉部或肩頸的不干擾位置，介於刺激與記錄電極之間；雙側保持一致。'),
    cathode: '朝向記錄側；避免過大電流直接刺激 masseter。', position: '仰臥、臉部放鬆，左右側採相同姿勢。',
    stimulations: [{ label: '耳屏前', site: '下耳前方、顏面神經離開 stylomastoid foramen 後的路徑。', distance: '不固定' }],
    normalValues: ['Nasalis CMAP ≥1.0 mV', 'distal latency ≤4.2 ms'],
    notes: ['整條顏面神經刺激通常較不舒服，也比個別分支刺激需要更高電流。', '建議雙側檢查，以健側作控制。'],
    images: [image('10-19', '耳屏前刺激、鼻肌記錄', '顏面神經運動傳導')], sourceLocator: 'Ch. 10, Fig. 10.19；p. 123 craniobulbar 正常值表',
  },
  {
    id: 'facial-motor-branches', title: '顏面神經分支運動傳導', englishTitle: 'Facial motor branch studies',
    nerve: '顏面神經 frontal／zygomatic／mandibular branches', region: 'cranial-respiratory', modality: 'motor', priority: 'supplemental',
    recording: montage('依分支記錄 frontalis、nasalis 或 mentalis', '目標肌肉中央。', '對側相同肌肉位置。', '置於臉部或肩頸的不干擾位置，介於刺激與記錄電極之間；雙側保持一致。'),
    cathode: '朝向記錄肌；使用能產生最大且穩定 CMAP 的最低有效電流。', position: '仰臥、臉部完全放鬆；左右側配置對稱。',
    stimulations: [
      { label: 'Frontal branch', site: '眼外側 3–4 指幅；記錄 frontalis。' },
      { label: 'Zygomatic branch', site: '耳前顴骨上方；記錄 nasalis。' },
      { label: 'Mandibular branch', site: '下顎角；記錄 mentalis。' },
    ],
    normalValues: ['個別分支以雙側潛時與振幅比較為主；全神經 nasalis 參考值為 ≥1.0 mV、≤4.2 ms。'],
    notes: ['分支刺激通常比 stylomastoid foramen 整體刺激更容易且舒適。', '務必雙側檢查，將預期正常側作內部控制。'],
    images: [image('10-20-a', 'Frontal branch', '顏面神經 frontal branch 刺激'), image('10-20-b', 'Zygomatic branch', '顏面神經 zygomatic branch 刺激'), image('10-20-c', 'Mandibular branch', '顏面神經 mandibular branch 刺激')], sourceLocator: 'Ch. 10, Fig. 10.20',
  },
  {
    id: 'blink-reflex', title: '眨眼反射', englishTitle: 'Blink reflex — trigeminal and facial nerves',
    nerve: '三叉神經 V1 傳入／顏面神經傳出（CN V–VII）', region: 'cranial-respiratory', modality: 'reflex', priority: 'supplemental',
    recording: montage('雙側眼輪匝肌（orbicularis oculi）', '每側下眼眶處，瞳孔正中位的外下方。', '每側外眼角。', '額部或兩組記錄電極間的適當位置，避開刺激器與導線交疊。'),
    cathode: '置於 supraorbital notch 上；通常 10–15 mA 即可 supramaximal。', position: '仰臥並放鬆；雙眼睜開或輕閉。',
    stimulations: [{ label: '眶上切跡', site: '上眼眶內側、眉毛內側的 supraorbital notch。', distance: '不固定；左右分別刺激' }],
    normalValues: ['R1 ipsilateral ≤13 ms，左右差 ≤1.2 ms', 'R2 ipsilateral ≤41 ms，左右差 ≤5 ms', 'R2 contralateral ≤44 ms，左右差 ≤7 ms'],
    notes: ['每側刺激都同時記錄 ipsilateral 與 contralateral；疊加 2–5 次 trace 取最短 R1／R2。', '可協助評估顏面神經麻痺、脫髓鞘性神經病變與腦幹病灶。'],
    images: [image('10-21', '眶上神經刺激、雙側眼輪匝肌記錄', '眨眼反射電極與刺激位置')], sourceLocator: 'Ch. 10, Fig. 10.21；p. 123 blink reflex 正常值表',
  },
  {
    id: 'tibial-motor-ahb', title: '脛神經運動傳導（AHB）', englishTitle: 'Tibial motor study — AHB',
    nerve: '脛神經（Tibial nerve）', region: 'lower', modality: 'motor', priority: 'common',
    recording: montage('拇趾展肌（abductor hallucis brevis, AHB）', '舟狀骨隆起近端 1 cm、下方 1 cm。', '大拇趾蹠趾關節。'),
    cathode: '一般朝向 G1；膕窩常需較高電流以達 supramaximal。', position: '仰臥或側臥，膝微屈、足部放鬆；膕窩刺激時讓後膝可接近。',
    stimulations: [
      { label: '內踝', site: '內踝稍近端與後方。', distance: '至 G1 9 cm' },
      { label: '膕窩', site: '後膝中央、膕動脈搏動處。' },
    ],
    normalValues: ['CMAP ≥4.0 mV', '傳導速度 ≥41 m/s', '遠端潛時 ≤5.8 ms（9 cm）'],
    notes: ['近端 CMAP 可比踝部低，正常甚至可下降 50%；勿輕率判為 conduction block。', 'CMAP 有 initial positive deflection 時，先微調 G1 至 motor point。'],
    images: [image('11-01-a', '內踝刺激', '脛神經內踝刺激並記錄 AHB'), image('11-01-b', '膕窩刺激', '脛神經膕窩刺激')], sourceLocator: 'Ch. 11, Fig. 11.1；p. 133 成人正常值表',
  },
  {
    id: 'peroneal-motor-edb', title: '腓總神經運動傳導（EDB）', englishTitle: 'Fibular (peroneal) motor study — EDB',
    nerve: '腓總神經（Common fibular / peroneal nerve）', region: 'lower', modality: 'motor', priority: 'common',
    recording: montage('趾短伸肌（extensor digitorum brevis, EDB）', '足背外側 EDB 肌腹。', '小趾蹠趾關節。'),
    cathode: '一般朝向 G1；腓骨頭下神經較深，常需較高電流；膕窩外側避免共同刺激脛神經。', position: '仰臥，腿與足部中立放鬆；完整暴露腓骨頭及外側膕窩。',
    stimulations: [
      { label: '踝部', site: '前踝、脛前肌腱稍外側。', distance: '至 G1 9 cm' },
      { label: '腓骨頭下', site: '外側小腿、腓骨頭下方 1–2 指幅，可讓刺激器跨腓骨頸。' },
      { label: '腓骨頸上', site: '外側膕窩、外側 hamstring tendon 旁。', distance: '與腓骨頭下相距 10–12 cm' },
    ],
    normalValues: ['CMAP ≥2.0 mV', '傳導速度 ≥44 m/s', '遠端潛時 ≤6.5 ms（9 cm）'],
    notes: ['踝、腓骨頭下與腓骨頸上三處都應完成，避免漏掉跨腓骨頸 focal slowing。', '近端振幅高於踝部時考慮 accessory fibular nerve。'],
    images: [image('11-02-a', '踝部刺激', '腓總神經踝部刺激並記錄 EDB'), image('11-02-b', '腓骨頭下刺激', '腓總神經腓骨頭下刺激'), image('11-02-c', '腓骨頸上刺激', '腓總神經外側膕窩刺激')], sourceLocator: 'Ch. 11, Fig. 11.2；p. 133 成人正常值表', searchTerms: ['fibular'],
  },
  {
    id: 'peroneal-motor-ta', title: '腓總神經運動傳導（TA）', englishTitle: 'Fibular (peroneal) motor study — TA',
    nerve: '腓總神經深支（Deep fibular / peroneal nerve）', region: 'lower', modality: 'motor', priority: 'common',
    recording: montage('脛前肌（tibialis anterior, TA）', '前外側小腿近端至中段的 TA 肌腹。', '遠端前踝。'),
    cathode: '一般朝向 G1；腓骨頭下常需較高電流，膕窩外側避免共同刺激脛神經。', position: '仰臥，膝微屈、足部放鬆；必要時讓個案短暫背屈以確認 TA 肌腹後再放鬆。',
    stimulations: [
      { label: '腓骨頭下', site: '外側小腿、腓骨頭下方 1–2 指幅。', distance: '至 G1 5–10 cm' },
      { label: '腓骨頸上', site: '外側膕窩、外側 hamstring tendon 旁。', distance: '與腓骨頭下相距 10–12 cm' },
    ],
    normalValues: ['CMAP ≥3.0 mV', '傳導速度 ≥44 m/s', '遠端潛時 ≤6.7 ms（5–10 cm）'],
    notes: ['疑似腓骨頸病變時，TA 記錄常比 EDB 更容易顯示 conduction block 或 focal slowing。', '遠端距離可變，報告必須保留實測值。'],
    images: [image('11-03-a', '腓骨頭下刺激', '記錄 TA 的腓總神經腓骨頭下刺激'), image('11-03-b', '腓骨頸上刺激', '記錄 TA 的腓總神經膕窩外側刺激')], sourceLocator: 'Ch. 11, Fig. 11.3；p. 133 成人正常值表', searchTerms: ['fibular'],
  },
  {
    id: 'femoral-motor', title: '股神經運動傳導', englishTitle: 'Femoral motor study — rectus femoris',
    nerve: '股神經（Femoral nerve）', region: 'lower', modality: 'motor', priority: 'supplemental',
    recording: montage('股直肌（rectus femoris）', '腹股溝皺褶與膝之間的前大腿中點。', '膝部骨性隆起。'),
    cathode: '朝向 G1；刺激器需穩定加壓，肥胖者常需 >50 mA。', position: '仰臥、髖與膝伸展放鬆，完整暴露腹股溝。',
    stimulations: [{ label: '腹股溝', site: '腹股溝韌帶下方、股動脈搏動稍外側。', distance: '不固定' }],
    normalValues: ['CMAP >3 mV；單側症狀時以側對側振幅比較較實用。'],
    notes: ['主要用於股神經病變、腰神經叢病變與嚴重 L4 radiculopathy 的軸突損失量化。', '肥胖者技術困難，需避免把 submaximal response 當成軸突損失。'],
    images: [image('11-04', '腹股溝刺激、股直肌記錄', '股神經運動傳導')], sourceLocator: 'Ch. 11, Fig. 11.4',
  },
  {
    id: 'superficial-peroneal-sensory', title: '腓淺神經感覺傳導', englishTitle: 'Superficial fibular (peroneal) sensory study',
    nerve: '腓淺神經（Superficial fibular / peroneal nerve）', region: 'lower', modality: 'sensory', priority: 'common',
    recording: montage('外側踝前方', '脛前肌腱與外踝之間。', '沿足背方向遠端 3–4 cm。'),
    cathode: '一般朝向 G1；神經表淺時多以 5–25 mA 即可。', position: '仰臥、腿與足部放鬆，踝部保持中立。',
    stimulations: [{ label: '外側小腿', site: '趾長伸肌與腓骨長／短肌之間的溝。', distance: '標準 14 cm；可改 10–12 cm，必要時 7–9 cm' }],
    normalValues: ['SNAP ≥6 μV', '傳導速度 ≥40 m/s', 'peak latency ≤4.4 ms（僅適用標準 14 cm）'],
    notes: ['縮短距離後應以 onset latency 計算 CV，不可套用 14 cm peak latency 上限。', '神經分支有變異；篩檢下肢 polyneuropathy 時 sural 通常較可靠。'],
    images: [image('11-05', '外側小腿刺激、外踝記錄', '腓淺神經感覺傳導')], sourceLocator: 'Ch. 11, Fig. 11.5；p. 133 成人正常值表', searchTerms: ['fibular'],
  },
  {
    id: 'sural-sensory', title: '腓腸神經感覺傳導', englishTitle: 'Sural sensory study',
    nerve: '腓腸神經（Sural nerve）', region: 'lower', modality: 'sensory', priority: 'common',
    recording: montage('外踝後方', '外踝後方。', '沿足外側方向遠端 3–4 cm。'),
    cathode: '一般朝向 G1；多以 5–25 mA 即可達 supramaximal。', position: '以側臥最佳，記錄側朝上；腿與踝放鬆。',
    stimulations: [{ label: '後外側小腿', site: '沿腓腸神經路徑、外踝後方近端。', distance: '標準 14 cm；可改 10–12 cm 或 7–9 cm' }],
    normalValues: ['SNAP ≥6 μV', '傳導速度 ≥40 m/s', 'peak latency ≤4.4 ms（僅適用標準 14 cm）'],
    notes: ['縮短距離取得反應時，以 onset latency 與實測距離計算 CV。', '記錄電極可略向內或向外移；單側症狀時側對側比較很有用。'],
    images: [image('11-06', '後外側小腿刺激、外踝後方記錄', '腓腸神經感覺傳導')], sourceLocator: 'Ch. 11, Fig. 11.6；p. 133 成人正常值表',
  },
  {
    id: 'saphenous-sensory', title: '隱神經感覺傳導', englishTitle: 'Saphenous sensory study',
    nerve: '隱神經（Saphenous nerve）', region: 'lower', modality: 'sensory', priority: 'supplemental',
    recording: montage('前內側踝', '內踝與脛前肌腱之間。', '沿足部方向遠端 3–4 cm。'),
    cathode: '一般朝向 G1；多以低至中等電流逐步尋找最佳位置。', position: '仰臥、腿部外旋或適度調整，使內側小腿與踝部可接近。',
    stimulations: [{ label: '內側小腿', site: '脛骨與腓腸肌內側頭之間的溝。', distance: '標準 14 cm；可改 10–12 cm' }],
    normalValues: ['SNAP ≥4 μV', '傳導速度 ≥40 m/s', 'peak latency ≤4.4 ms（14 cm）'],
    notes: ['>40 歲正常者反應可能很小或消失；不可只因低或無反應就判異常。', '單側症狀時必須做側對側比較；縮短距離後改用 CV 判讀。'],
    images: [image('11-07', '內側小腿刺激、前內踝記錄', '隱神經感覺傳導')], sourceLocator: 'Ch. 11, Fig. 11.7；p. 133 成人正常值表',
  },
  {
    id: 'lateral-femoral-cutaneous', title: '股外側皮神經感覺傳導', englishTitle: 'Lateral femoral cutaneous sensory study',
    nerve: '股外側皮神經（Lateral cutaneous nerve of thigh）', region: 'lower', modality: 'sensory', priority: 'supplemental',
    recording: montage('大腿前側', '沿 ASIS 至髕骨外側連線，刺激點遠端 12 cm；替代點可再向內 2 cm。', '沿同一路徑遠端 3–4 cm。'),
    cathode: '一般朝向 G1；刺激器需穩定加壓，肥胖者可能需要較高電流。', position: '仰臥、髖伸展且大腿放鬆，完整暴露 ASIS 與腹股溝。',
    stimulations: [{ label: '腹股溝', site: '腹股溝韌帶上方、ASIS 內側 1 cm。', distance: '標準 12 cm；可改 10 cm' }],
    normalValues: ['SNAP ≥4 μV', 'peak latency ≤2.6 ms（12 cm）'],
    notes: ['解剖變異大，無反應時先向外、再向內移動刺激點與記錄點。', '>40 歲或肥胖者正常亦可能低或無反應；單側症狀時需側對側比較。'],
    images: [image('11-08', 'ASIS 內側刺激、大腿前側記錄', '股外側皮神經感覺傳導')], sourceLocator: 'Ch. 11, Fig. 11.8；p. 133 成人正常值表',
  },
  {
    id: 'plantar-motor', title: '內／外側足底神經運動傳導', englishTitle: 'Medial and lateral plantar motor studies',
    nerve: '脛神經內、外側足底支（Medial / lateral plantar nerves）', region: 'lower', modality: 'motor', priority: 'supplemental',
    recording: montage('AHB 或小趾展肌（abductor digiti quinti pedis, ADQP）', 'AHB：舟狀骨隆起近端與下方各 1 cm；ADQP：外側足底與外踝下緣中點。', 'AHB 至大拇趾 MTP；ADQP 至小趾 MTP。'),
    cathode: '一般朝向 G1。', position: '仰臥或側臥，足部放鬆並暴露內踝與足內／外側。',
    stimulations: [{ label: '內踝', site: '內踝稍近端與後方。', distance: 'AHB 9 cm；ADQP 以產科卡尺量測' }],
    normalValues: ['AHB：CMAP ≥4.0 mV、CV ≥41 m/s、DML ≤5.8 ms（9 cm）', 'ADQP：CMAP ≥3.0 mV、CV ≥41 m/s、DML ≤6.3 ms（距離可變）'],
    notes: ['可用於 tarsal tunnel syndrome；側對側振幅與潛時比較必要。', 'CMAP 有 initial positive deflection 時先調整 G1 至 motor point。'],
    images: [image('11-09-a', '內側足底支／AHB', '內側足底神經運動傳導'), image('11-09-b', '外側足底支／ADQP', '外側足底神經運動傳導')], sourceLocator: 'Ch. 11, Fig. 11.9；p. 133 成人正常值表',
  },
  {
    id: 'plantar-sensory', title: '內／外側足底神經感覺傳導', englishTitle: 'Medial and lateral plantar sensory studies',
    nerve: '內、外側足底神經（Medial / lateral plantar nerves）', region: 'lower', modality: 'sensory', priority: 'supplemental',
    recording: montage('內踝脛神經', '內踝稍近端與後方。', '沿脛神經近端 3–4 cm。'),
    cathode: '足趾環狀刺激的 cathode 置近端 MTP 附近，anode 置遠端。', position: '仰臥或側臥，足底與足趾放鬆。',
    stimulations: [
      { label: '內側足底', site: '大拇趾，以環狀電極刺激。', distance: '可變，記錄實測值' },
      { label: '外側足底', site: '小趾，以環狀電極刺激。', distance: '可變，記錄實測值' },
    ],
    normalValues: ['Medial plantar SNAP ≥2 μV、CV ≥35 m/s', 'Lateral plantar SNAP ≥1 μV、CV ≥35 m/s'],
    notes: ['此處為 orthodromic；antidromic 時位置對調。', '正常反應也可能極小，常需 averaging；>40 歲時低或消失尤其常見，必須側對側比較。'],
    images: [image('11-10-a', '大拇趾刺激', '內側足底神經感覺傳導'), image('11-10-b', '小趾刺激', '外側足底神經感覺傳導')], sourceLocator: 'Ch. 11, Fig. 11.10；p. 133 成人正常值表',
  },
  {
    id: 'plantar-mixed', title: '內／外側足底神經混合傳導', englishTitle: 'Medial and lateral plantar mixed studies',
    nerve: '內、外側足底神經（Medial / lateral plantar nerves）', region: 'lower', modality: 'mixed', priority: 'supplemental',
    recording: montage('內踝脛神經 mixed response', '內踝稍近端與後方。', '沿脛神經近端 3–4 cm。'),
    cathode: '置於足底刺激點並朝向內踝 G1。', position: '仰臥或側臥，足底放鬆並保持兩側量測路徑一致。',
    stimulations: [
      { label: '內側足底', site: '由記錄點向足底 7 cm，再沿第 1、2 趾指蹼方向 7 cm。', distance: '14 cm' },
      { label: '外側足底', site: '由記錄點向足底 7 cm，再沿第 4、5 趾指蹼方向 7 cm。', distance: '14 cm' },
    ],
    normalValues: ['兩支振幅皆 ≥3 μV', '傳導速度 ≥45 m/s', 'peak latency ≤3.7 ms（14 cm）'],
    notes: ['比 orthodromic plantar sensory 容易，是評估 distal tibial neuropathy／tarsal tunnel 的首選足底研究。', '反應可能很小，常需 averaging；需側對側比較。'],
    images: [image('11-11-a', '內側足底刺激', '內側足底神經混合傳導'), image('11-11-b', '外側足底刺激', '外側足底神經混合傳導')], sourceLocator: 'Ch. 11, Fig. 11.11；p. 133 成人正常值表',
  },
  {
    id: 'f-wave', title: 'F-wave', englishTitle: 'F response',
    nerve: '任何可作運動傳導的神經；常用 median、ulnar、fibular、tibial', region: 'late-response', modality: 'late-response', priority: 'common',
    recording: montage('沿用該神經的標準 distal motor montage', '沿用目標肌的 motor point。', '沿用標準 tendon／bony reference。'),
    cathode: '刺激器反轉，cathode 置近端，降低理論上的 anodal block。', position: '沿用例行運動傳導姿勢；個案放鬆、清醒，避免太快刺激。',
    stimulations: [{ label: '遠端刺激', site: '沿用例行 motor study 的遠端刺激點，必須 supramaximal。', distance: '刺激頻率 ≤0.5 Hz；至少 10 次，最好 rastered' }],
    normalValues: ['Minimal F latency：median ≤31 ms、ulnar ≤32 ms、fibular ≤56 ms、tibial ≤56 ms', 'Chronodispersion：上肢 <4 ms、下肢 <6 ms', 'Persistence >50%；一般正常約 80–100%'],
    notes: ['增益約 200 μV、sweep 5 或 10 ms。', '身高、肢長、distal motor latency 與整段 CV 都會影響；高矮個案應校正或使用 F estimate。', '正常人 fibular F-wave、睡眠或鎮靜患者的 F-wave 可 absent／impersistent。'],
    images: [image('04-05', '以正中神經為例的 F-wave 配置', 'F-wave 的正中神經遠端刺激與 APB 記錄')], sourceLocator: 'Ch. 4, Fig. 4.5；Ch. 10–11 成人正常值表',
  },
  {
    id: 'soleus-h-reflex', title: '比目魚肌 H-reflex', englishTitle: 'Soleus H reflex',
    nerve: '脛神經 Ia 傳入／運動傳出（主要評估 S1 pathway）', region: 'lower', modality: 'reflex', priority: 'common',
    recording: montage('比目魚肌（Soleus）', '腓腸肌兩肌腹會合處遠端 1–2 指幅的後側小腿。', 'Achilles tendon。'),
    cathode: '膕窩中央刺激，cathode 明確朝頭側（rostral）。', position: '俯臥或讓後膝可接近且小腿完全放鬆；兩側姿勢與距離相同。',
    stimulations: [{ label: '膕窩', site: '後膝中央、膕動脈搏動處。', distance: '通常 20–25 cm；兩側必須相同' }],
    normalValues: ['Minimal H latency ≤34 ms', '左右潛時差 >1.5 ms 為異常', '典型 H latency 約 25–34 ms；H/M ratio ≤50%'],
    notes: ['pulse duration 設 1000 μs（1 ms），以低強度逐步增加；H 先出現，M 增大時 H 會下降。', '身高與腿長需納入判讀；可受 polyneuropathy、tibial／sciatic neuropathy、plexopathy 或 S1 radiculopathy 影響。'],
    images: [image('11-12', '膕窩刺激、比目魚肌記錄', '比目魚肌 H-reflex 電極與刺激位置')], sourceLocator: 'Ch. 11, Fig. 11.12；Ch. 4 與 p. 133 晚期反應正常值表',
  },
]

export const commonNcvStudies = ncvStudies.filter((study) => study.priority === 'common')
export const supplementalNcvStudies = ncvStudies.filter((study) => study.priority === 'supplemental')
