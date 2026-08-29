export type SupplementalNeedleMediaKind = 'anatomy' | 'surface-landmark' | 'ultrasound'

export interface SupplementalNeedleMedia {
  src: string
  alt: string
  caption: string
  kind: SupplementalNeedleMediaKind
  credit: {
    label: string
    url: string
    license: string
    licenseUrl: string
  }
}

interface CommonsMediaOptions {
  fileName: string
  alt: string
  caption: string
  credit?: string
  license?: string
  licenseUrl?: string
}

const publicDomainMark = 'https://creativecommons.org/publicdomain/mark/1.0/'

const commonsFilePathByName: Record<string, string> = {
  'Fibularis brevis muscle - posterior view.png': 'a/a0',
  'Flexor digitorum brevis.png': '6/69',
  'Gluteus minimus muscle.PNG': 'e/eb',
  'Gray — musculus abductor pollicis longus.png': '6/61',
  'Gray — musculus adductor pollicis.png': '2/28',
  'Gray — musculus brachialis.png': 'e/e3',
  'Gray — musculus coracobrachialis.png': 'a/a3',
  'Gray — musculus extensor carpi radialis brevis.png': 'f/f8',
  'Gray — musculus extensor pollicis brevis.png': 'f/f7',
  'Gray — musculus extensor pollicis longus.png': '8/80',
  'Gray — musculus interossei palmares.png': '1/11',
  'Gray — musculus lumbricales.png': '8/82',
  'Gray — musculus nasalis.png': 'a/a6',
  'Gray — musculus orbicularis oris.png': '5/5f',
  'Gray — musculus palmaris longus.png': '6/6b',
  'Gray — musculus subscapularis.png': '8/8e',
  'Gray — musculus supinator.png': 'f/f0',
  'Gray — musculus temporalis.png': '3/35',
  'Gray — musculus teres major.png': 'c/c2',
  'Gray407.png': 'b/ba',
  'Gray411subclavius.png': 'a/a2',
  'Gray437-Musculus extensor hallucis brevis.png': '9/95',
  'Gray439-Musculus flexor hallucis longus.png': '9/9d',
  'Gray439-Musculus popliteus.png': '4/4a',
  'Gray446.png': '5/57',
  'Gray447.png': '2/21',
  'Levator scapulae.png': 'b/bc',
  'Muscles of the male perineum-Gray406.png': 'b/b5',
  'Obturator externus.png': '6/6d',
  'Pectineus.png': '4/47',
  'Pectoralis minor.png': '5/5d',
  'Quadratus femoris muscle.jpg': '1/16',
  'Sartorius.png': 'a/af',
}

function commonsMedia({
  fileName,
  alt,
  caption,
  credit = 'Henry Vandyke Carter／Wikimedia Commons',
  license = 'Public Domain',
  licenseUrl = publicDomainMark,
}: CommonsMediaOptions): SupplementalNeedleMedia {
  const filePath = commonsFilePathByName[fileName]
  if (!filePath) throw new Error(`Missing Wikimedia Commons path for ${fileName}`)
  const encodedFileName = encodeURIComponent(fileName.replaceAll(' ', '_'))
  const sourceTitle = encodeURIComponent(fileName.replaceAll(' ', '_'))
  return {
    src: `https://upload.wikimedia.org/wikipedia/commons/${filePath}/${encodedFileName}`,
    alt,
    caption,
    kind: 'anatomy',
    credit: {
      label: credit,
      url: `https://commons.wikimedia.org/wiki/File:${sourceTitle}`,
      license,
      licenseUrl,
    },
  }
}

function saddlerFigure(
  fileName: string,
  figureId: string,
  alt: string,
  caption: string,
): SupplementalNeedleMedia {
  return {
    src: `https://pmc.ncbi.nlm.nih.gov/articles/instance/12803594/bin/${fileName}`,
    alt,
    caption,
    kind: 'ultrasound',
    credit: {
      label: 'Saddler et al., Muscle & Nerve (2026)',
      url: `https://pmc.ncbi.nlm.nih.gov/articles/PMC12803594/#${figureId}`,
      license: 'CC BY-NC 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/',
    },
  }
}

const brachialisSurface: SupplementalNeedleMedia = {
  src: 'https://pmc.ncbi.nlm.nih.gov/articles/instance/6921208/bin/gr3.jpg',
  alt: 'Brachialis 表面 landmark 與建議進針方向',
  caption: '肱肌的表面定位、進針方向與鄰近肱二頭肌位置。',
  kind: 'surface-landmark',
  credit: {
    label: 'Menkes & Pierce, Clinical Neurophysiology Practice (2019), Fig. 3',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6921208/#f0015',
    license: 'CC BY-NC-ND 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  },
}

const deepHipRotators: SupplementalNeedleMedia = {
  src: 'https://www.ncbi.nlm.nih.gov/books/NBK557420/bin/Gemelli_Muscles-01.jpg',
  alt: 'Piriformis、Obturator Internus、Gemelli 與 Quadratus Femoris 解剖關係',
  caption: '短外旋肌群的後側解剖關係：Piriformis、Obturator Internus、Gemelli 與 Quadratus Femoris。',
  kind: 'anatomy',
  credit: {
    label: 'Lezak & Massel／StatPearls Publishing (2026)',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK557420/figure/article-35961.image.f3/',
    license: 'CC BY-NC-ND 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  },
}

const shoulderUltrasound = saddlerFigure(
  'MUS-73-133-g001.jpg',
  'mus70100-fig-0001',
  '肩部肌肉的探頭位置、橫切面與 ultrasound 對照',
  '肩部橫切面與 ultrasound 對照；圖中標出 Subscapularis（SC）與 Teres Major（TMa），可用於辨認鄰近構造。',
)

const brachialisUltrasound = saddlerFigure(
  'MUS-73-133-g005.jpg',
  'mus70100-fig-0003',
  'Brachialis 橫向及縱向 ultrasound 定位',
  '肱肌的探頭位置、橫向與縱向 ultrasound，並標示 brachial artery、median nerve 與鄰肌。',
)

const lateralForearmUltrasound = saddlerFigure(
  'MUS-73-133-g008.jpg',
  'mus70100-fig-0004',
  'Supinator 與 ECRB ultrasound 定位',
  'Supinator 與 ECRB 的探頭位置和橫切面；圖中同時標示 PIN、radial artery 與鄰近前臂肌。',
)

const forearmCrossSection = saddlerFigure(
  'MUS-73-133-g009.jpg',
  'mus70100-fig-0005',
  '前臂橫切面與 ultrasound 肌肉標示',
  '前臂橫切面與 ultrasound 對照；含 APL、EPL、EPB 與 Palmaris Longus 標示，供辨認層次與鄰肌。',
)

const fhlUltrasound = saddlerFigure(
  'MUS-73-133-g002.jpg',
  'mus70100-fig-0008',
  'Flexor Hallucis Longus ultrasound 定位',
  'FHL 的探頭位置與橫切面；並標出 tibial nerve、fibular nerve、Peroneus Brevis 與深層鄰肌。',
)

const medialThighUltrasound = saddlerFigure(
  'MUS-73-133-g003.jpg',
  'mus70100-fig-0009',
  '大腿中段橫切面與 ultrasound 肌肉標示',
  '大腿中段橫切面與 ultrasound 對照；圖中標出 Sartorius（Sr.）與周圍內收肌、股四頭肌及 hamstrings。',
)

export const supplementalNeedleMediaByGuideId: Record<string, SupplementalNeedleMedia[]> = {
  'supplement-orbicularis-oris': [commonsMedia({
    fileName: 'Gray — musculus orbicularis oris.png',
    alt: 'Orbicularis Oris 解剖位置',
    caption: 'Orbicularis Oris 的表面解剖範圍。',
  })],
  'supplement-nasalis': [commonsMedia({
    fileName: 'Gray — musculus nasalis.png',
    alt: 'Nasalis 解剖位置',
    caption: 'Nasalis 的鼻部解剖範圍。',
  })],
  'supplement-temporalis': [commonsMedia({
    fileName: 'Gray — musculus temporalis.png',
    alt: 'Temporalis 解剖位置',
    caption: 'Temporalis 的顳窩解剖範圍。',
  })],
  'supplement-levator-scapulae': [commonsMedia({
    fileName: 'Levator scapulae.png',
    alt: 'Levator Scapulae 解剖位置',
    caption: 'Levator Scapulae 由上頸椎至肩胛骨上角的走向。',
    credit: 'Uwe Gille／Wikimedia Commons',
  })],
  'supplement-subclavius': [commonsMedia({
    fileName: 'Gray411subclavius.png',
    alt: 'Subclavius 解剖位置',
    caption: 'Subclavius 位於鎖骨深面、第一肋上方。',
  })],
  'supplement-pectoralis-minor': [commonsMedia({
    fileName: 'Pectoralis minor.png',
    alt: 'Pectoralis Minor 解剖位置',
    caption: 'Pectoralis Minor 由第 3–5 肋骨走向 coracoid process。',
    credit: 'Chrizz／Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  })],
  'supplement-subscapularis': [commonsMedia({
    fileName: 'Gray — musculus subscapularis.png',
    alt: 'Subscapularis 解剖位置',
    caption: 'Subscapularis 位於肩胛骨前面並止於肱骨小結節。',
  }), shoulderUltrasound],
  'supplement-teres-major': [commonsMedia({
    fileName: 'Gray — musculus teres major.png',
    alt: 'Teres Major 解剖位置',
    caption: 'Teres Major 由肩胛骨下角走向肱骨內側。',
  }), shoulderUltrasound],
  'supplement-brachialis': [commonsMedia({
    fileName: 'Gray — musculus brachialis.png',
    alt: 'Brachialis 解剖位置',
    caption: 'Brachialis 位於 Biceps Brachii 深層、覆蓋肱骨遠端前面。',
  }), brachialisSurface, brachialisUltrasound],
  'supplement-coracobrachialis': [commonsMedia({
    fileName: 'Gray — musculus coracobrachialis.png',
    alt: 'Coracobrachialis 解剖位置',
    caption: 'Coracobrachialis 由 coracoid process 走向肱骨內側中段。',
  })],
  'supplement-ecrb': [commonsMedia({
    fileName: 'Gray — musculus extensor carpi radialis brevis.png',
    alt: 'Extensor Carpi Radialis Brevis 解剖位置',
    caption: 'ECRB 位於近端背外側前臂，遠端肌腱止於第三掌骨。',
  }), lateralForearmUltrasound],
  'supplement-supinator': [commonsMedia({
    fileName: 'Gray — musculus supinator.png',
    alt: 'Supinator 解剖位置',
    caption: 'Supinator 包繞近端橈骨，PIN 穿行其肌層。',
  }), lateralForearmUltrasound],
  'supplement-apl': [commonsMedia({
    fileName: 'Gray — musculus abductor pollicis longus.png',
    alt: 'Abductor Pollicis Longus 解剖位置',
    caption: 'APL 位於背側深層前臂，肌腱通過第一伸肌腱室。',
  }), forearmCrossSection],
  'supplement-epl': [commonsMedia({
    fileName: 'Gray — musculus extensor pollicis longus.png',
    alt: 'Extensor Pollicis Longus 解剖位置',
    caption: 'EPL 位於背側深層前臂，肌腱繞過 Lister tubercle。',
  }), forearmCrossSection],
  'supplement-epb': [commonsMedia({
    fileName: 'Gray — musculus extensor pollicis brevis.png',
    alt: 'Extensor Pollicis Brevis 解剖位置',
    caption: 'EPB 位於背側深層前臂，與 APL 同走第一伸肌腱室。',
  }), forearmCrossSection],
  'supplement-palmaris-longus': [commonsMedia({
    fileName: 'Gray — musculus palmaris longus.png',
    alt: 'Palmaris Longus 解剖位置',
    caption: 'Palmaris Longus 位於前臂前側淺層，肌腱走向 palmar aponeurosis。',
  }), forearmCrossSection],
  'supplement-lumbricals-hand': [commonsMedia({
    fileName: 'Gray — musculus lumbricales.png',
    alt: '手部 Lumbricals 解剖位置',
    caption: '手部 Lumbricals 與 flexor digitorum profundus 肌腱的關係。',
  })],
  'supplement-palmar-interossei': [commonsMedia({
    fileName: 'Gray — musculus interossei palmares.png',
    alt: 'Palmar Interossei 解剖位置',
    caption: 'Palmar Interossei 位於掌骨間隙的掌側。',
  })],
  'supplement-adductor-pollicis': [commonsMedia({
    fileName: 'Gray — musculus adductor pollicis.png',
    alt: 'Adductor Pollicis 解剖位置',
    caption: 'Adductor Pollicis 的 oblique 與 transverse heads。',
  })],
  'supplement-sartorius': [commonsMedia({
    fileName: 'Sartorius.png',
    alt: 'Sartorius 解剖位置',
    caption: 'Sartorius 由 ASIS 斜向內下方至 pes anserinus。',
    credit: 'Uwe Gille／Wikimedia Commons',
  }), medialThighUltrasound],
  'supplement-pectineus': [commonsMedia({
    fileName: 'Pectineus.png',
    alt: 'Pectineus 解剖位置',
    caption: 'Pectineus 位於股三角底部、Adductor Longus 的外側近端。',
    credit: 'Uwe Gille／Wikimedia Commons',
  })],
  'supplement-obturator-externus': [commonsMedia({
    fileName: 'Obturator externus.png',
    alt: 'Obturator Externus 解剖位置',
    caption: 'Obturator Externus 由閉孔外面走向股骨轉子窩。',
    credit: 'Mikael Häggström／Wikimedia Commons',
  })],
  'supplement-gluteus-minimus': [commonsMedia({
    fileName: 'Gluteus minimus muscle.PNG',
    alt: 'Gluteus Minimus 解剖位置',
    caption: 'Gluteus Minimus 位於 Gluteus Medius 深層並止於 greater trochanter。',
    credit: 'Mikael Häggström／Wikimedia Commons',
  })],
  'supplement-piriformis': [deepHipRotators],
  'supplement-obturator-internus-gemelli': [deepHipRotators],
  'supplement-quadratus-femoris': [commonsMedia({
    fileName: 'Quadratus femoris muscle.jpg',
    alt: 'Quadratus Femoris 解剖位置',
    caption: 'Quadratus Femoris 位於 inferior gemellus 下方、ischial tuberosity 與 intertrochanteric crest 之間。',
    credit: 'Anatomist90／Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  }), deepHipRotators],
  'supplement-ehb': [commonsMedia({
    fileName: 'Gray437-Musculus extensor hallucis brevis.png',
    alt: 'Extensor Hallucis Brevis 解剖位置',
    caption: 'EHB 位於足背，與 Extensor Digitorum Brevis 的內側部分相連。',
  })],
  'supplement-peroneus-brevis': [commonsMedia({
    fileName: 'Fibularis brevis muscle - posterior view.png',
    alt: 'Peroneus Brevis 解剖位置',
    caption: 'Peroneus Brevis 位於外側小腿深於 Peroneus Longus，肌腱止於第五蹠骨基部。',
    credit: 'DBCLS／Wikimedia Commons',
    license: 'CC BY-SA 2.1 JP',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en',
  }), fhlUltrasound],
  'supplement-popliteus': [commonsMedia({
    fileName: 'Gray439-Musculus popliteus.png',
    alt: 'Popliteus 解剖位置',
    caption: 'Popliteus 位於膝後深層、由 lateral femoral condyle 走向 proximal posterior tibia。',
  })],
  'supplement-fhl': [commonsMedia({
    fileName: 'Gray439-Musculus flexor hallucis longus.png',
    alt: 'Flexor Hallucis Longus 解剖位置',
    caption: 'FHL 位於小腿深後區的外側，鄰近 fibula 與 tibial neurovascular bundle。',
  }), fhlUltrasound],
  'supplement-fdb': [commonsMedia({
    fileName: 'Flexor digitorum brevis.png',
    alt: 'Flexor Digitorum Brevis 解剖位置',
    caption: 'FDB 位於足底第一層中央，表面覆蓋 plantar aponeurosis。',
    credit: 'Uwe Gille／Wikimedia Commons',
  })],
  'supplement-foot-interossei': [commonsMedia({
    fileName: 'Gray446.png',
    alt: '足部 Dorsal Interossei 解剖位置',
    caption: '足部 Dorsal Interossei 與蹠骨間隙的關係。',
  }), commonsMedia({
    fileName: 'Gray447.png',
    alt: '足部 Plantar Interossei 解剖位置',
    caption: '足部 Plantar Interossei 位於第 3–5 蹠骨的內側。',
  })],
  'supplement-eas': [commonsMedia({
    fileName: 'Muscles of the male perineum-Gray406.png',
    alt: 'External Anal Sphincter 與男性會陰表面解剖',
    caption: '男性會陰淺層解剖，可見 External Anal Sphincter 與周圍會陰肌。',
  })],
  'supplement-bulbocavernosus': [commonsMedia({
    fileName: 'Gray407.png',
    alt: 'Bulbocavernosus 與女性會陰表面解剖',
    caption: '女性會陰淺層解剖，可見 Bulbocavernosus／Bulbospongiosus 與周圍構造。',
  })],
}
