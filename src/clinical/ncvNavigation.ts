export type NcvCategory = 'upper' | 'lower' | 'face' | 'special'

export interface NcvNavigationEntry {
  studyId: string
  listTitle: string
  listSubtitle: string
}

export interface NcvNavigationGroup {
  id: string
  title: string
  description: string
  entries: NcvNavigationEntry[]
}

export const ncvCategoryOptions: Array<{ value: NcvCategory; label: string }> = [
  { value: 'upper', label: '上肢' },
  { value: 'lower', label: '下肢' },
  { value: 'face', label: '臉' },
  { value: 'special', label: '特殊' },
]

export const ncvNavigationGroups: Record<NcvCategory, NcvNavigationGroup[]> = {
  upper: [
    {
      id: 'upper-motor',
      title: 'Motor',
      description: 'Median · Ulnar · Radial',
      entries: [
        { studyId: 'median-motor-apb', listTitle: 'Median Motor Study', listSubtitle: '正中神經運動傳導' },
        { studyId: 'ulnar-motor-adm', listTitle: 'Ulnar Motor Study', listSubtitle: '尺神經運動傳導' },
        { studyId: 'radial-motor-eip', listTitle: 'Radial Motor Study', listSubtitle: '橈神經運動傳導' },
      ],
    },
    {
      id: 'upper-sensory',
      title: 'Sensory',
      description: 'Median · Ulnar · Radial',
      entries: [
        { studyId: 'median-sensory-digit', listTitle: 'Median Sensory Study', listSubtitle: '正中神經感覺傳導' },
        { studyId: 'ulnar-sensory-digit5', listTitle: 'Ulnar Sensory Study', listSubtitle: '尺神經感覺傳導' },
        { studyId: 'radial-sensory', listTitle: 'Radial Sensory Study', listSubtitle: '橈神經感覺傳導' },
      ],
    },
    {
      id: 'upper-addon',
      title: '加做',
      description: '局部節段、比較與少用神經',
      entries: [
        { studyId: 'median-motor-palmar', listTitle: 'Median Motor — Palmar Segment', listSubtitle: '正中神經掌段運動傳導' },
        { studyId: 'median-sensory-palmar', listTitle: 'Median Sensory — Palmar Segment', listSubtitle: '正中神經掌段感覺傳導' },
        { studyId: 'dorsal-ulnar-cutaneous', listTitle: 'Dorsal Ulnar Cutaneous Sensory', listSubtitle: '尺背皮神經感覺傳導' },
        { studyId: 'ulnar-motor-fdi', listTitle: 'Deep Ulnar Motor Branch', listSubtitle: '尺神經深支運動傳導' },
        { studyId: 'median-ulnar-lumbrical', listTitle: 'Median–Ulnar Motor Comparison', listSubtitle: '正中－尺神經運動比較' },
        { studyId: 'median-ulnar-digit4', listTitle: 'Median–Ulnar D4 Sensory Comparison', listSubtitle: '正中－尺神經 D4 感覺比較' },
        { studyId: 'median-radial-digit1', listTitle: 'Median–Radial D1 Sensory Comparison', listSubtitle: '正中－橈神經 D1 感覺比較' },
        { studyId: 'median-ulnar-palmar-mixed', listTitle: 'Median–Ulnar Palmar Mixed Comparison', listSubtitle: '正中－尺神經掌部混合比較' },
        { studyId: 'mabc-sensory', listTitle: 'Medial Antebrachial Cutaneous Sensory', listSubtitle: '內側前臂皮神經感覺傳導' },
        { studyId: 'labc-sensory', listTitle: 'Lateral Antebrachial Cutaneous Sensory', listSubtitle: '外側前臂皮神經感覺傳導' },
      ],
    },
  ],
  lower: [
    {
      id: 'lower-routine',
      title: '常做',
      description: 'Tibial · Peroneal · Sural · H reflex',
      entries: [
        { studyId: 'tibial-motor-ahb', listTitle: 'Tibial Motor Study', listSubtitle: '脛神經運動傳導' },
        { studyId: 'peroneal-motor-edb', listTitle: 'Peroneal Motor — Distal Study', listSubtitle: '腓總神經遠端運動傳導' },
        { studyId: 'peroneal-motor-ta', listTitle: 'Peroneal Motor — Across Fibular Head', listSubtitle: '腓總神經跨腓骨頭運動傳導' },
        { studyId: 'superficial-peroneal-sensory', listTitle: 'Superficial Peroneal Sensory Study', listSubtitle: '腓淺神經感覺傳導' },
        { studyId: 'sural-sensory', listTitle: 'Sural Sensory Study', listSubtitle: '腓腸神經感覺傳導' },
        { studyId: 'soleus-h-reflex', listTitle: 'H Reflex', listSubtitle: 'H 反射' },
      ],
    },
    {
      id: 'lower-addon',
      title: '加做',
      description: '股神經、皮神經與足底研究',
      entries: [
        { studyId: 'femoral-motor', listTitle: 'Femoral Motor Study', listSubtitle: '股神經運動傳導' },
        { studyId: 'saphenous-sensory', listTitle: 'Saphenous Sensory Study', listSubtitle: '隱神經感覺傳導' },
        { studyId: 'lateral-femoral-cutaneous', listTitle: 'Lateral Femoral Cutaneous Sensory', listSubtitle: '股外側皮神經感覺傳導' },
        { studyId: 'plantar-motor', listTitle: 'Plantar Motor Studies', listSubtitle: '內／外側足底神經運動傳導' },
        { studyId: 'plantar-sensory', listTitle: 'Plantar Sensory Studies', listSubtitle: '內／外側足底神經感覺傳導' },
        { studyId: 'plantar-mixed', listTitle: 'Plantar Mixed Studies', listSubtitle: '內／外側足底神經混合傳導' },
      ],
    },
  ],
  face: [
    {
      id: 'face-motor',
      title: 'Motor',
      description: 'Facial nerve',
      entries: [
        { studyId: 'facial-motor', listTitle: 'Facial Motor Study', listSubtitle: '顏面神經運動傳導' },
        { studyId: 'facial-motor-branches', listTitle: 'Facial Motor — Branch Studies', listSubtitle: '顏面神經分支運動傳導' },
      ],
    },
    {
      id: 'face-reflex',
      title: 'Reflex',
      description: 'Trigeminal–facial pathway',
      entries: [
        { studyId: 'blink-reflex', listTitle: 'Blink Reflex', listSubtitle: '眨眼反射' },
      ],
    },
  ],
  special: [
    {
      id: 'special-proximal',
      title: 'Proximal & Respiratory',
      description: 'Erb’s point · Phrenic',
      entries: [
        { studyId: 'upper-proximal-stimulation', listTitle: 'Erb’s Point / Root Stimulation', listSubtitle: 'Erb 點／神經根刺激' },
        { studyId: 'phrenic-motor', listTitle: 'Phrenic Motor Study', listSubtitle: '膈神經運動傳導' },
      ],
    },
    {
      id: 'special-late-response',
      title: 'Late Response',
      description: 'F response',
      entries: [
        { studyId: 'f-wave', listTitle: 'F Response', listSubtitle: 'F 波' },
      ],
    },
  ],
}

export const ncvNavigationEntries = Object.values(ncvNavigationGroups)
  .flatMap((groups) => groups)
  .flatMap((group) => group.entries)
