import { findMuscleByName } from '../clinical/catalog'
import { createEmptyFinding } from './finding'
import { protocolById } from './protocols'
import type { NeedleFinding, Side, Study } from './types'

export type StudyAction =
  | { type: 'replace_study'; study: Study }
  | { type: 'add_muscle'; muscleId: string; side: Side }
  | { type: 'load_protocol'; protocolId: string; side: Side }
  | { type: 'remove_finding'; findingId: string }
  | { type: 'update_finding'; finding: NeedleFinding }
  | { type: 'set_label'; value: string }
  | { type: 'set_impression'; value: string }
  | { type: 'clear_findings' }

function addFinding(findings: NeedleFinding[], muscleId: string, side: Side) {
  const finding = createEmptyFinding(muscleId, side)
  if (findings.some((item) => item.id === finding.id)) return findings
  return [...findings, finding]
}

export function studyReducer(study: Study, action: StudyAction): Study {
  switch (action.type) {
    case 'replace_study':
      return action.study

    case 'add_muscle':
      return { ...study, findings: addFinding(study.findings, action.muscleId, action.side) }

    case 'load_protocol': {
      const protocol = protocolById.get(action.protocolId)
      if (!protocol) return study
      let findings = study.findings
      for (const entry of protocol.muscles) {
        findings = addFinding(findings, findMuscleByName(entry.name).id, action.side)
      }
      return { ...study, protocolId: protocol.id, findings }
    }

    case 'remove_finding':
      return {
        ...study,
        findings: study.findings.filter((finding) => finding.id !== action.findingId),
      }

    case 'update_finding':
      return {
        ...study,
        findings: study.findings.map((finding) =>
          finding.id === action.finding.id
            ? { ...action.finding, updatedAt: new Date().toISOString() }
            : finding,
        ),
      }

    case 'set_label':
      return { ...study, label: action.value }

    case 'set_impression':
      return { ...study, impressionDraft: action.value }

    case 'clear_findings':
      return { ...study, findings: [], protocolId: undefined, impressionDraft: '' }
  }
}
