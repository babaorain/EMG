import { X } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { muscleById } from '../clinical/catalog'
import { siteById } from '../domain/anatomy'
import type { InferenceResult } from '../domain/inference'
import type { CoverageState, NeedleFinding } from '../domain/types'

interface PathwayDialogProps {
  open: boolean
  findings: NeedleFinding[]
  result: InferenceResult
  onClose: () => void
}

const stageOrder = ['root', 'trunk', 'cord', 'plexus', 'nerve'] as const
const stageLabels: Record<(typeof stageOrder)[number], string> = {
  root: 'Root',
  trunk: 'Trunk',
  cord: 'Cord',
  plexus: 'Plexus',
  nerve: 'Nerve',
}

const coverageMark: Record<CoverageState, string> = {
  abnormal: '異常',
  normal: '正常',
  technically_inadequate: '技術不足',
  not_tested: '未檢',
}

export function PathwayDialog({ open, findings, result, onClose }: PathwayDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const liveSiteIds = useMemo(
    () => new Set(result.compatible.map((verdict) => verdict.site.id)),
    [result.compatible],
  )
  const outSiteIds = useMemo(
    () =>
      new Set(
        [...result.contradicted, ...result.partial].map((verdict) => verdict.site.id),
      ),
    [result.contradicted, result.partial],
  )

  const rows = useMemo(
    () =>
      findings
        .filter((finding) => finding.side === result.side)
        .map((finding) => {
          const muscle = muscleById.get(finding.muscleId)
          if (!muscle) return null
          const stages = stageOrder.map((stage) => {
            const ids =
              stage === 'root'
                ? muscle.pathway.rootSiteIds
                : stage === 'trunk'
                  ? muscle.pathway.trunkSiteIds
                  : stage === 'cord'
                    ? muscle.pathway.cordSiteIds
                    : stage === 'plexus'
                      ? muscle.pathway.plexusSiteIds
                      : muscle.pathway.nerveSiteIds
            return { stage, sites: ids.map((id) => siteById(id)).filter(Boolean) }
          })
          return { finding, muscle, stages }
        })
        .filter((row): row is NonNullable<typeof row> => row !== null),
    [findings, result.side],
  )

  if (!open) return null

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog pathway-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="推論路徑"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dialog-header">
          <div>
            <h2>推論路徑</h2>
            <p className="dialog-sub">
              每條肌肉由左至右的供應路徑。實心＝仍相容的位置，刪除線＝已被排除或只能解釋部分異常。
            </p>
          </div>
          <button ref={closeRef} type="button" className="icon-button" onClick={onClose} aria-label="關閉">
            <X size={18} />
          </button>
        </header>

        <div className="pathway-body">
          <div className="pathway-legend">
            {stageOrder.map((stage) => (
              <span key={stage}>{stageLabels[stage]}</span>
            ))}
          </div>

          {rows.length === 0 ? (
            <p className="dialog-empty">此側尚未加入肌肉。</p>
          ) : (
            <ul className="pathway-rows">
              {rows.map(({ finding, muscle, stages }) => (
                <li key={finding.id} className={`pathway-row ${finding.coverage}`}>
                  <div className="pathway-muscle">
                    <span className="pathway-muscle-name">{muscle.name}</span>
                    <span className={`pathway-state ${finding.coverage}`}>
                      {coverageMark[finding.coverage]}
                    </span>
                  </div>
                  <div className="pathway-track">
                    {stages.map(({ stage, sites }) => (
                      <div className="pathway-stage" key={stage}>
                        {sites.length === 0 ? (
                          <span className="pathway-gap" aria-label={`無 ${stageLabels[stage]} 階段`}>
                            —
                          </span>
                        ) : (
                          sites.map((site) =>
                            site ? (
                              <span
                                key={site.id}
                                className={`pathway-node ${
                                  liveSiteIds.has(site.id)
                                    ? 'live'
                                    : outSiteIds.has(site.id)
                                      ? 'out'
                                      : 'idle'
                                }`}
                              >
                                {site.label}
                              </span>
                            ) : null,
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="pathway-note">
            Pre-plexus 分支（dorsal scapular、long thoracic）與 posterior ramus 在 trunk 與 cord
            欄位是空的，因為它們在 plexus 之前就離開 root。這個空格就是 root 與 plexus
            病灶的分野。
          </p>
        </div>
      </div>
    </div>
  )
}
