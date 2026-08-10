export const coverageStates = [
  'not_tested',
  'normal',
  'abnormal',
  'technically_inadequate',
] as const

export type CoverageState = (typeof coverageStates)[number]

export const sides = ['L', 'R'] as const
export type Side = (typeof sides)[number]

export const insertionalActivityOptions = [
  'not_assessed',
  'decreased',
  'normal',
  'increased',
] as const
export type InsertionalActivity = (typeof insertionalActivityOptions)[number]

export const spontaneousGrades = [
  'not_assessed',
  '0',
  '1+',
  '2+',
  '3+',
  '4+',
] as const
export type SpontaneousGrade = (typeof spontaneousGrades)[number]

export const presenceOptions = ['not_assessed', 'absent', 'present'] as const
export type Presence = (typeof presenceOptions)[number]

export const muapAmplitudeOptions = [
  'not_assessed',
  'small',
  'normal',
  'large',
] as const
export type MuapAmplitude = (typeof muapAmplitudeOptions)[number]

export const muapDurationOptions = [
  'not_assessed',
  'short',
  'normal',
  'long',
] as const
export type MuapDuration = (typeof muapDurationOptions)[number]

export const polyphasiaOptions = ['not_assessed', 'normal', 'increased'] as const
export type Polyphasia = (typeof polyphasiaOptions)[number]

export const samplingQuadrants = ['q1', 'q2', 'q3', 'q4'] as const
export type SamplingQuadrant = (typeof samplingQuadrants)[number]

export interface PolyphasiaQuadrant {
  observedMuaps?: number
  polyphasicMuaps?: number
}

export type PolyphasiaQuadrants = Record<SamplingQuadrant, PolyphasiaQuadrant>

/** Four sampling passes through the muscle, not four anatomical regions. */
export interface PolyphasiaSampling {
  quadrants: PolyphasiaQuadrants
}

export const recruitmentOptions = [
  'not_assessed',
  'early',
  'normal',
  'reduced',
  'discrete',
  'none',
] as const
export type Recruitment = (typeof recruitmentOptions)[number]

export const activationOptions = [
  'not_assessed',
  'full',
  'reduced_central',
  'unable_to_activate',
] as const
export type Activation = (typeof activationOptions)[number]

/**
 * Rare discharges, kept out of the main row but retained because their
 * information density is the highest of any field here: myokymic discharges
 * separate radiation from neoplastic plexopathy, and myotonic discharges are
 * the only entry that moves the study from neurogenic toward myopathic.
 */
export interface SpecialDischarges {
  crd: Presence
  myotonicDischarges: Presence
  myokymicDischarges: Presence
  neuromyotonicDischarges: Presence
}

export interface SpontaneousActivity extends SpecialDischarges {
  fibrillation: SpontaneousGrade
  psw: SpontaneousGrade
  fasciculation: SpontaneousGrade
}

export interface MuapMorphology {
  amplitude: MuapAmplitude
  duration: MuapDuration
  polyphasia: Polyphasia
  polyphasiaSampling: PolyphasiaSampling
}

export interface NeedleFinding {
  id: string
  muscleId: string
  side: Side
  coverage: CoverageState
  insertionalActivity: InsertionalActivity
  spontaneous: SpontaneousActivity
  muap: MuapMorphology
  recruitment: Recruitment
  activation: Activation
  notes: string
  updatedAt: string
}

export interface Study {
  id: string
  label: string
  studyDate: string
  /** The hypothesis the muscle set was drawn from, when one was chosen. */
  protocolId?: string
  findings: NeedleFinding[]
  impressionDraft: string
}
