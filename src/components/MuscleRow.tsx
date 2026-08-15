import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import type { MuscleCatalogEntry } from '../clinical/catalog'
import { summarizePolyphasia } from '../domain/polyphasia'
import { roleLabels, type ProtocolMuscle } from '../domain/protocols'
import {
  activationOptions,
  insertionalActivityOptions,
  muapAmplitudeOptions,
  muapDurationOptions,
  polyphasiaOptions,
  presenceOptions,
  recruitmentOptions,
  samplingQuadrants,
  spontaneousGrades,
  type CoverageState,
  type NeedleFinding,
  type Presence,
  type SamplingQuadrant,
} from '../domain/types'

const coverageChoices: { value: CoverageState; label: string }[] = [
  { value: 'not_tested', label: '未檢' },
  { value: 'normal', label: '正常' },
  { value: 'abnormal', label: '異常' },
  { value: 'technically_inadequate', label: '技術不足' },
]

const specialDischarges = [
  { key: 'crd', label: 'CRD' },
  { key: 'myotonicDischarges', label: 'Myotonic' },
  { key: 'myokymicDischarges', label: 'Myokymic' },
  { key: 'neuromyotonicDischarges', label: 'Neuromyotonic' },
] as const

function optionLabel(value: string): string {
  return value === 'not_assessed' ? '未評估' : value.replaceAll('_', ' ')
}

interface FieldProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

function SelectField<T extends string>({ label, value, options, onChange }: FieldProps<T>) {
  return (
    <label className="detail-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  )
}

interface MuscleRowProps {
  muscle: MuscleCatalogEntry
  finding: NeedleFinding
  planEntry?: ProtocolMuscle
  expanded: boolean
  onToggleExpand: () => void
  onChange: (finding: NeedleFinding) => void
  onRemove: () => void
}

export function MuscleRow({
  muscle,
  finding,
  planEntry,
  expanded,
  onToggleExpand,
  onChange,
  onRemove,
}: MuscleRowProps) {
  const polyphasia = summarizePolyphasia(finding.muap.polyphasiaSampling)
  const detailPanelId = `detail-${finding.id}`

  function setQuadrant(
    quadrant: SamplingQuadrant,
    field: 'observedMuaps' | 'polyphasicMuaps',
    raw: string,
  ) {
    const parsed = raw === '' ? undefined : Number.parseInt(raw, 10)
    if (parsed !== undefined && (Number.isNaN(parsed) || parsed < 0)) return
    onChange({
      ...finding,
      muap: {
        ...finding.muap,
        polyphasiaSampling: {
          quadrants: {
            ...finding.muap.polyphasiaSampling.quadrants,
            [quadrant]: {
              ...finding.muap.polyphasiaSampling.quadrants[quadrant],
              [field]: parsed,
            },
          },
        },
      },
    })
  }

  const activeDischarges = specialDischarges.filter(
    ({ key }) => finding.spontaneous[key] === 'present',
  )

  return (
    <li className={`muscle-row ${finding.coverage}`}>
      <div className="muscle-row-main">
        <div className="muscle-identity">
          <div className="muscle-name-line">
            <span className="muscle-name">{muscle.name}</span>
            {planEntry ? (
              <span className={`plan-role ${planEntry.role}`} title={planEntry.rationale}>
                {roleLabels[planEntry.role]}
              </span>
            ) : null}
            {activeDischarges.length ? (
              <span className="discharge-flag">
                {activeDischarges.map(({ label }) => label).join(' · ')}
              </span>
            ) : null}
          </div>
          <div className="muscle-supply">
            {muscle.nerveLabel} · {muscle.rootLabel}
            {muscle.pathway.cordSiteIds.length === 1 ? (
              <> · {muscle.pathway.cordSiteIds[0] === 'cord-lateral' ? 'lateral cord' : muscle.pathway.cordSiteIds[0] === 'cord-medial' ? 'medial cord' : 'posterior cord'}</>
            ) : null}
            {muscle.pathway.prePlexus ? <> · pre-plexus</> : null}
            {muscle.pathway.posteriorRamus ? <> · posterior ramus</> : null}
          </div>
        </div>

        <div className="coverage-choice" role="group" aria-label={`${muscle.name} 檢查結果`}>
          {coverageChoices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              className={finding.coverage === choice.value ? `active ${choice.value}` : ''}
              aria-pressed={finding.coverage === choice.value}
              onClick={() => onChange({ ...finding, coverage: choice.value })}
            >
              {choice.label}
            </button>
          ))}
        </div>

        <div className="row-actions">
          <button
            type="button"
            className="icon-button"
            aria-expanded={expanded}
            aria-controls={detailPanelId}
            onClick={onToggleExpand}
            title="展開細項"
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <button
            type="button"
            className="icon-button danger"
            onClick={onRemove}
            aria-label={`移除 ${muscle.name}`}
            title="移除"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {planEntry ? <p className="plan-rationale">{planEntry.rationale}</p> : null}

      {expanded ? (
        <div className="muscle-detail" id={detailPanelId}>
          <div className="detail-grid">
            <SelectField
              label="Insertional activity"
              value={finding.insertionalActivity}
              options={insertionalActivityOptions}
              onChange={(value) => onChange({ ...finding, insertionalActivity: value })}
            />
            <SelectField
              label="Fibrillation"
              value={finding.spontaneous.fibrillation}
              options={spontaneousGrades}
              onChange={(value) =>
                onChange({
                  ...finding,
                  spontaneous: { ...finding.spontaneous, fibrillation: value },
                })
              }
            />
            <SelectField
              label="PSW"
              value={finding.spontaneous.psw}
              options={spontaneousGrades}
              onChange={(value) =>
                onChange({ ...finding, spontaneous: { ...finding.spontaneous, psw: value } })
              }
            />
            <SelectField
              label="Fasciculation"
              value={finding.spontaneous.fasciculation}
              options={spontaneousGrades}
              onChange={(value) =>
                onChange({
                  ...finding,
                  spontaneous: { ...finding.spontaneous, fasciculation: value },
                })
              }
            />
            <SelectField
              label="MUAP amplitude"
              value={finding.muap.amplitude}
              options={muapAmplitudeOptions}
              onChange={(value) =>
                onChange({ ...finding, muap: { ...finding.muap, amplitude: value } })
              }
            />
            <SelectField
              label="MUAP duration"
              value={finding.muap.duration}
              options={muapDurationOptions}
              onChange={(value) =>
                onChange({ ...finding, muap: { ...finding.muap, duration: value } })
              }
            />
            <SelectField
              label="Polyphasia"
              value={finding.muap.polyphasia}
              options={polyphasiaOptions}
              onChange={(value) =>
                onChange({ ...finding, muap: { ...finding.muap, polyphasia: value } })
              }
            />
            <SelectField
              label="Recruitment"
              value={finding.recruitment}
              options={recruitmentOptions}
              onChange={(value) => onChange({ ...finding, recruitment: value })}
            />
            <SelectField
              label="Activation"
              value={finding.activation}
              options={activationOptions}
              onChange={(value) => onChange({ ...finding, activation: value })}
            />
          </div>

          <fieldset className="quadrant-block">
            <legend>
              Polyphasia 四區取樣
              <span className="quadrant-total">
                {polyphasia.totalObserved > 0
                  ? `${polyphasia.totalPolyphasic} / ${polyphasia.totalObserved}${
                      polyphasia.percent === undefined ? '' : ` · ${polyphasia.percent}%`
                    }`
                  : '尚未取樣'}
              </span>
            </legend>
            <p className="quadrant-note">
              四區是四次取樣，不是解剖象限。本工具不判定任何百分比為異常。
            </p>
            <div className="quadrant-grid">
              {samplingQuadrants.map((quadrant) => (
                <div className="quadrant" key={quadrant}>
                  <span className="quadrant-label">{quadrant.toUpperCase()}</span>
                  <label>
                    <span>Observed</span>
                    <input
                      type="number"
                      min={0}
                      value={
                        finding.muap.polyphasiaSampling.quadrants[quadrant].observedMuaps ?? ''
                      }
                      onChange={(event) =>
                        setQuadrant(quadrant, 'observedMuaps', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Polyphasic</span>
                    <input
                      type="number"
                      min={0}
                      value={
                        finding.muap.polyphasiaSampling.quadrants[quadrant].polyphasicMuaps ?? ''
                      }
                      onChange={(event) =>
                        setQuadrant(quadrant, 'polyphasicMuaps', event.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
            {polyphasia.invalidQuadrants.length ? (
              <p className="quadrant-error" role="alert">
                {polyphasia.invalidQuadrants.map((q) => q.toUpperCase()).join('、')}
                ：Polyphasic 數量大於 Observed。
              </p>
            ) : null}
          </fieldset>

          <fieldset className="discharge-block">
            <legend>特殊放電</legend>
            <p className="quadrant-note">
              少見，但資訊量最高：myokymic 是 radiation plexopathy 的線索，myotonic 是唯一會把判讀推向 myopathic 的欄位。
            </p>
            <div className="discharge-row">
              {specialDischarges.map(({ key, label }) => (
                <label className="discharge-chip" key={key}>
                  <span>{label}</span>
                  <select
                    value={finding.spontaneous[key]}
                    onChange={(event) =>
                      onChange({
                        ...finding,
                        spontaneous: {
                          ...finding.spontaneous,
                          [key]: event.target.value as Presence,
                        },
                      })
                    }
                  >
                    {presenceOptions.map((option) => (
                      <option key={option} value={option}>
                        {optionLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="notes-field">
            <span>Notes (English)</span>
            <textarea
              rows={2}
              maxLength={500}
              value={finding.notes}
              onChange={(event) => onChange({ ...finding, notes: event.target.value })}
            />
          </label>
        </div>
      ) : null}
    </li>
  )
}
