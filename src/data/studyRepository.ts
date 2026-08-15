import { z } from 'zod'
import {
  activationOptions,
  coverageStates,
  insertionalActivityOptions,
  muapAmplitudeOptions,
  muapDurationOptions,
  polyphasiaOptions,
  presenceOptions,
  recruitmentOptions,
  sides,
  spontaneousGrades,
} from '../domain/types'
import type { Study } from '../domain/types'

export interface StudyRepository {
  saveDraft(study: Study): Promise<void>
  loadStudy(studyId: string): Promise<StudyLoadResult>
}

export type StudyLoadResult =
  | { status: 'empty' }
  | { status: 'loaded'; study: Study }
  | { status: 'invalid' }
  | { status: 'unavailable' }

const quadrantSchema = z
  .object({
    observedMuaps: z.number().int().nonnegative().optional(),
    polyphasicMuaps: z.number().int().nonnegative().optional(),
  })
  .strict()

const findingSchema = z
  .object({
    id: z.string().min(1),
    muscleId: z.string().min(1),
    side: z.enum(sides),
    coverage: z.enum(coverageStates),
    insertionalActivity: z.enum(insertionalActivityOptions),
    spontaneous: z
      .object({
        fibrillation: z.enum(spontaneousGrades),
        psw: z.enum(spontaneousGrades),
        fasciculation: z.enum(spontaneousGrades),
        crd: z.enum(presenceOptions),
        myotonicDischarges: z.enum(presenceOptions),
        myokymicDischarges: z.enum(presenceOptions),
        neuromyotonicDischarges: z.enum(presenceOptions),
      })
      .strict(),
    muap: z
      .object({
        amplitude: z.enum(muapAmplitudeOptions),
        duration: z.enum(muapDurationOptions),
        polyphasia: z.enum(polyphasiaOptions),
        polyphasiaSampling: z
          .object({
            quadrants: z.object({
              q1: quadrantSchema,
              q2: quadrantSchema,
              q3: quadrantSchema,
              q4: quadrantSchema,
            }),
          })
          .strict(),
      })
      .strict(),
    recruitment: z.enum(recruitmentOptions),
    activation: z.enum(activationOptions),
    notes: z.string().max(500),
    updatedAt: z.iso.datetime(),
  })
  .strict()

const studySchema = z
  .object({
    id: z.string().min(1),
    label: z.string().max(200),
    studyDate: z.string(),
    protocolId: z.string().optional(),
    findings: z.array(findingSchema),
    impressionDraft: z.string().max(4000),
  })
  .strict()

const storedStudySchema = z
  .object({ schemaVersion: z.literal(3), study: studySchema })
  .strict()

/**
 * Session storage, not local storage: the draft survives a refresh in the same
 * tab and is gone when the tab closes. Anything stored here would otherwise
 * outlive the teaching session it belongs to.
 */
export class SessionStudyRepository implements StudyRepository {
  private readonly storagePrefix = 'emg-workbench:study:'
  private readonly storage: Storage

  constructor(storage: Storage) {
    this.storage = storage
  }

  async loadStudy(studyId: string): Promise<StudyLoadResult> {
    try {
      const serialized = this.storage.getItem(`${this.storagePrefix}${studyId}`)
      if (!serialized) return { status: 'empty' }

      const parsed = storedStudySchema.safeParse(JSON.parse(serialized))
      return parsed.success
        ? { status: 'loaded', study: parsed.data.study }
        : { status: 'invalid' }
    } catch {
      return { status: 'unavailable' }
    }
  }

  async saveDraft(study: Study): Promise<void> {
    const validatedStudy = studySchema.parse(study)
    this.storage.setItem(
      `${this.storagePrefix}${study.id}`,
      JSON.stringify({ schemaVersion: 3, study: validatedStudy }),
    )
  }
}
