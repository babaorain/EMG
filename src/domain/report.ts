import { muscleById } from '../clinical/catalog'
import { runInference } from './inference'
import { summarizePolyphasia } from './polyphasia'
import { sides, type NeedleFinding, type Study } from './types'

function words(value: string): string {
  return value.replaceAll('_', ' ')
}

function grade(value: string): string {
  return value === 'not_assessed' ? 'NA' : words(value)
}

function sideLabel(side: NeedleFinding['side']): string {
  return side === 'R' ? 'Right' : 'Left'
}

function muscleName(finding: NeedleFinding): string {
  return muscleById.get(finding.muscleId)?.name ?? finding.muscleId
}

function detailFields(finding: NeedleFinding): string {
  const polyphasia = summarizePolyphasia(finding.muap.polyphasiaSampling)
  const parts = [
    `IA ${grade(finding.insertionalActivity)}`,
    `fib ${grade(finding.spontaneous.fibrillation)}`,
    `PSW ${grade(finding.spontaneous.psw)}`,
    `fasc ${grade(finding.spontaneous.fasciculation)}`,
    `amp ${grade(finding.muap.amplitude)}`,
    `dur ${grade(finding.muap.duration)}`,
    `polyphasia ${grade(finding.muap.polyphasia)}`,
    `recruitment ${grade(finding.recruitment)}`,
    `activation ${grade(finding.activation)}`,
  ]

  if (polyphasia.totalObserved > 0) {
    parts.push(
      `polyphasic MUAP ${polyphasia.totalPolyphasic}/${polyphasia.totalObserved}` +
        (polyphasia.percent === undefined ? '' : ` (${polyphasia.percent}%)`) +
        `, ${polyphasia.quadrantsSampled}/4 passes sampled`,
    )
  }

  const special: string[] = []
  if (finding.spontaneous.crd === 'present') special.push('CRD')
  if (finding.spontaneous.myotonicDischarges === 'present') special.push('myotonic discharges')
  if (finding.spontaneous.myokymicDischarges === 'present') special.push('myokymic discharges')
  if (finding.spontaneous.neuromyotonicDischarges === 'present') {
    special.push('neuromyotonic discharges')
  }
  if (special.length) parts.push(`present: ${special.join(', ')}`)

  if (finding.notes.trim()) parts.push(`notes: ${finding.notes.replace(/\s+/g, ' ').trim()}`)

  return parts.join('; ')
}

function findingLine(finding: NeedleFinding): string {
  const muscle = muscleById.get(finding.muscleId)
  const supply = muscle ? ` [${muscle.nerveLabel}, ${muscle.rootLabel}]` : ''
  return `${sideLabel(finding.side)} ${muscleName(finding)}${supply} — ${words(
    finding.coverage,
  )}. ${detailFields(finding)}`
}

function localizationSection(study: Study): string[] {
  const lines: string[] = []

  for (const side of sides) {
    const result = runInference(study.findings, side)
    if (result.abnormal.length === 0) continue

    lines.push(`${sideLabel(side)} side`)
    lines.push(
      `  Abnormal: ${result.abnormal.map((ref) => ref.name).join(', ')}`,
    )
    if (result.normal.length) {
      lines.push(`  Normal: ${result.normal.map((ref) => ref.name).join(', ')}`)
    }

    if (result.compatible.length) {
      lines.push('  Sites compatible with the pattern:')
      for (const verdict of result.compatible) {
        lines.push(
          `    - ${verdict.site.label} (explains ${verdict.explains
            .map((ref) => ref.name)
            .join(', ')})`,
        )
      }
    } else {
      lines.push(
        '  No single site explains every abnormal muscle. Consider a multifocal or multilevel process.',
      )
    }

    if (result.contradicted.length) {
      lines.push('  Sites contradicted by a normal muscle:')
      for (const verdict of result.contradicted) {
        lines.push(
          `    - ${verdict.site.label} (normal: ${verdict.contradictedBy
            .map((ref) => ref.name)
            .join(', ')})`,
        )
      }
    }

    if (result.inadequate.length) {
      lines.push(
        `  Technically inadequate, excluded from the analysis: ${result.inadequate
          .map((ref) => ref.name)
          .join(', ')}`,
      )
    }

    lines.push('')
  }

  return lines.length ? lines : ['No abnormal muscle recorded; localization not attempted.']
}

export function generateReport(study: Study): string {
  const completed = study.findings.filter((finding) => finding.coverage !== 'not_tested')
  const planned = study.findings.filter((finding) => finding.coverage === 'not_tested')

  const lines = [
    'NEEDLE ELECTROMYOGRAPHY — PLANNING AND TEACHING WORKSHEET',
    'Not a signed diagnostic report.',
    '',
    ...(study.label.trim() ? [`Study: ${study.label.trim()}`, ''] : []),
    `Date: ${study.studyDate}`,
    '',
    'NEEDLE EMG FINDINGS',
    ...(completed.length
      ? completed.map(findingLine)
      : ['No completed muscle findings recorded.']),
    '',
    'PLANNED / NOT YET TESTED',
    ...(planned.length
      ? planned.map((finding) => `${sideLabel(finding.side)} ${muscleName(finding)}`)
      : ['None.']),
    '',
    'LOCALIZATION SUPPORT',
    ...localizationSection(study),
    'IMPRESSION',
    study.impressionDraft.trim() || 'Not drafted.',
    '',
    'LIMITATIONS',
    'Localization support is set intersection over an anatomical supply map. It does not model partial lesions, symptom duration, side-to-side comparison, or nerve conduction findings, and it is not a diagnosis. Interpretation requires physician review together with the clinical examination and the relevant nerve conduction studies.',
  ]

  return lines.join('\n')
}

export function generateDraftImpression(study: Study): string {
  const sentences: string[] = []

  for (const side of sides) {
    const result = runInference(study.findings, side)
    if (result.abnormal.length === 0) continue

    sentences.push(
      `${sideLabel(side)}-sided needle examination showed abnormalities in ${result.abnormal
        .map((ref) => ref.name)
        .join(', ')}.`,
    )

    if (result.normal.length) {
      sentences.push(
        `The examination was normal in ${result.normal.map((ref) => ref.name).join(', ')}.`,
      )
    }

    if (result.compatible.length) {
      sentences.push(
        `This distribution is compatible with a lesion at ${result.compatible
          .map((verdict) => verdict.site.label)
          .join(' or ')}.`,
      )
    } else {
      sentences.push(
        'No single lesion site accounts for every abnormal muscle on this side.',
      )
    }

    if (result.contradicted.length) {
      sentences.push(
        `${result.contradicted
          .map((verdict) => verdict.site.label)
          .join(', ')} ${result.contradicted.length === 1 ? 'is' : 'are'} argued against by the normal muscles listed above.`,
      )
    }
  }

  const inadequate = study.findings.filter(
    (finding) => finding.coverage === 'technically_inadequate',
  )
  if (inadequate.length) {
    sentences.push(
      `Technical limitations affected ${inadequate
        .map((finding) => `${sideLabel(finding.side)} ${muscleName(finding)}`)
        .join(', ')}; these were excluded from the analysis.`,
    )
  }

  const untested = study.findings.filter((finding) => finding.coverage === 'not_tested')
  if (untested.length) {
    sentences.push(
      `${untested.length} planned ${untested.length === 1 ? 'muscle remains' : 'muscles remain'} untested.`,
    )
  }

  if (sentences.length === 0) {
    return 'No abnormal needle findings were recorded.'
  }

  sentences.push(
    'Correlation with the clinical examination and nerve conduction studies is required.',
  )

  return sentences.join(' ')
}
