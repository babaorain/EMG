import { supplementalNeedleGuideInputs } from './supplementalNeedleGuides'

export interface NeedleGuideImage {
  src: string
  alt: string
  caption: string
}

export interface NeedleGuideSource {
  label: string
  url: string
}

export interface NeedleGuide {
  id: string
  chineseName: string
  englishName: string
  catalogNames: string[]
  figures: number[]
  images: NeedleGuideImage[]
  innervation: string
  insertion: string
  activation: string
  clinicalPoints: string[]
  anatomyPoints: string[]
  sourceKind: 'textbook' | 'supplemental'
  sources: NeedleGuideSource[]
}

interface GuideInput extends Omit<NeedleGuide, 'id' | 'images' | 'sourceKind' | 'sources'> {}

export const needleGuideEvidenceSources: NeedleGuideSource[] = [
  {
    label: 'Nayak et al. — A systematic approach to needle EMG examination',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6921208/',
  },
  {
    label: 'AANEM — Risks in Electrodiagnostic Medicine',
    url: 'https://www.aanem.org/docs/default-source/documents/aanem/practice/risksinedx.pdf?sfvrsn=a112b935_0',
  },
  {
    label: 'AAPM&R KnowledgeNow — Electrodiagnosis of Radiculopathies',
    url: 'https://now.aapmr.org/electrodiagnosis-of-radiculopathies-cervical-thoracic-and-lumbar/',
  },
]

function imageSources(figures: number[]): Array<{ figure: number; src: string; panel?: string }> {
  return figures.flatMap((figure) => {
    if (figure === 55) {
      return [
        { figure, src: '/needle-guides/fig-13-55-ab.jpg', panel: 'A-B' },
        { figure, src: '/needle-guides/fig-13-55-c.jpg', panel: 'C' },
      ]
    }
    return [{
      figure,
      src: `/needle-guides/fig-13-${String(figure).padStart(2, '0')}.jpg`,
    }]
  })
}

function defineGuide(input: GuideInput): NeedleGuide {
  return {
    ...input,
    id: `chapter-13-figure-${input.figures.join('-')}`,
    sourceKind: 'textbook',
    sources: needleGuideEvidenceSources,
    images: imageSources(input.figures).map(({ figure, src, panel }) => ({
      src,
      alt: `${input.chineseName}（${input.englishName}）扎針位置與橫切面`,
      caption: `第 13.${figure} 圖${panel ? `，圖版 ${panel}` : ''}`,
    })),
  }
}

export const needleGuides: NeedleGuide[] = [
  ...supplementalNeedleGuideInputs.map((guide): NeedleGuide => ({
    ...guide,
    figures: [],
    images: [],
    sourceKind: 'supplemental',
    sources: needleGuideEvidenceSources,
  })),
  defineGuide({
    chineseName: '拇短展肌', englishName: 'Abductor Pollicis Brevis (APB)',
    catalogNames: ['Abd. Pollicis Brevis'], figures: [1],
    innervation: '正中神經（median nerve）、內側索（medial cord）、下幹（lower trunk），C8-T1。',
    insertion: '前臂與手掌旋後；針沿切線進入外側魚際隆起，位置在第一掌骨中點稍外側。',
    activation: '請病人外展拇指。',
    clinicalPoints: ['腕隧道遠端最適合取樣的正中神經支配肌。', '腕隧道症候群、近端正中神經病變、下幹／內側索神經叢病變、胸廓出口症候群、C8-T1 神經根病變及遠端多發性神經病變時可異常。', '前骨間神經症候群通常不受影響。', '相較其他手內在肌，取樣常較疼痛。'],
    anatomyPoints: ['針位太內側可能進入同時受正中與尺神經支配的拇短屈肌（flexor pollicis brevis）。', '針位太深可能進入同受正中神經支配的拇對掌肌（opponens pollicis）。'],
  }),
  defineGuide({
    chineseName: '拇對掌肌', englishName: 'Opponens Pollicis (OP)',
    catalogNames: ['Opponens Pollicis'], figures: [2],
    innervation: '正中神經（median nerve）、內側索（medial cord）、下幹（lower trunk），C8-T1。',
    insertion: '前臂與手掌旋後；針與手掌平行，進入外側魚際隆起、第一掌骨正上方。',
    activation: '請病人以拇指對掌小指。',
    clinicalPoints: ['腕隧道症候群、近端正中神經病變、下幹／內側索神經叢病變、胸廓出口症候群、C8-T1 神經根病變及遠端多發性神經病變時可異常。', '前骨間神經症候群通常不受影響。'],
    anatomyPoints: ['拇對掌肌位於拇短展肌深層；針位太內側或太淺會進入拇短展肌。'],
  }),
  defineGuide({
    chineseName: '拇短屈肌', englishName: 'Flexor Pollicis Brevis (FPB)',
    catalogNames: ['Flexor Pollicis Brevis'], figures: [3],
    innervation: '正中神經與尺神經（median and ulnar nerves）、內側索、下幹，C8-T1。',
    insertion: '在魚際隆起、第一掌骨中點稍內側進針。',
    activation: '請病人在掌指關節（metacarpophalangeal joint）屈曲拇指。',
    clinicalPoints: ['取樣通常比拇短展肌更疼痛。', '淺頭通常由正中神經支配，深頭通常由尺神經支配。', '正常人的神經支配變異很大；兩頭可能都由正中神經或都由尺神經支配。', '區分正中與尺神經病灶時，須謹慎解讀異常。'],
    anatomyPoints: ['針位太外側會進入拇短展肌。'],
  }),
  defineGuide({
    chineseName: '旋前方肌', englishName: 'Pronator Quadratus (PQ)',
    catalogNames: ['Pronator Quadratus'], figures: [4],
    innervation: '前骨間神經（anterior interosseous nerve）、正中神經、外側與內側索、中幹與下幹，C7-C8-T1。',
    insertion: '手置於旋後與旋前的中間位；從前臂背側進針，位置在尺骨與橈骨莖突連線中點近端約三指幅，穿過骨間膜進入深層肌肉。',
    activation: '屈肘時請病人旋前手掌。',
    clinicalPoints: ['前骨間神經症候群或近端正中神經病變時可異常。', '為腕部近端、偏 C8 的正中神經支配肌。', '腕隧道症候群通常不受影響。', '肌肉位於手指與拇指伸肌及其肌腱的深層。'],
    anatomyPoints: ['抵達肌肉前必須穿過厚實的骨間膜（interosseous membrane）。'],
  }),
  defineGuide({
    chineseName: '拇長屈肌', englishName: 'Flexor Pollicis Longus (FPL)',
    catalogNames: ['Flexor Pollicis Longus'], figures: [5],
    innervation: '前骨間神經、正中神經、外側與內側索、中幹與下幹，C7-C8-T1。',
    insertion: '前臂旋後；沿橈骨上方，在外側腕部往外側肘部約三分之一處垂直進針。',
    activation: '請病人在指間關節（interphalangeal joint）屈曲拇指。',
    clinicalPoints: ['前骨間神經症候群或近端正中神經病變時常異常。', '為腕部近端、偏 C8 的正中神經支配肌。', '腕隧道症候群通常不受影響。'],
    anatomyPoints: ['橈動脈就在進針點外側。', '淺橈感覺神經（superficial radial sensory nerve）也位於進針點外側。', '針位太淺可能進入指淺屈肌。'],
  }),
  defineGuide({
    chineseName: '指深屈肌（第 2、3 指）', englishName: 'Flexor Digitorum Profundus to Digits 2, 3',
    catalogNames: ['Flexor Digitorum Profundus (1,2)'], figures: [6],
    innervation: '前骨間神經、正中神經、內側索、下幹，C7-C8-T1。',
    insertion: '屈肘、手朝頭部且手背朝下；於鷹嘴（olecranon）遠端三至四指幅處進針。',
    activation: '請病人在遠端指間關節（DIP）屈曲第 2 或第 3 指。',
    clinicalPoints: ['第 2、3 指的深層肌束由正中神經／前骨間神經支配。', '第 4、5 指的淺層肌束由尺神經支配。', '正中神經支配的深層肌束較難取樣，可逐指屈曲以辨識個別肌束。', '前骨間神經症候群或近端正中神經病變時可異常。'],
    anatomyPoints: ['為到達深層正中神經肌束，針尖可能接近尺神經；應向身體內側微斜。除非診斷確有必要（例如前骨間神經病變），宜避免取樣。'],
  }),
  defineGuide({
    chineseName: '指淺屈肌', englishName: 'Flexor Digitorum Superficialis / Sublimis (FDS)',
    catalogNames: ['Flexor Digitorum Superficialis'], figures: [7],
    innervation: '正中神經、外側與內側索、中幹與下幹，C7-C8。',
    insertion: '前臂旋後；在肘窩與腕部中點連線的中點稍內側進針。',
    activation: '請病人在近端指間關節（PIP）屈曲手指。',
    clinicalPoints: ['近端正中神經病變時可異常。', '前骨間神經症候群通常不受影響。'],
    anatomyPoints: ['肌束供應第 2-5 指；可稍向內或外移動針位並逐指活動，以辨識不同肌束。', '針位太深會進入指深屈肌。', '若在正中線進針且太深，可能碰及正中神經。', '比橈側屈腕肌與旋前圓肌更難精確定位。'],
  }),
  defineGuide({
    chineseName: '橈側屈腕肌', englishName: 'Flexor Carpi Radialis (FCR)',
    catalogNames: ['Flexor Carpi Radialis'], figures: [8],
    innervation: '正中神經、外側索、上幹與中幹，C6-C7。',
    insertion: '前臂旋後；由肱二頭肌腱與內上髁中點向腕中央畫線，在該中點遠端四指幅處進針。',
    activation: '請病人將手腕向橈側屈曲。',
    clinicalPoints: ['C6 或 C7 神經根病變時常異常。', '近端正中神經病變（含旋前肌症候群）時常異常。', '前骨間神經症候群通常不受影響。'],
    anatomyPoints: ['針位太內側可能進入指淺屈肌。', '太外側且太深可能進入旋前圓肌。', '進針太深可能碰及正中神經。'],
  }),
  defineGuide({
    chineseName: '旋前圓肌', englishName: 'Pronator Teres (PT)',
    catalogNames: ['Pronator Teres'], figures: [9],
    innervation: '正中神經、外側索、上幹與中幹，C6-C7。',
    insertion: '前臂旋後；在肱二頭肌腱與內上髁中點的遠端兩指幅處進針。',
    activation: '肘完全伸直時請病人旋前手掌。',
    clinicalPoints: ['C6 或 C7 神經根病變時常異常。', '近端正中神經病變時常異常，但旋前肌症候群可能保留。', '前骨間神經症候群通常不受影響。', '容易定位與啟動。'],
    anatomyPoints: ['旋前圓肌是肘窩內側第一塊肌肉。', '針位太外側可能進入橈側屈腕肌或指淺屈肌。', '進針太深容易碰及正中神經。'],
  }),
  defineGuide({
    chineseName: '第一背側骨間肌', englishName: 'First Dorsal Interosseous (FDI)',
    catalogNames: ['First Dorsal Interosseous'], figures: [10],
    innervation: '尺神經、內側索、下幹，C8-T1。',
    insertion: '由手背進針，位置在第一與第二掌指關節中間。',
    activation: '請病人外展食指（張開手指）。',
    clinicalPoints: ['容易取樣。', '是手內在肌中疼痛感通常最低者。', 'Guyon 管、其他尺神經病變、下幹／內側索神經叢病變、胸廓出口症候群、C8-T1 神經根病變或遠端多發性神經病變時常異常。'],
    anatomyPoints: ['針位太深會進入同受尺神經支配的拇收肌（adductor pollicis）。'],
  }),
  defineGuide({
    chineseName: '小指展肌', englishName: 'Abductor Digiti Minimi (ADM)',
    catalogNames: ['Abd. Digiti Minimi'], figures: [11],
    innervation: '尺神經、內側索、下幹，C8-T1。',
    insertion: '在手掌尺側、第五掌骨中點進針。',
    activation: '請病人外展小指（張開手指）。',
    clinicalPoints: ['Guyon 管病變時可能受累，也可能保留；尺神經病變、下幹／內側索神經叢病變、胸廓出口症候群、C8-T1 神經根病變或遠端多發性神經病變時可異常。', '取樣常比第一背側骨間肌更疼痛。'],
    anatomyPoints: ['針位太深可能進入小指屈肌或小指對掌肌，但兩者也由尺神經支配。'],
  }),
  defineGuide({
    chineseName: '指深屈肌（第 4、5 指）', englishName: 'Flexor Digitorum Profundus to Digits 4, 5',
    catalogNames: ['Flexor Digitorum Profundus (3,4)'], figures: [12],
    innervation: '尺神經、內側索、下幹，C7-C8-T1。',
    insertion: '屈肘、手朝頭部且手背朝下；於鷹嘴遠端三至四指幅處進針。',
    activation: '請病人在遠端指間關節屈曲第 4 或第 5 指。',
    clinicalPoints: ['第 4、5 指的淺層肌束由尺神經支配。', '第 2、3 指的深層肌束由正中神經／前骨間神經支配。', '尺神經肌束較容易取樣，可逐指屈曲辨識個別肌束。', '肘部尺神經病變時常受影響。'],
    anatomyPoints: ['尺神經可能在針尖可及範圍；應讓針稍朝身體內側。'],
  }),
  defineGuide({
    chineseName: '尺側屈腕肌', englishName: 'Flexor Carpi Ulnaris (FCU)',
    catalogNames: ['Flexor Carpi Ulnaris'], figures: [13],
    innervation: '尺神經、內側索、下幹，C8-T1。',
    insertion: '前臂旋後；在肘與腕中點的前臂尺側進針。',
    activation: '請病人將手腕向尺側屈曲；也可外展第五指以協助確認位置。',
    clinicalPoints: ['張開手指時，FCU 會固定小指展肌起點的豆狀骨；它是前臂中唯一會隨張指收縮的肌肉。', '肌肉表淺且薄。', '肘部尺神經病變，尤其輕症時，常可保留。'],
    anatomyPoints: ['針位太深會進入指深屈肌。'],
  }),
  defineGuide({
    chineseName: '示指伸肌', englishName: 'Extensor Indicis Proprius (EIP)',
    catalogNames: ['Extensor Indicis Proprius'], figures: [14],
    innervation: '後骨間神經、橈神經、後索、中幹與下幹，C7-C8。',
    insertion: '手與前臂旋前；在尺骨莖突近端兩指幅處稍內側垂直進針。',
    activation: '請病人伸展食指。',
    clinicalPoints: ['包含後骨間神經麻痺在內的各層次橈神經病變均可異常。', '是最遠端的橈神經支配肌。', '下幹／後索神經叢病變、胸廓出口症候群、C8 神經根病變及遠端多發性神經病變時可異常。'],
    anatomyPoints: ['肌肉常位於深層；針位太淺會進入尺側伸腕肌或小指伸肌。', '進針路徑會靠近數條表淺肌腱。'],
  }),
  defineGuide({
    chineseName: '尺側伸腕肌', englishName: 'Extensor Carpi Ulnaris (ECU)',
    catalogNames: ['Extensor Carpi Ulnaris'], figures: [15],
    innervation: '後骨間神經、橈神經、後索、中幹與下幹，C7-C8。',
    insertion: '前臂旋前；在尺骨中點稍近端進針。',
    activation: '請病人將手腕向尺側伸展。',
    clinicalPoints: ['包含後骨間神經麻痺在內的各層次橈神經病變均可異常。', '下幹／後索神經叢病變、胸廓出口症候群、C7-C8 神經根病變或遠端多發性神經病變時可異常。'],
    anatomyPoints: ['針位太內側可能進入小指伸肌或指總伸肌。'],
  }),
  defineGuide({
    chineseName: '指總伸肌', englishName: 'Extensor Digitorum Communis (EDC)',
    catalogNames: ['Extensor Digitorum Communis'], figures: [16],
    innervation: '後骨間神經、橈神經、後索、中幹與下幹，C7-C8。',
    insertion: '前臂旋前；在鷹嘴遠端三至四指幅、尺骨上方三指幅處進針。',
    activation: '請病人伸展中指。',
    clinicalPoints: ['肌肉表淺，啟動時容易觸診。', '包含後骨間神經麻痺在內的各層次橈神經病變均可異常。', '常用於單纖維肌電圖（single-fiber EMG）。'],
    anatomyPoints: ['針位太外側可能進入尺側伸腕肌。', '針位太內側可能進入橈側伸腕肌。', '進針太深可能碰及橈神經運動支；但此肌很容易在淺層取樣。'],
  }),
  defineGuide({
    chineseName: '橈側伸腕長肌', englishName: 'Extensor Carpi Radialis Longus (ECRL)',
    catalogNames: ['Extensor Carpi Rad. Longus'], figures: [17],
    innervation: '橈神經、後索、上幹與中幹，C6-C7。',
    insertion: '前臂旋前；於外上髁正上方進針。',
    activation: '請病人將手腕向橈側伸展。',
    clinicalPoints: ['是後骨間神經麻痺時唯一保留的前臂伸肌。', '螺旋溝（spiral groove）或其近端的橈神經病變時可異常。'],
    anatomyPoints: ['若在較遠端伸肌群進針，難與其他由後骨間神經支配的腕指伸肌區分。', '針位太內側會進入肱橈肌。'],
  }),
  defineGuide({
    chineseName: '肱橈肌', englishName: 'Brachioradialis (BR)',
    catalogNames: ['Brachioradialis'], figures: [18],
    innervation: '橈神經、後索、上幹，C5-C6。',
    insertion: '在肱二頭肌腱與外上髁中點的遠端三至四指幅處進針。',
    activation: '前臂置於旋前與旋後中間位，請病人屈肘。',
    clinicalPoints: ['螺旋溝或其近端的橈神經病變時可異常。', '後骨間神經麻痺時保留。', '上幹神經叢病變或 C5、C6 神經根病變時可異常。'],
    anatomyPoints: ['肱橈肌是肘窩外側第一塊肌肉。', '針位太外側且太深會進入橈側伸腕肌。'],
  }),
  defineGuide({
    chineseName: '肘肌', englishName: 'Anconeus (ANC)',
    catalogNames: ['Anconeus'], figures: [19],
    innervation: '橈神經、後索、上／中／下幹，C6-C7-C8。',
    insertion: '前臂旋前；在鷹嘴遠端一至兩指幅、尺骨稍上方進針。',
    activation: '請病人伸肘。',
    clinicalPoints: ['可視為肱三頭肌內側頭的延伸。', '是前臂中唯一在螺旋溝近端即由橈神經支配的肌肉。', '螺旋溝橈神經病變時保留。'],
    anatomyPoints: ['針位太前方可能進入尺側伸腕肌或指總伸肌。'],
  }),
  defineGuide({
    chineseName: '肱三頭肌外側頭', englishName: 'Triceps Brachii - Lateral Head',
    catalogNames: ['Triceps Brachii'], figures: [20],
    innervation: '橈神經、後索、上／中／下幹，C6-C7-C8。',
    insertion: '前臂旋前且屈肘；在外上髁與肩部中點稍下方進針。',
    activation: '請病人伸肘。',
    clinicalPoints: ['三個頭中最容易取樣。', 'C7 神經根病變時常異常。', '螺旋溝橈神經病變時保留。', '是 C7 神經根病變最穩定出現異常的肌肉。', '太靠近肘部取樣時肌腱較多，也較疼痛。'],
    anatomyPoints: ['由外側進針時，附近沒有主要神經或血管構造。'],
  }),
  defineGuide({
    chineseName: '肱二頭肌', englishName: 'Biceps Brachii (BB)',
    catalogNames: ['Biceps Brachii'], figures: [21],
    innervation: '肌皮神經（musculocutaneous nerve）、外側索、上幹，C5-C6。',
    insertion: '前臂旋後；在肱二頭肌腱與前肩中點進針。',
    activation: '手掌旋後時請病人屈肘。',
    clinicalPoints: ['是最容易接近的肌皮神經支配肌。', '上幹／外側索神經叢病變及 C5、C6 神經根病變時常異常。'],
    anatomyPoints: ['由前方取樣時，附近沒有主要神經或血管。', '不建議由內側取樣；該方向會使肱動脈、正中神經及大靜脈暴露於風險。'],
  }),
  defineGuide({
    chineseName: '胸大肌', englishName: 'Pectoralis Major (PM)',
    catalogNames: ['Pectoralis Major (Clav)', 'Pectoralis Major (Stern)'], figures: [22],
    innervation: '內側與外側胸神經（medial/lateral pectoral nerves）、內側與外側索、上／中／下幹，C5-T1。',
    insertion: '在前腋線（anterior axillary line）的前下肩部進針。',
    activation: '請病人內收肩關節。',
    clinicalPoints: ['胸大肌包含鎖骨部（上方）與胸骨部（下方）。', '鎖骨部由外側胸神經、外側索、C5-C7 支配。', '胸骨部由內側胸神經、內側索、C8-T1 支配。'],
    anatomyPoints: ['針位太外側會進入三角肌。', '太外側且太深可能接近喙肱肌、臂神經叢與上肢主要血管。'],
  }),
  defineGuide({
    chineseName: '三角肌中束', englishName: 'Deltoid - Medial Head',
    catalogNames: ['Deltoid (Ant/Mid/Post)'], figures: [23],
    innervation: '腋神經（axillary nerve）、後索、上幹，C5-C6。',
    insertion: '由肩部外側中央進針。',
    activation: '請病人外展肩關節。',
    clinicalPoints: ['三束中以中束最容易取樣。', '正常人的運動單位動作電位（MUAP）也可能有較多多相波。', '是最容易接近的腋神經支配肌。', '腋神經病變、上幹／後索神經叢病變及 C5、C6 神經根病變時常異常。', '若疑似腋神經前支或肱骨頸骨折，可在胸大肌進針點稍外側取樣前束，並請病人向前外展肩部。'],
    anatomyPoints: ['由外側進針時，附近沒有主要神經或血管。'],
  }),
  defineGuide({
    chineseName: '小圓肌', englishName: 'Teres Minor',
    catalogNames: ['Teres Minor'], figures: [24],
    innervation: '腋神經、後索、上幹，C5-C6。',
    insertion: '在肩胛骨下角至肩峰連線約三分之二處進針。',
    activation: '請病人外旋上臂。',
    clinicalPoints: ['比三角肌難定位，因此篩檢腋神經病變時通常優先選三角肌。', '腋神經病變、上幹／後索神經叢病變及 C5、C6 神經根病變時常異常。'],
    anatomyPoints: ['針位太內側會進入棘下肌。', '太淺或太外側會進入三角肌後束。'],
  }),
  defineGuide({
    chineseName: '上斜方肌', englishName: 'Upper Trapezius',
    catalogNames: ['Trapezius (Upper)'], figures: [25],
    innervation: '副神經（spinal accessory nerve）與 C3-C4。',
    insertion: '側臥、待測肩朝上；在後肩與頸部交界處進針。',
    activation: '請病人聳肩。',
    clinicalPoints: ['局部手術造成的副神經病變最常受影響，而胸鎖乳突肌可保留。'],
    anatomyPoints: ['肌肉位於表淺。', '針位太內側且太深，可能進入菱形肌、提肩胛肌或脊椎旁肌。'],
  }),
  defineGuide({
    chineseName: '胸鎖乳突肌', englishName: 'Sternocleidomastoid (SCM)',
    catalogNames: ['Sternocleidomastoid'], figures: [26],
    innervation: '副神經（spinal accessory nerve）與上頸髓。',
    insertion: '觸診後以手指夾持肌肉，在肌肉中點附近進針。',
    activation: '請病人將頭頸轉向對側。',
    clinicalPoints: ['痙攣性斜頸（spasmodic torticollis）時常受累。'],
    anatomyPoints: ['針必須始終保持表淺，以免傷及頸動脈或頸靜脈。'],
  }),
  defineGuide({
    chineseName: '棘上肌', englishName: 'Supraspinatus (SS)',
    catalogNames: ['Supraspinatus'], figures: [27],
    innervation: '肩胛上神經（suprascapular nerve）、上幹，C5-C6。',
    insertion: '側臥、待測肩朝上且手肘貼身；在肩胛棘中點稍頭側及內側進針。',
    activation: '請病人外展肩關節。',
    clinicalPoints: ['針位太淺會進入斜方肌。', '肩胛盂切跡（spinoglenoid notch）處的肩胛上神經病變可保留此肌。', '比棘下肌更難取樣。', '上幹神經叢病變及 C5-C6 神經根病變時可異常。'],
    anatomyPoints: ['針位太淺會進入上斜方肌。', '針位過度頭側且太深，罕見但可能造成氣胸。'],
  }),
  defineGuide({
    chineseName: '棘下肌', englishName: 'Infraspinatus',
    catalogNames: ['Infraspinatus'], figures: [28],
    innervation: '肩胛上神經、上幹，C5-C6。',
    insertion: '側臥、待測肩朝上且手肘貼身；在肩胛棘中點下方一至兩指幅處進針。',
    activation: '請病人外旋肩關節。',
    clinicalPoints: ['肩胛上神經病變、上幹神經叢病變及 C5、C6 神經根病變時常異常。', '肩胛骨的棘下窩就在深層；位置正確時沒有氣胸風險。'],
    anatomyPoints: ['肌肉大部分表淺；靠近肩胛棘處若太淺可能進入三角肌後束。可先進針至肩胛骨，再稍微退出以確認位於肌肉內。'],
  }),
  defineGuide({
    chineseName: '菱形肌群', englishName: 'Rhomboids',
    catalogNames: ['Rhomboid Major/Minor'], figures: [29],
    innervation: '肩胛背神經（dorsal scapular nerve），C4-C5。',
    insertion: '側臥、待測側朝上；手臂內旋、屈肘，手背放在背部中央，在肩胛骨內緣與背部中線的中點進針。',
    activation: '請病人把手抬離背部。',
    clinicalPoints: ['C5 神經根病變時可異常。', '肩胛背神經在臂神經叢近端分出，因此上幹神經叢病變時菱形肌可保留。'],
    anatomyPoints: ['針位太淺會進入斜方肌。', '太深會進入脊椎旁肌。', '進針過深罕見但可能造成氣胸。'],
  }),
  defineGuide({
    chineseName: '背闊肌', englishName: 'Latissimus Dorsi (LD)',
    catalogNames: ['Latissimus Dorsi'], figures: [30],
    innervation: '胸背神經（thoracodorsal nerve）、後索、上／中／下幹，C6-C8。',
    insertion: '側臥、待測側朝上；在肩胛骨下角外側與尾側、後腋線處進針。',
    activation: '肩內旋與內收、手臂高於水平面，請病人伸展肩部，把手往腳方向帶。',
    clinicalPoints: ['比神經支配路徑相近的肱三頭肌及其他橈神經支配肌更難取樣。'],
    anatomyPoints: ['針位太深可能進入前鋸肌。'],
  }),
  defineGuide({
    chineseName: '前鋸肌', englishName: 'Serratus Anterior (SA)',
    catalogNames: ['Serratus Anterior'], figures: [31],
    innervation: '長胸神經（long thoracic nerve），C5-C7。',
    insertion: '側臥、待測肩朝上；在腋中線第六肋骨表面小心進針。',
    activation: '手臂伸直，請病人把手向前推。',
    clinicalPoints: ['長胸神經在臂神經叢近端分出，因此臂神經叢病變時可保留。', '神經痛性肌萎縮（neuralgic amyotrophy／brachial amyotrophy）時常異常。', '大部分肌肉位於肋骨與肩胛骨之間，取樣較困難。'],
    anatomyPoints: ['若針進入肋間，可能傷及神經血管束或造成氣胸。'],
  }),
  defineGuide({
    chineseName: '趾短伸肌', englishName: 'Extensor Digitorum Brevis (EDB)',
    catalogNames: ['Extensor Digitorum Brevis'], figures: [32],
    innervation: '深腓神經（deep peroneal nerve）、總腓神經、坐骨神經、腰薦神經叢，L4-L5-S1。',
    insertion: '在足背沿切線進針，位置在外踝遠端兩至三指幅；請病人伸展所有腳趾可協助觸診。',
    activation: '請病人伸展腳趾。',
    clinicalPoints: ['前跗管症候群（anterior tarsal tunnel syndrome）時可受累。', '正常無症狀者也常見部分去神經與再支配；異常須謹慎解讀，可做左右比較。'],
    anatomyPoints: ['肌肉極表淺且很薄。', '趾長伸肌的肌腱會跨過此肌。'],
  }),
  defineGuide({
    chineseName: '拇趾長伸肌', englishName: 'Extensor Hallucis Longus (EHL)',
    catalogNames: ['Extensor Hallucis Longus'], figures: [33],
    innervation: '深腓神經、總腓神經、坐骨神經、腰薦神經叢，L4-L5-S1。',
    insertion: '在踝上方四至五指幅、脛前肌腱稍外側進針。',
    activation: '請病人伸展拇趾。',
    clinicalPoints: ['是遠端且以 L5 支配為主的肌肉。', '常因鄰近脛前肌與 EHL 肌腱而較疼痛。', '深腓或總腓神經病變時常異常。', '位於小腿遠端，多發性神經病變時常異常。'],
    anatomyPoints: ['EHL 位於脛前肌腱稍外側。', '針位太深且偏內側可能接近深腓神經與伴行血管。', '針經過鄰近肌腱時可能引起疼痛。'],
  }),
  defineGuide({
    chineseName: '趾長伸肌', englishName: 'Extensor Digitorum Longus (EDL)',
    catalogNames: ['Extensor Digitorum Longus'], figures: [34],
    innervation: '深腓神經、總腓神經、坐骨神經、腰薦神經叢，L4-L5。',
    insertion: '在脛骨脊外側三至四指幅、脛前肌與腓骨長肌之間進針。',
    activation: '請病人伸展腳趾。',
    clinicalPoints: ['比脛前肌更難定位。'],
    anatomyPoints: ['針位太內側會進入脛前肌。', '太外側會進入腓骨長肌。'],
  }),
  defineGuide({
    chineseName: '脛前肌', englishName: 'Tibialis Anterior (TA)',
    catalogNames: ['Tibialis Anterior'], figures: [35],
    innervation: '深腓神經、總腓神經、坐骨神經、腰薦神經叢，L4-L5。',
    insertion: '在脛骨脊稍外側，由踝往膝約三分之二處進針。',
    activation: '請病人背屈踝關節。',
    clinicalPoints: ['L4、L5 神經根病變及深腓或總腓神經病變時常異常。', '是深腓神經支配肌中最容易定位與啟動者。', '評估垂足（foot drop）的關鍵肌肉。'],
    anatomyPoints: ['由前外側取樣時，附近沒有主要神經或血管。', '是脛骨脊外側第一塊肌肉。'],
  }),
  defineGuide({
    chineseName: '腓骨長肌', englishName: 'Peroneus / Fibularis Longus (PL)',
    catalogNames: ['Peroneus Longus'], figures: [36],
    innervation: '淺腓神經（superficial peroneal nerve）、總腓神經、坐骨神經、腰薦神經叢，L5-S1。',
    insertion: '在小腿外側、腓骨頭遠端三至四指幅處進針。',
    activation: '請病人外翻踝關節。',
    clinicalPoints: ['是最容易接近的淺腓神經支配肌。', '淺腓或總腓神經病變時常異常。'],
    anatomyPoints: ['針位太前方會進入趾長伸肌。', '太後方會進入比目魚肌或腓腸肌外側頭，這是最常見的定位錯誤。', '進針太深可能傷及深腓神經。'],
  }),
  defineGuide({
    chineseName: '拇趾展肌', englishName: 'Abductor Hallucis Brevis (AHB)',
    catalogNames: ['Abductor Hallucis'], figures: [37],
    innervation: '內側足底神經、脛神經、坐骨神經、腰薦神經叢，S1-S2。',
    insertion: '沿足內側切線進針，位置在足跟與前腳掌球部的中點。',
    activation: '請病人張開腳趾。',
    clinicalPoints: ['常難以啟動。', '取樣常較疼痛。', '跗管症候群時可異常。', '周邊血管功能不全，尤其合併糖尿病者，除非效益高於風險，不建議取樣。', '正常無症狀者也常有部分去神經與再支配；宜謹慎解讀並做左右比較。'],
    anatomyPoints: ['肌肉很表淺。', '進針太深可能傷及內側足底神經。'],
  }),
  defineGuide({
    chineseName: '拇趾短屈肌', englishName: 'Flexor Hallucis Brevis (FHB)',
    catalogNames: ['Flexor Hallucis Brevis'], figures: [38],
    innervation: '內側足底神經、脛神經、坐骨神經、腰薦神經叢，S1-S2。',
    insertion: '在足底內側、前腳掌球部下方、拇趾長屈肌腱內側進針。',
    activation: '請病人屈曲拇趾。',
    clinicalPoints: ['常難以啟動。', '取樣常較疼痛。', '跗管症候群時可異常。', '周邊血管功能不全，尤其合併糖尿病者，除非效益高於風險，不建議取樣。', '正常無症狀者也常有部分去神經與再支配；宜謹慎解讀並做左右比較。'],
    anatomyPoints: [],
  }),
  defineGuide({
    chineseName: '足小趾展肌', englishName: 'Abductor Digiti Quinti Pedis (ADQP)',
    catalogNames: ['Abductor Digiti Quinti'], figures: [39],
    innervation: '外側足底神經、脛神經、坐骨神經、腰薦神經叢，S1-S2。',
    insertion: '沿足外側切線進針，位置在第五蹠趾關節近端兩至三指幅。',
    activation: '請病人張開腳趾。',
    clinicalPoints: ['常難以啟動。', '取樣常較疼痛。', '跗管症候群時可異常。', '周邊血管功能不全，尤其合併糖尿病者，除非效益高於風險，不建議取樣。', '正常無症狀者也常有部分去神經與再支配；宜謹慎解讀並做左右比較。'],
    anatomyPoints: ['肌肉很表淺。', '腓骨長肌腱位於其前方。'],
  }),
  defineGuide({
    chineseName: '腓腸肌內側頭', englishName: 'Gastrocnemius - Medial Head (MG)',
    catalogNames: ['Gastrocnemius (Med/Lat)'], figures: [40],
    innervation: '脛神經、坐骨神經、腰薦神經叢，S1-S2。',
    insertion: '在小腿後內側近端進針。',
    activation: '請病人蹠屈踝關節；若不易啟動，可先屈膝再蹠屈。',
    clinicalPoints: ['有些病人不易啟動。', '是遠端 S1 支配肌，S1 神經根病變時常異常。', '評估 S1 時較腓腸肌外側頭理想，因內側頭不含 L5，而外側頭可能含部分 L5 纖維。'],
    anatomyPoints: ['針位太深會進入比目魚肌；但兩者均由脛神經與 S1-S2 支配。'],
  }),
  defineGuide({
    chineseName: '比目魚肌', englishName: 'Soleus (SOL)',
    catalogNames: ['Soleus'], figures: [41],
    innervation: '脛神經、坐骨神經、腰薦神經叢，S1-S2。',
    insertion: '在脛骨內側、踝膝中點稍遠端，於腓腸肌內外側頭肌腹下方進針。',
    activation: '請病人蹠屈踝關節。',
    clinicalPoints: ['不易啟動。', '是遠端 S1 支配肌。'],
    anatomyPoints: ['針尖若過度向前朝脛骨，會進入趾長屈肌。'],
  }),
  defineGuide({
    chineseName: '脛後肌', englishName: 'Tibialis Posterior (TP)',
    catalogNames: ['Tibialis Posterior'], figures: [42],
    innervation: '脛神經、坐骨神經、腰薦神經叢，L5-S1。',
    insertion: '在脛骨內側、踝膝中點稍遠端，穿過趾長屈肌進入深層。',
    activation: '請病人內翻踝關節。',
    clinicalPoints: ['是以 L5 支配為主的脛神經支配肌。', '評估垂足時，可協助區分腓神經病變與坐骨神經、腰薦神經叢或 L5 神經根病變。', '位於深層，常需較長的 37 mm 針。'],
    anatomyPoints: ['針位太淺會進入趾長屈肌。', '針尖太偏後方可能傷及脛神經及鄰近血管。'],
  }),
  defineGuide({
    chineseName: '趾長屈肌', englishName: 'Flexor Digitorum Longus (FDL)',
    catalogNames: ['Flexor Digitorum Longus'], figures: [43],
    innervation: '脛神經、坐骨神經、腰薦神經叢，L5-S1。',
    insertion: '在脛骨內側、踝膝中點稍遠端，穿過比目魚肌進入深層。',
    activation: '請病人屈曲腳趾。',
    clinicalPoints: ['是以 L5 支配為主的脛神經支配肌。', '評估垂足時，可協助區分腓神經病變與坐骨神經、腰薦神經叢或 L5 神經根病變。'],
    anatomyPoints: ['隱神經（saphenous nerve）就在進針點前方。', '針尖向後可能傷及脛神經及鄰近血管。', '針位太後方會進入比目魚肌。', '針位太深會進入脛後肌；兩者神經支配相同，通常不是問題。'],
  }),
  defineGuide({
    chineseName: '股二頭肌短頭', englishName: 'Biceps Femoris - Short Head (BF-SH)',
    catalogNames: ['Biceps Femoris (Short Head)'], figures: [44],
    innervation: '坐骨神經腓側分支（peroneal division）、腰薦神經叢，L5-S1。',
    insertion: '在外側膝近端三至四指幅、股二頭肌長頭肌腱內側進針。',
    activation: '請病人屈膝。',
    clinicalPoints: ['是腓骨頸以上唯一由坐骨神經腓側分支支配的肌肉。', '鑑別腓骨頸總腓神經病變很重要：腓骨頸病變時此肌正常；若模擬腓神經病變的病灶位於坐骨神經或更近端，此肌可異常。'],
    anatomyPoints: ['針尖若太內側且太深，可能傷及坐骨神經；肌肉本身很表淺。', '也可在長頭肌腱前方進針，但必須向下導入。'],
  }),
  defineGuide({
    chineseName: '股二頭肌長頭', englishName: 'Biceps Femoris - Long Head (BF-LH)',
    catalogNames: ['Biceps Femoris (Long Head)'], figures: [45],
    innervation: '坐骨神經脛側分支（tibial division）、腰薦神經叢，L5-S1。',
    insertion: '在外側膝與坐骨粗隆中點進針。',
    activation: '請病人屈膝。',
    clinicalPoints: ['坐骨神經病變、腰薦神經叢病變或 S1 神經根病變時可異常；外側腿後肌偏 S1，內側腿後肌偏 L5。', '請病人輕微屈膝使肌腱突出，再沿肌腱向近端找到肌腹。'],
    anatomyPoints: ['在大腿較近端的此位置，外後側只有股二頭肌長頭；短頭位於更遠端。', '針位太後方會進入半腱肌。'],
  }),
  defineGuide({
    chineseName: '半膜肌', englishName: 'Semimembranosus (SM)',
    catalogNames: ['Semimembranosus'], figures: [46],
    innervation: '坐骨神經脛側分支、腰薦神經叢，L4-L5-S1。',
    insertion: '在內側膝近端三至四指幅、半腱肌肌腱外側進針。',
    activation: '請病人屈膝。',
    clinicalPoints: ['坐骨神經病變、腰薦神經叢病變或 L5 神經根病變時可異常；內側腿後肌偏 L5，外側腿後肌偏 S1。'],
    anatomyPoints: ['雖可沿大腿內側取樣，但在遠端此位置只有半膜肌；半腱肌主要是肌腱，因此此處可較專一地取樣半膜肌。'],
  }),
  defineGuide({
    chineseName: '半腱肌', englishName: 'Semitendinosus (ST)',
    catalogNames: ['Semitendinosus'], figures: [47],
    innervation: '坐骨神經脛側分支、腰薦神經叢，L4-L5-S1。',
    insertion: '在大腿後側、內側膝與坐骨粗隆中點進針。',
    activation: '請病人屈膝。',
    clinicalPoints: ['坐骨神經病變、腰薦神經叢病變或 L5 神經根病變時可異常；內側腿後肌偏 L5，外側腿後肌偏 S1。'],
    anatomyPoints: ['針位太前方會進入股二頭肌長頭。', '太後方會進入半膜肌；但兩者神經與肌節支配相同。'],
  }),
  defineGuide({
    chineseName: '大腿內收肌群', englishName: 'Thigh Adductors',
    catalogNames: ['Adductor Longus/Brevis', 'Adductor Magnus', 'Gracilis'], figures: [48],
    innervation: '閉孔神經（obturator nerve）、腰神經叢，L2-L4。',
    insertion: '髖膝屈曲並讓大腿外旋以凸顯內收肌；在恥骨遠端三至四指幅的大腿內側進針。',
    activation: '請病人內收大腿；在髖膝屈曲且髖外旋姿勢下，也可請病人內旋髖部。',
    clinicalPoints: ['可協助區分腰神經叢／腰神經根病變與股神經病變。', '內收長肌、內收短肌、薄肌與內收大肌可視為同一功能單位，神經與肌節支配相同；脂肪較多時不必強求辨識單一肌肉，通常取到表淺的內收長肌。內收大肌最外側少部分由坐骨神經支配，但位置很深，通常不會誤取。', '常需較長的 37 或 50 mm 針。'],
    anatomyPoints: ['由內側進針時，附近沒有主要神經或血管。'],
  }),
  defineGuide({
    chineseName: '股外側肌', englishName: 'Vastus Lateralis (VL)',
    catalogNames: ['Quadriceps (Vastus/Rectus)'], figures: [49],
    innervation: '股神經、腰神經叢，L2-L4。',
    insertion: '在外側膝近端四至五指幅的大腿外側進針。',
    activation: '請病人伸膝，同時將腳跟抬離床面。',
    clinicalPoints: ['股神經、腰神經叢或腰神經根病變時常異常。', 'MUAP 通常比其他股四頭肌大，因此輕微增大的判讀較困難。'],
    anatomyPoints: ['由外側進針時，附近沒有主要神經或血管。', '針位太深會進入中間廣肌；其股神經與 L2-L4 支配與股外側肌相同。'],
  }),
  defineGuide({
    chineseName: '股內側肌', englishName: 'Vastus Medialis (VM)',
    catalogNames: ['Quadriceps (Vastus/Rectus)'], figures: [50],
    innervation: '股神經、腰神經叢，L2-L4。',
    insertion: '在內側膝近端三至四指幅的大腿內側進針。',
    activation: '請病人伸膝，同時將腳跟抬離床面。',
    clinicalPoints: ['股神經、腰神經叢或腰神經根病變時常異常。'],
    anatomyPoints: ['由內側進針時，附近沒有主要神經或血管。'],
  }),
  defineGuide({
    chineseName: '股直肌', englishName: 'Rectus Femoris (RF)',
    catalogNames: ['Quadriceps (Vastus/Rectus)'], figures: [51],
    innervation: '股神經、腰神經叢，L2-L4。',
    insertion: '在髖與膝中點的大腿前側進針。',
    activation: '請病人伸膝，同時將腳跟抬離床面。',
    clinicalPoints: ['兼具屈髖與伸膝功能。', '股神經、腰神經叢或腰神經根病變時常異常。'],
    anatomyPoints: ['由前方進針時，附近沒有主要神經或血管。', '針位太深會進入中間廣肌。'],
  }),
  defineGuide({
    chineseName: '髂肌', englishName: 'Iliacus',
    catalogNames: ['Iliopsoas'], figures: [52],
    innervation: '股神經、腰神經叢，L2-L4。',
    insertion: '在腹股溝韌帶下方、股動脈搏動外側兩至三指幅處進針。',
    activation: '請病人屈髖。',
    clinicalPoints: ['髂肌與腰大肌共同形成髂腰肌（iliopsoas），但此進針點實際取樣的是髂肌。', '股神經在腹股溝韌帶處的壓迫病變可保留此肌。', '評估肌病與高位腰神經根病變時很有用。'],
    anatomyPoints: ['針位太內側可能傷及股神經、股動脈與股靜脈。', '太淺且稍外側可能進入縫匠肌。', '股外側皮神經就在進針點外側。'],
  }),
  defineGuide({
    chineseName: '臀中肌', englishName: 'Gluteus Medius (GMED)',
    catalogNames: ['Gluteus Medius'], figures: [53],
    innervation: '上臀神經、腰薦神經叢，L4-L5-S1。',
    insertion: '側臥、待測側朝上；在髂嵴遠端兩至三指幅的大腿外側進針。',
    activation: '請病人外展大腿。',
    clinicalPoints: ['是近端、以 L5 支配為主的肌肉。', '可協助區分腰薦神經叢或 L5-S1 神經根病變與坐骨神經病變。'],
    anatomyPoints: ['由外側進針時，附近沒有主要神經或血管。'],
  }),
  defineGuide({
    chineseName: '闊筋膜張肌', englishName: 'Tensor Fasciae Latae (TFL)',
    catalogNames: ['Tensor Fasciae Latae'], figures: [54],
    innervation: '上臀神經、腰薦神經叢，L4-L5-S1。',
    insertion: '側臥、待測側朝上；在大轉子前方、前上髂棘下方進針。',
    activation: '請病人內旋大腿：雙膝併攏，將同側腳踝朝天花板抬起。',
    clinicalPoints: ['是近端、以 L5 支配為主的肌肉。', '可協助區分腰薦神經叢或 L5-S1 神經根病變與坐骨神經病變。', '雖也能外展髖部，主要動作是髖內旋。', '與臀中肌的神經與肌節支配相同，但 L5 神經根病變時 TFL 常異常而臀中肌可能正常或僅可疑，因此作者較偏好取樣 TFL。'],
    anatomyPoints: ['肌肉很表淺。', '針位太深可能進入股外側肌或中間廣肌。', '股外側皮神經位於進針點內側。'],
  }),
  defineGuide({
    chineseName: '臀大肌', englishName: 'Gluteus Maximus (GMAX)',
    catalogNames: ['Gluteus Major'], figures: [55],
    innervation: '下臀神經、腰薦神經叢，L5-S1-S2。',
    insertion: '選項 1：側臥，於臀部外上象限進針。選項 2：側臥，於臀部內下象限進針。選項 3：俯臥，於臀部外上象限進針。',
    activation: '選項 1：膝伸直並伸髖。選項 2：夾緊臀部。選項 3：腿伸直並伸髖。',
    clinicalPoints: ['是評估 S1 神經根病變最佳的近端 S1 支配肌。', '可協助區分腰薦神經叢或 L5-S1 神經根病變與坐骨神經病變。'],
    anatomyPoints: ['若在臀部中央或外下象限進針且太深，可能碰及坐骨神經。'],
  }),
  defineGuide({
    chineseName: '頸椎脊旁肌', englishName: 'Cervical Paraspinal Muscles (PSPs)',
    catalogNames: ['Paraspinal (Cervical)'], figures: [56],
    innervation: '脊神經後支（dorsal rami）、脊神經與神經根。',
    insertion: '側臥、待測側朝上；在下頸椎距脊椎中線兩指幅處進針，針尖稍向內側。為確認進入深層肌群，可前進至輕觸椎板（lamina）後稍微退出。',
    activation: '請病人伸頸。',
    clinicalPoints: ['是最靠近神經根的近端肌群。', '適合評估神經根病變與肌病。', '神經病變時，脊椎旁肌異常只能把病灶定位在神經根或其近端；因相鄰肌節重疊大，特定根節仍應依肢體肌肉判定。', '有些病人難以完全放鬆；評估插入與自發活動時，可採胎兒姿勢，使頸、髖、膝屈曲。', '部分病人反而不易啟動。'],
    anatomyPoints: ['下頸椎若進針太外側，罕見但可能造成氣胸。', '針位太淺可能進入上斜方肌。'],
  }),
  defineGuide({
    chineseName: '胸椎脊旁肌', englishName: 'Thoracic Paraspinal Muscles (PSPs)',
    catalogNames: ['Paraspinal (Thoracic)'], figures: [57],
    innervation: '脊神經後支（dorsal rami）、脊神經與神經根，T1-T12。',
    insertion: '側臥、待測側朝上；在欲檢查的胸椎高度，距脊椎中線兩指幅處進針，針尖稍向內側。為確認進入深層肌群，可前進至輕觸椎板（lamina）後稍微退出。',
    activation: '請病人伸展背部或深吸氣。',
    clinicalPoints: ['是最靠近胸神經根的近端肌群。', '適合評估胸神經根病變與肌病。', '相鄰胸髓節重疊大，異常高度仍需結合症狀、影像與其他檢查判定。', '評估插入與自發活動時，可採胎兒姿勢，使頸、髖、膝屈曲以利放鬆。'],
    anatomyPoints: ['進針太外側可能造成氣胸。', '上胸椎針位太淺可能進入斜方肌或菱形肌。', '下胸椎針位太淺可能進入斜方肌或背闊肌。'],
  }),
  defineGuide({
    chineseName: '腰薦椎脊旁肌', englishName: 'Lumbosacral Paraspinal Muscles (PSPs)',
    catalogNames: ['Paraspinal (L2)', 'Paraspinal (L3)', 'Paraspinal (L4)', 'Paraspinal (L5)', 'Paraspinal (S1)'], figures: [58],
    innervation: '脊神經後支（dorsal rami）、脊神經與神經根。',
    insertion: '側臥、待測側朝上；在欲檢查的腰薦椎高度，距脊椎中線兩指幅處進針，針尖稍向內側。為確認進入深層肌群，可前進至輕觸椎板（lamina）後稍微退出。',
    activation: '保持膝伸直，請病人伸髖。',
    clinicalPoints: ['是最靠近神經根的近端肌群。', '適合評估神經根病變與肌病。', '神經病變時，脊椎旁肌異常只能把病灶定位在神經根或其近端；因相鄰肌節重疊大，特定根節仍應依肢體肌肉判定。', '評估插入與自發活動時，可採胎兒姿勢，使頸、髖、膝屈曲以利放鬆。'],
    anatomyPoints: ['以椎板（lamina）作為深度定位；輕觸後稍微退出。', '避免向外側偏離脊椎旁深層肌群。'],
  }),
  defineGuide({
    chineseName: '頦舌肌', englishName: 'Genioglossus (Tongue)',
    catalogNames: ['Tongue (Genioglossus)'], figures: [59],
    innervation: '舌下神經（hypoglossal nerve，CN XII）與延髓。',
    insertion: '選項 1（口內）：病人伸舌，以紗布握住舌尖，從舌下表面外側進針。選項 2（經皮）：由前下顎下方、稍離中線處向頭側進針。',
    activation: '請病人伸舌。',
    clinicalPoints: ['舌頭難以完全放鬆，因此自發活動常不易判讀。', '疑似運動神經元疾病時很有用。', '顱延髓肌的 MUAP 時間通常比肢體肌短。'],
    anatomyPoints: ['經皮進針須稍離中線；再往兩側有頦下動脈（submental arteries）。', '針位太淺會進入由 C1 支配的頦舌骨肌（geniohyoideus）。'],
  }),
  defineGuide({
    chineseName: '咬肌', englishName: 'Masseter',
    catalogNames: ['Masseter'], figures: [60],
    innervation: '下頷神經、三叉神經運動支（V3）與腦橋。',
    insertion: '先請病人咬緊牙關觸診；在下顎角前方兩指幅、頭側一至兩指幅處，沿上下牙齒之間的水平線進針。',
    activation: '請病人咬緊牙關。',
    clinicalPoints: ['容易啟動。', '疑似運動神經元疾病時很有用。', '顱延髓肌的 MUAP 時間通常比肢體肌短。'],
    anatomyPoints: ['進針應在肌肉較前方，以避開腮腺。', '不可太靠頭側，以避開腮腺管（parotid duct）。'],
  }),
  defineGuide({
    chineseName: '額肌', englishName: 'Frontalis',
    catalogNames: ['Frontalis'], figures: [61],
    innervation: '顏面神經額支（frontal branch of facial nerve，CN VII）與延髓－腦橋交界。',
    insertion: '在眉毛中點上方一至兩指幅處沿切線進針。',
    activation: '請病人向上看並抬眉。',
    clinicalPoints: ['常用於單纖維肌電圖。', '可評估貝爾氏麻痺（Bell’s palsy）。', '疑似運動神經元疾病時很有用。', '顏面等顱延髓肌的 MUAP 時間通常比肢體肌短。'],
    anatomyPoints: ['額肌很薄，必須沿切線進針。'],
  }),
  defineGuide({
    chineseName: '頦肌', englishName: 'Mentalis',
    catalogNames: ['Mentalis'], figures: [62],
    innervation: '顏面神經下頷支（mandibular branch of facial nerve，CN VII）與延髓－腦橋交界。',
    insertion: '在下巴表淺地沿切線進針。',
    activation: '請病人噘嘴。',
    clinicalPoints: ['可評估貝爾氏麻痺。', '疑似運動神經元疾病時很有用。', '顏面等顱延髓肌的 MUAP 時間通常比肢體肌短。'],
    anatomyPoints: ['肌肉很薄，位於下頷骨表淺，必須沿切線進針。'],
  }),
  defineGuide({
    chineseName: '眼輪匝肌', englishName: 'Orbicularis Oculi',
    catalogNames: ['Orbicularis Oculi'], figures: [63],
    innervation: '顏面神經顳支（temporal branch of facial nerve，CN VII）與延髓－腦橋交界。',
    insertion: '在眼眶下緣外側沿切線進針，針尖方向須遠離眼球。',
    activation: '請病人用力閉眼。',
    clinicalPoints: ['可評估貝爾氏麻痺。', '顏面等顱延髓肌的 MUAP 時間通常比肢體肌短。'],
    anatomyPoints: ['肌肉很薄，必須沿切線進針。'],
  }),
]

const guidesByCatalogName = new Map<string, NeedleGuide[]>()

for (const guide of needleGuides) {
  for (const name of guide.catalogNames) {
    const current = guidesByCatalogName.get(name) ?? []
    current.push(guide)
    guidesByCatalogName.set(name, current)
  }
}

export function needleGuidesForMuscle(name: string): NeedleGuide[] {
  return guidesByCatalogName.get(name) ?? []
}

export function hasNeedleGuideImage(name: string): boolean {
  return needleGuidesForMuscle(name).some((guide) => guide.images.length > 0)
}

export function hasTextbookNeedleGuide(name: string): boolean {
  return needleGuidesForMuscle(name).some((guide) => guide.sourceKind === 'textbook')
}
