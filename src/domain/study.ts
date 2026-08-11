import type { Study } from './types'

export const initialStudy: Study = {
  id: 'emg-planning-session',
  label: '',
  studyDate: new Date().toISOString().slice(0, 10),
  findings: [],
  impressionDraft: '',
}
