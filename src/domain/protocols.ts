/**
 * Starting muscle sets for a planned study.
 *
 * A protocol is a starting point, not a prescription. Each entry names why the
 * muscle is in the set, because the reason is the teaching content: a set that
 * only confirms a hypothesis cannot refute it, so every protocol carries
 * muscles chosen to test the alternatives as well.
 */

export type MuscleRole = 'confirm' | 'exclude' | 'preganglionic'

export type ProtocolCategory =
  | 'radiculopathy'
  | 'mononeuropathy'
  | 'plexopathy'
  | 'screen'

export interface ProtocolMuscle {
  name: string
  role: MuscleRole
  /** Why this muscle earns a place in the set. */
  rationale: string
}

export interface Protocol {
  id: string
  label: string
  category: ProtocolCategory
  summary: string
  muscles: ProtocolMuscle[]
}

export const roleLabels: Record<MuscleRole, string> = {
  confirm: '驗證',
  exclude: '排除',
  preganglionic: '定位層級',
}

const paraspinal = (root: string, rationale: string): ProtocolMuscle => ({
  name: root.startsWith('C') ? 'Paraspinal (Cervical)' : `Paraspinal (${root})`,
  role: 'preganglionic',
  rationale,
})

export const protocols: Protocol[] = [
  {
    id: 'radic-c5',
    label: 'C5 radiculopathy',
    category: 'radiculopathy',
    summary:
      '取三條不同 peripheral nerve 但共用 C5 的肌肉，交集才指向 root；再以 C6–C7 肌肉界定上下邊界。',
    muscles: [
      { name: 'Deltoid (Ant/Mid/Post)', role: 'confirm', rationale: 'Axillary N.，posterior cord' },
      { name: 'Biceps Brachii', role: 'confirm', rationale: 'Musculocutaneous，lateral cord' },
      { name: 'Infraspinatus', role: 'confirm', rationale: 'Suprascapular N.，upper trunk' },
      {
        name: 'Rhomboid Major/Minor',
        role: 'preganglionic',
        rationale: 'Dorsal scapular N. 在 plexus 之前離開 C5，異常指向 root 或更近端',
      },
      { name: 'Pronator Teres', role: 'exclude', rationale: '界定下邊界（C6–C7）' },
      { name: 'Triceps Brachii', role: 'exclude', rationale: '界定下邊界（C7 為主）' },
      paraspinal('C5', 'Posterior ramus 在 DRG 之前分出，異常指向椎管內病灶'),
    ],
  },
  {
    id: 'radic-c6',
    label: 'C6 radiculopathy',
    category: 'radiculopathy',
    summary:
      'C6 同時經 lateral cord 與 posterior cord，需跨神經取樣；C5 與 C7 肌肉用來界定節段邊界。',
    muscles: [
      { name: 'Biceps Brachii', role: 'confirm', rationale: 'Musculocutaneous，lateral cord' },
      { name: 'Brachioradialis', role: 'confirm', rationale: 'Radial N.，posterior cord' },
      { name: 'Pronator Teres', role: 'confirm', rationale: 'Median N.，lateral cord' },
      { name: 'Extensor Carpi Rad. Longus', role: 'confirm', rationale: 'Radial N.，C6–C7' },
      { name: 'Deltoid (Ant/Mid/Post)', role: 'exclude', rationale: '界定上邊界（C5–C6）' },
      { name: 'Triceps Brachii', role: 'exclude', rationale: '界定下邊界（C7 為主）' },
      { name: 'First Dorsal Interosseous', role: 'exclude', rationale: '排除 C8–T1 與 ulnar' },
      paraspinal('C6', 'Posterior ramus 在 DRG 之前分出，異常指向椎管內病灶'),
    ],
  },
  {
    id: 'radic-c7',
    label: 'C7 radiculopathy',
    category: 'radiculopathy',
    summary: 'C7 幾乎等同 middle trunk，因此 paraspinal 與 serratus anterior 是區分 root 與 trunk 的關鍵。',
    muscles: [
      { name: 'Triceps Brachii', role: 'confirm', rationale: 'Radial N.，posterior cord' },
      { name: 'Anconeus', role: 'confirm', rationale: 'Radial N.' },
      { name: 'Flexor Carpi Radialis', role: 'confirm', rationale: 'Median N.，lateral cord' },
      { name: 'Extensor Digitorum Communis', role: 'confirm', rationale: 'PIN，C7–C8' },
      {
        name: 'Serratus Anterior',
        role: 'preganglionic',
        rationale: 'Long thoracic N. 在 plexus 之前離開 C5–C7',
      },
      { name: 'Biceps Brachii', role: 'exclude', rationale: '界定上邊界（C5–C6）' },
      { name: 'First Dorsal Interosseous', role: 'exclude', rationale: '界定下邊界（C8–T1）' },
      paraspinal('C7', 'Posterior ramus 在 DRG 之前分出，異常指向椎管內病灶'),
    ],
  },
  {
    id: 'radic-c8',
    label: 'C8 radiculopathy',
    category: 'radiculopathy',
    summary:
      'C8 病灶與 lower trunk、medial cord、ulnar neuropathy 高度重疊。EIP 屬 posterior cord，是拆開它們的關鍵一針。',
    muscles: [
      { name: 'First Dorsal Interosseous', role: 'confirm', rationale: 'Ulnar N.，medial cord' },
      { name: 'Abd. Pollicis Brevis', role: 'confirm', rationale: 'Median N.，medial cord' },
      {
        name: 'Extensor Indicis Proprius',
        role: 'confirm',
        rationale: 'PIN，posterior cord — 異常則排除 medial cord 與 ulnar neuropathy',
      },
      { name: 'Flexor Pollicis Longus', role: 'confirm', rationale: 'AIN，C7–C8' },
      { name: 'Flexor Carpi Ulnaris', role: 'confirm', rationale: 'Ulnar N. 前臂段' },
      { name: 'Triceps Brachii', role: 'exclude', rationale: '界定上邊界（C7 為主）' },
      paraspinal('C8', 'Posterior ramus 在 DRG 之前分出，異常指向椎管內病灶'),
    ],
  },
  {
    id: 'radic-l4',
    label: 'L4 radiculopathy',
    category: 'radiculopathy',
    summary: 'Femoral 與 obturator 神經共用 L4，兩者皆異常才指向 root 而非單一 peripheral nerve。',
    muscles: [
      { name: 'Quadriceps (Vastus/Rectus)', role: 'confirm', rationale: 'Femoral N.' },
      {
        name: 'Adductor Longus/Brevis',
        role: 'confirm',
        rationale: 'Obturator N. — 與 quadriceps 同時異常才排除單一 femoral neuropathy',
      },
      { name: 'Tibialis Anterior', role: 'confirm', rationale: 'Deep peroneal N.，L4–L5' },
      { name: 'Iliopsoas', role: 'confirm', rationale: 'Femoral N.，L1–L3' },
      { name: 'Gluteus Medius', role: 'exclude', rationale: '界定下邊界（L4–S1）' },
      paraspinal('L4', 'Posterior ramus 在 DRG 之前分出，異常指向椎管內病灶'),
    ],
  },
  {
    id: 'radic-l5',
    label: 'L5 radiculopathy',
    category: 'radiculopathy',
    summary:
      '重點在證明病灶超出 peroneal 分布：tibialis posterior（tibial）與 gluteus medius（superior gluteal）都是 L5 但不經 peroneal nerve。',
    muscles: [
      { name: 'Tibialis Anterior', role: 'confirm', rationale: 'Deep peroneal N.' },
      { name: 'Peroneus Longus', role: 'confirm', rationale: 'Superficial peroneal N.' },
      {
        name: 'Tibialis Posterior',
        role: 'confirm',
        rationale: 'Tibial N. 的 L5 肌肉 — 異常則排除 peroneal neuropathy',
      },
      {
        name: 'Gluteus Medius',
        role: 'confirm',
        rationale: 'Superior gluteal N. — 異常則排除 sciatic 以下病灶',
      },
      { name: 'Biceps Femoris (Short Head)', role: 'confirm', rationale: 'Sciatic 的 peroneal division' },
      { name: 'Gastrocnemius (Med/Lat)', role: 'exclude', rationale: '界定下邊界（S1–S2）' },
      paraspinal('L5', 'Posterior ramus 在 DRG 之前分出，異常指向椎管內病灶'),
    ],
  },
  {
    id: 'radic-s1',
    label: 'S1 radiculopathy',
    category: 'radiculopathy',
    summary: 'Gluteus major（inferior gluteal）異常可把病灶推到 sciatic 之上，是本套餐的關鍵一針。',
    muscles: [
      { name: 'Gastrocnemius (Med/Lat)', role: 'confirm', rationale: 'Tibial N.，S1–S2' },
      { name: 'Soleus', role: 'confirm', rationale: 'Tibial N.，S1–S2' },
      { name: 'Abductor Hallucis', role: 'confirm', rationale: 'Medial plantar N.' },
      {
        name: 'Gluteus Major',
        role: 'confirm',
        rationale: 'Inferior gluteal N. — 異常則排除 sciatic 以下病灶',
      },
      { name: 'Biceps Femoris (Long Head)', role: 'confirm', rationale: 'Sciatic 的 tibial division' },
      { name: 'Tibialis Anterior', role: 'exclude', rationale: '界定上邊界（L4–L5）' },
      paraspinal('S1', 'Posterior ramus 在 DRG 之前分出，異常指向椎管內病灶'),
    ],
  },
  {
    id: 'mono-ulnar-elbow',
    label: 'Ulnar neuropathy at elbow',
    category: 'mononeuropathy',
    summary:
      'FCU 與 FDP(3,4) 界定病灶是否在前臂段之上；APB 與 EIP 正常才把病灶限縮在 ulnar nerve 而非 C8 / lower trunk。',
    muscles: [
      { name: 'First Dorsal Interosseous', role: 'confirm', rationale: 'Ulnar N. 手內在肌' },
      { name: 'Abd. Digiti Minimi', role: 'confirm', rationale: 'Ulnar N. 手內在肌' },
      {
        name: 'Flexor Carpi Ulnaris',
        role: 'confirm',
        rationale: '前臂段 — 異常指向 elbow 或更近端',
      },
      { name: 'Flexor Digitorum Profundus (3,4)', role: 'confirm', rationale: '前臂段，ulnar' },
      {
        name: 'Abd. Pollicis Brevis',
        role: 'exclude',
        rationale: 'Median C8–T1 — 正常才排除 lower trunk 與 C8',
      },
      {
        name: 'Extensor Indicis Proprius',
        role: 'exclude',
        rationale: 'PIN，posterior cord — 正常才排除 C8 root',
      },
      paraspinal('C8', '正常則進一步支持 postganglionic 病灶'),
    ],
  },
  {
    id: 'mono-cts',
    label: 'Carpal tunnel syndrome',
    category: 'mononeuropathy',
    summary:
      'CTS 的診斷依據是 NCS，本工具不涵蓋。針極的角色是評估軸突喪失程度並排除近端病灶；前臂 median 肌肉正常才把病灶限縮在腕隧道。',
    muscles: [
      { name: 'Abd. Pollicis Brevis', role: 'confirm', rationale: '腕隧道遠端的 median 肌肉' },
      {
        name: 'Pronator Teres',
        role: 'exclude',
        rationale: '前臂 median — 正常才把病灶限縮在腕部以遠',
      },
      { name: 'Flexor Pollicis Longus', role: 'exclude', rationale: 'AIN — 正常才排除前臂 median 病灶' },
      {
        name: 'First Dorsal Interosseous',
        role: 'exclude',
        rationale: 'Ulnar C8–T1 — 正常才排除 lower trunk 與 C8',
      },
      { name: 'Extensor Indicis Proprius', role: 'exclude', rationale: 'PIN — 正常才排除 C8 root' },
      paraspinal('C8', '正常則進一步支持 postganglionic 病灶'),
    ],
  },
  {
    id: 'mono-peroneal-fibular',
    label: 'Peroneal neuropathy at fibular head',
    category: 'mononeuropathy',
    summary:
      'Biceps femoris short head 是唯一在腓骨頭之上、由 peroneal division 支配的肌肉，正常才把病灶定在 fibular head。',
    muscles: [
      { name: 'Tibialis Anterior', role: 'confirm', rationale: 'Deep peroneal N.' },
      { name: 'Extensor Digitorum Brevis', role: 'confirm', rationale: 'Deep peroneal N. 遠端' },
      {
        name: 'Peroneus Longus',
        role: 'confirm',
        rationale: 'Superficial peroneal N. — 區分 deep peroneal 與 common peroneal',
      },
      {
        name: 'Biceps Femoris (Short Head)',
        role: 'exclude',
        rationale: '腓骨頭之上的 peroneal division — 正常才把病灶定在 fibular head',
      },
      {
        name: 'Tibialis Posterior',
        role: 'exclude',
        rationale: 'Tibial 的 L5 肌肉 — 正常才排除 L5 radiculopathy',
      },
      { name: 'Gluteus Medius', role: 'exclude', rationale: 'Superior gluteal L5 — 正常才排除 L5 root' },
      paraspinal('L5', '正常則進一步支持 postganglionic 病灶'),
    ],
  },
  {
    id: 'bpi-preganglionic',
    label: 'BPI — preganglionic screen',
    category: 'plexopathy',
    summary:
      'BPI 的第一個問題是 preganglionic 還是 postganglionic。以下肌肉的神經在 plexus 之前離開 root：異常指向 root 或更近端（含 avulsion），正常則偏向 postganglionic。此判斷影響手術可行性。',
    muscles: [
      paraspinal('Cervical', 'C5–C8 posterior rami 在 DRG 之前分出'),
      {
        name: 'Rhomboid Major/Minor',
        role: 'preganglionic',
        rationale: 'Dorsal scapular N.，直接自 C5 root 分出',
      },
      {
        name: 'Serratus Anterior',
        role: 'preganglionic',
        rationale: 'Long thoracic N.，直接自 C5–C7 roots 分出',
      },
      {
        name: 'Supraspinatus',
        role: 'confirm',
        rationale: 'Suprascapular N.，最近端的 postganglionic 肌肉，作為對照',
      },
    ],
  },
  {
    id: 'bpi-upper-trunk',
    label: 'BPI — upper trunk (Erb)',
    category: 'plexopathy',
    summary:
      'Upper trunk 與 C5–C6 radiculopathy 的肌肉分布幾乎重疊，唯一的分野是 pre-plexus 肌肉，因此它們必須入組。',
    muscles: [
      { name: 'Deltoid (Ant/Mid/Post)', role: 'confirm', rationale: 'Axillary N.，posterior cord' },
      { name: 'Biceps Brachii', role: 'confirm', rationale: 'Musculocutaneous，lateral cord' },
      { name: 'Supraspinatus', role: 'confirm', rationale: 'Suprascapular N.，直接自 upper trunk' },
      { name: 'Infraspinatus', role: 'confirm', rationale: 'Suprascapular N.，直接自 upper trunk' },
      { name: 'Brachioradialis', role: 'confirm', rationale: 'Radial N.，posterior cord' },
      {
        name: 'Rhomboid Major/Minor',
        role: 'preganglionic',
        rationale: '正常才支持 upper trunk 而非 C5 root',
      },
      {
        name: 'Serratus Anterior',
        role: 'preganglionic',
        rationale: '正常才支持 upper trunk 而非 C5–C7 root',
      },
      { name: 'Triceps Brachii', role: 'exclude', rationale: '界定下邊界' },
      paraspinal('Cervical', '正常才支持 postganglionic；以肢體肌肉判定特定 root'),
    ],
  },
  {
    id: 'bpi-middle-trunk',
    label: 'BPI — middle trunk',
    category: 'plexopathy',
    summary:
      'Middle trunk 與 C7 radiculopathy 幾乎不可能靠 C7 肌肉分辨，serratus anterior 與 paraspinal 是唯一的分野。',
    muscles: [
      { name: 'Triceps Brachii', role: 'confirm', rationale: 'Radial N.，posterior cord' },
      { name: 'Flexor Carpi Radialis', role: 'confirm', rationale: 'Median N.，lateral cord' },
      { name: 'Extensor Digitorum Communis', role: 'confirm', rationale: 'PIN，C7–C8' },
      { name: 'Pronator Teres', role: 'confirm', rationale: 'Median N.，C6–C7' },
      {
        name: 'Serratus Anterior',
        role: 'preganglionic',
        rationale: '正常才支持 middle trunk 而非 C7 root',
      },
      { name: 'Biceps Brachii', role: 'exclude', rationale: '界定上邊界' },
      { name: 'First Dorsal Interosseous', role: 'exclude', rationale: '界定下邊界' },
      paraspinal('C7', '正常才支持 postganglionic'),
    ],
  },
  {
    id: 'bpi-lower-trunk',
    label: 'BPI — lower trunk (Klumpke)',
    category: 'plexopathy',
    summary:
      'Lower trunk 同時涵蓋 ulnar 與 median 的 C8–T1 成分，兩者皆異常才排除單一 peripheral nerve；EIP 異常則排除 medial cord。',
    muscles: [
      { name: 'First Dorsal Interosseous', role: 'confirm', rationale: 'Ulnar N.，medial cord' },
      { name: 'Abd. Pollicis Brevis', role: 'confirm', rationale: 'Median N.，medial cord' },
      { name: 'Flexor Carpi Ulnaris', role: 'confirm', rationale: 'Ulnar N. 前臂段' },
      {
        name: 'Extensor Indicis Proprius',
        role: 'confirm',
        rationale: 'PIN，posterior cord — 異常則排除 medial cord，指向 lower trunk 或 C8',
      },
      { name: 'Flexor Pollicis Longus', role: 'confirm', rationale: 'AIN，C7–C8' },
      { name: 'Triceps Brachii', role: 'exclude', rationale: '界定上邊界' },
      paraspinal('C8', '正常才支持 postganglionic'),
    ],
  },
  {
    id: 'bpi-lateral-cord',
    label: 'BPI — lateral cord',
    category: 'plexopathy',
    summary:
      'Median nerve 同時由 lateral 與 medial cord 組成。Lateral cord 病灶影響 pronator teres 而不影響 APB，這組對比就是診斷本身。',
    muscles: [
      { name: 'Biceps Brachii', role: 'confirm', rationale: 'Musculocutaneous，lateral cord' },
      { name: 'Brachialis', role: 'confirm', rationale: 'Musculocutaneous，lateral cord' },
      { name: 'Pronator Teres', role: 'confirm', rationale: 'Median 的 lateral cord 成分' },
      { name: 'Flexor Carpi Radialis', role: 'confirm', rationale: 'Median 的 lateral cord 成分' },
      { name: 'Pectoralis Major (Clav)', role: 'confirm', rationale: 'Lateral pectoral N.' },
      {
        name: 'Abd. Pollicis Brevis',
        role: 'exclude',
        rationale: 'Median 的 medial cord 成分 — 正常才確立 lateral cord',
      },
      { name: 'Deltoid (Ant/Mid/Post)', role: 'exclude', rationale: 'Posterior cord' },
      { name: 'Triceps Brachii', role: 'exclude', rationale: 'Posterior cord' },
      paraspinal('C6', '正常才確立 postganglionic，排除 C6 root 假扮 lateral cord'),
    ],
  },
  {
    id: 'bpi-posterior-cord',
    label: 'BPI — posterior cord',
    category: 'plexopathy',
    summary:
      'Posterior cord 橫跨三個 trunk，因此 deltoid、triceps、latissimus dorsi 同時異常而屈肌群正常，是與 root 病灶最有力的分野。',
    muscles: [
      { name: 'Deltoid (Ant/Mid/Post)', role: 'confirm', rationale: 'Axillary N.' },
      { name: 'Teres Minor', role: 'confirm', rationale: 'Axillary N.' },
      { name: 'Triceps Brachii', role: 'confirm', rationale: 'Radial N.' },
      { name: 'Extensor Indicis Proprius', role: 'confirm', rationale: 'PIN（Radial）' },
      { name: 'Latissimus Dorsi', role: 'confirm', rationale: 'Thoracodorsal N.' },
      { name: 'Teres Major', role: 'confirm', rationale: 'Lower subscapular N.' },
      { name: 'Biceps Brachii', role: 'exclude', rationale: 'Lateral cord — 正常才確立 posterior cord' },
      { name: 'First Dorsal Interosseous', role: 'exclude', rationale: 'Medial cord' },
      paraspinal('C7', '正常才確立 postganglionic，排除 root 假扮 posterior cord'),
    ],
  },
  {
    id: 'bpi-medial-cord',
    label: 'BPI — medial cord',
    category: 'plexopathy',
    summary:
      'Medial cord 與 lower trunk 的差別只在 posterior cord 肌肉：EIP 正常支持 medial cord，EIP 異常則把病灶推到 lower trunk 或 C8。',
    muscles: [
      { name: 'First Dorsal Interosseous', role: 'confirm', rationale: 'Ulnar N.' },
      { name: 'Abd. Digiti Minimi', role: 'confirm', rationale: 'Ulnar N.' },
      { name: 'Flexor Carpi Ulnaris', role: 'confirm', rationale: 'Ulnar N. 前臂段' },
      { name: 'Abd. Pollicis Brevis', role: 'confirm', rationale: 'Median 的 medial cord 成分' },
      { name: 'Opponens Pollicis', role: 'confirm', rationale: 'Median 的 medial cord 成分' },
      { name: 'Pectoralis Major (Stern)', role: 'confirm', rationale: 'Medial pectoral N.' },
      {
        name: 'Extensor Indicis Proprius',
        role: 'exclude',
        rationale: 'Posterior cord — 正常才確立 medial cord',
      },
      { name: 'Pronator Teres', role: 'exclude', rationale: 'Lateral cord' },
      paraspinal('C8', '正常才確立 postganglionic，排除 C8 root 假扮 medial cord'),
    ],
  },
  {
    id: 'bpi-pan-plexus',
    label: 'BPI — pan-plexus',
    category: 'plexopathy',
    summary:
      '全叢損傷時，肌肉是否異常已無鑑別力，真正的問題是層級。取樣重心全部放在 pre-plexus 肌肉上。',
    muscles: [
      { name: 'Deltoid (Ant/Mid/Post)', role: 'confirm', rationale: 'Upper trunk / posterior cord' },
      { name: 'Biceps Brachii', role: 'confirm', rationale: 'Upper trunk / lateral cord' },
      { name: 'Triceps Brachii', role: 'confirm', rationale: 'Posterior cord' },
      { name: 'First Dorsal Interosseous', role: 'confirm', rationale: 'Lower trunk / medial cord' },
      { name: 'Abd. Pollicis Brevis', role: 'confirm', rationale: 'Lower trunk / medial cord' },
      {
        name: 'Rhomboid Major/Minor',
        role: 'preganglionic',
        rationale: 'Dorsal scapular N.，判斷 C5 是否 avulsion',
      },
      {
        name: 'Serratus Anterior',
        role: 'preganglionic',
        rationale: 'Long thoracic N.，判斷 C5–C7 是否 avulsion',
      },
      paraspinal('Cervical', '判斷 C5–C8 是否有 preganglionic involvement'),
    ],
  },
  {
    id: 'screen-upper',
    label: 'Upper limb screen',
    category: 'screen',
    summary: '尚無明確假設時的起手式：每個 root 與每條主要 peripheral nerve 各取一條代表肌肉。',
    muscles: [
      { name: 'Deltoid (Ant/Mid/Post)', role: 'confirm', rationale: 'C5–C6 / axillary' },
      { name: 'Biceps Brachii', role: 'confirm', rationale: 'C5–C6 / musculocutaneous' },
      { name: 'Triceps Brachii', role: 'confirm', rationale: 'C6–C8 / radial' },
      { name: 'Pronator Teres', role: 'confirm', rationale: 'C6–C7 / median' },
      { name: 'Extensor Indicis Proprius', role: 'confirm', rationale: 'C7–C8 / PIN' },
      { name: 'Abd. Pollicis Brevis', role: 'confirm', rationale: 'C8–T1 / median' },
      { name: 'First Dorsal Interosseous', role: 'confirm', rationale: 'C8–T1 / ulnar' },
      paraspinal('Cervical', '判斷病灶層級；特定 root 仍依肢體肌肉定位'),
    ],
  },
  {
    id: 'screen-lower',
    label: 'Lower limb screen',
    category: 'screen',
    summary: '尚無明確假設時的起手式：涵蓋 femoral、peroneal、tibial、gluteal 與 sciatic 各分支。',
    muscles: [
      { name: 'Quadriceps (Vastus/Rectus)', role: 'confirm', rationale: 'L2–L4 / femoral' },
      { name: 'Tibialis Anterior', role: 'confirm', rationale: 'L4–L5 / deep peroneal' },
      { name: 'Tibialis Posterior', role: 'confirm', rationale: 'L4–L5 / tibial' },
      { name: 'Gastrocnemius (Med/Lat)', role: 'confirm', rationale: 'S1–S2 / tibial' },
      { name: 'Gluteus Medius', role: 'confirm', rationale: 'L4–S1 / superior gluteal' },
      { name: 'Biceps Femoris (Short Head)', role: 'confirm', rationale: 'L5–S1 / sciatic peroneal division' },
      paraspinal('L5', '判斷病灶層級'),
      paraspinal('S1', '判斷病灶層級'),
    ],
  },
]

export const protocolById = new Map(protocols.map((protocol) => [protocol.id, protocol]))

export const categoryLabels: Record<ProtocolCategory, string> = {
  radiculopathy: 'Radiculopathy',
  plexopathy: 'Brachial plexus injury',
  mononeuropathy: 'Mononeuropathy',
  screen: '無特定假設',
}

export const categoryOrder: ProtocolCategory[] = [
  'radiculopathy',
  'plexopathy',
  'mononeuropathy',
  'screen',
]
