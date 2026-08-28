/**
 * Small first-load manifest used by the muscle list. The full guide payload is
 * loaded only when the needle dialog opens. A test keeps this set in sync with
 * the chapter 13 guide definitions.
 */
const imageGuideCatalogNames = new Set([
  'Abd. Digiti Minimi',
  'Abd. Pollicis Brevis',
  'Abductor Digiti Quinti',
  'Abductor Hallucis',
  'Adductor Longus/Brevis',
  'Adductor Magnus',
  'Anconeus',
  'Biceps Brachii',
  'Biceps Femoris (Long Head)',
  'Biceps Femoris (Short Head)',
  'Brachioradialis',
  'Deltoid (Ant/Mid/Post)',
  'Extensor Carpi Rad. Longus',
  'Extensor Carpi Ulnaris',
  'Extensor Digitorum Brevis',
  'Extensor Digitorum Communis',
  'Extensor Digitorum Longus',
  'Extensor Hallucis Longus',
  'Extensor Indicis Proprius',
  'First Dorsal Interosseous',
  'Flexor Carpi Radialis',
  'Flexor Carpi Ulnaris',
  'Flexor Digitorum Longus',
  'Flexor Digitorum Profundus (1,2)',
  'Flexor Digitorum Profundus (3,4)',
  'Flexor Digitorum Superficialis',
  'Flexor Hallucis Brevis',
  'Flexor Pollicis Brevis',
  'Flexor Pollicis Longus',
  'Frontalis',
  'Gastrocnemius (Med/Lat)',
  'Gluteus Major',
  'Gluteus Medius',
  'Gracilis',
  'Iliopsoas',
  'Infraspinatus',
  'Latissimus Dorsi',
  'Masseter',
  'Mentalis',
  'Opponens Pollicis',
  'Orbicularis Oculi',
  'Paraspinal (Cervical)',
  'Paraspinal (L2)',
  'Paraspinal (L3)',
  'Paraspinal (L4)',
  'Paraspinal (L5)',
  'Paraspinal (S1)',
  'Paraspinal (Thoracic)',
  'Pectoralis Major (Clav)',
  'Pectoralis Major (Stern)',
  'Peroneus Longus',
  'Pronator Quadratus',
  'Pronator Teres',
  'Quadriceps (Vastus/Rectus)',
  'Rhomboid Major/Minor',
  'Semimembranosus',
  'Semitendinosus',
  'Serratus Anterior',
  'Soleus',
  'Sternocleidomastoid',
  'Supraspinatus',
  'Tensor Fasciae Latae',
  'Teres Minor',
  'Tibialis Anterior',
  'Tibialis Posterior',
  'Tongue (Genioglossus)',
  'Trapezius (Upper)',
  'Triceps Brachii',
])

/**
 * Catalog muscles backed by the separately loaded, source-mapped web guide
 * bundle. Keep this lightweight list here so the library can communicate the
 * guide type without pulling clinical prose into the first-load chunk.
 */
const webGuideCatalogNames = new Set([
  'Orbicularis Oris',
  'Nasalis',
  'Temporalis',
  'Levator Scapulae',
  'Subclavius',
  'Pectoralis Minor',
  'Subscapularis',
  'Teres Major',
  'Brachialis',
  'Coracobrachialis',
  'Extensor Carpi Rad. Brevis',
  'Supinator',
  'Abd. Pollicis Longus',
  'Ext. Pollicis Longus',
  'Ext. Pollicis Brevis',
  'Palmaris Longus',
  'Lumbricals (1,2)',
  'Palmar Interossei',
  'Adductor Pollicis',
  'Sartorius',
  'Pectineus',
  'Obturator Externus',
  'Gluteus Minimus',
  'Piriformis',
  'Obturator Int / Gemelli',
  'Quadratus Femoris',
  'Extensor Hallucis Brevis',
  'Peroneus Brevis',
  'Popliteus',
  'Flexor Hallucis Longus',
  'Flexor Digitorum Brevis',
  'Interossei (Foot)',
  'Ext. Anal Sphincter',
  'Bulbocavernosus',
])

export type NeedleGuideAvailability = 'textbook-image' | 'web-reference' | 'none'

export function hasNeedleGuideImage(muscleName: string): boolean {
  return imageGuideCatalogNames.has(muscleName)
}

export function hasExternalNeedleGuide(muscleName: string): boolean {
  return webGuideCatalogNames.has(muscleName)
}

export function needleGuideAvailabilityForMuscle(muscleName: string): NeedleGuideAvailability {
  if (hasNeedleGuideImage(muscleName)) return 'textbook-image'
  if (hasExternalNeedleGuide(muscleName)) return 'web-reference'
  return 'none'
}

export function needleGuideAvailabilityRank(muscleName: string): number {
  const availability = needleGuideAvailabilityForMuscle(muscleName)
  if (availability === 'textbook-image') return 0
  if (availability === 'web-reference') return 1
  return 2
}

export const needleGuideImageCatalogNames = [...imageGuideCatalogNames]
export const needleGuideWebCatalogNames = [...webGuideCatalogNames]
