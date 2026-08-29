import { BookOpen, ExternalLink, Globe2, ImageIcon, Info, ShieldAlert, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MuscleCatalogEntry } from '../../clinical/catalog'
import {
  citationsForGuidePart,
  evidenceSource,
  type NeedleCitationRef,
  type NeedleGuideResource,
  type NeedleResourceKind,
} from '../../clinical/needleGuideEvidence'
import { needleGuidesForMuscle, type NeedleGuide } from '../../clinical/needleGuides'
import type { Side } from '../../domain/types'
import { Overlay } from '../ui/Overlay'

interface NeedlePointDialogProps {
  muscle: MuscleCatalogEntry
  side: Side
  onClose: () => void
  /** optional queue controls so the guide can be read and added in one pass */
  selectedSides?: Record<Side, boolean>
  onToggleSide?: (side: Side) => void
}

const distanceCue = String.raw`(?:約)?(?:一|二|兩|三|四|五|六|七|八|九|十|\d+)(?:至(?:一|二|兩|三|四|五|六|七|八|九|十|\d+))?(?:指幅|公分|cm)`
const landmarkCue = [
  '肱二頭肌腱',
  '腹股溝韌帶',
  '股動脈搏動',
  '肩胛骨下角',
  '肩胛骨內緣',
  '前上髂棘',
  '坐骨粗隆',
  '脛骨脊',
  '腓骨頭',
  '大轉子',
  '髂嵴',
  '鷹嘴',
  '內上髁',
  '外上髁',
  '莖突',
  '肩胛棘',
  '肩峰',
  '下顎角',
  '中點',
].join('|')
const clinicalCuePattern = new RegExp(`(${distanceCue}|${landmarkCue})`, 'g')
const exactClinicalCuePattern = new RegExp(`^(?:${distanceCue}|${landmarkCue})$`)

function HighlightedClinicalText({ text }: { text: string }) {
  return (
    <>
      {text.split(clinicalCuePattern).map((part, index) => (
        exactClinicalCuePattern.test(part)
          ? <mark className="clinical-emphasis" key={`${part}-${index}`}>{part}</mark>
          : part
      ))}
    </>
  )
}

function sentenceParts(text: string): string[] {
  return text.match(/[^。！？]+[。！？]?/g)?.map((part) => part.trim()).filter(Boolean) ?? [text]
}

const citationRelationLabel: Record<NonNullable<NeedleCitationRef['relation']>, string> = {
  'direct-technique': '直接技術依據',
  'anatomy-only': 'Anatomy only',
  'safety-only': 'Safety only',
  'teaching-support': '次級教學支持',
}

function InlineCitation({ references }: { references: NeedleCitationRef[] }) {
  return (
    <span className="inline-citations">
      {references.map((reference) => {
        const source = evidenceSource(reference.sourceId)
        return (
          <a
            className="inline-citation"
            href={reference.href ?? source.url}
            key={`${reference.sourceId}-${reference.locator}`}
            target="_blank"
            rel="noreferrer"
            title={`${source.citation} — ${reference.locator} — ${citationRelationLabel[reference.relation ?? 'direct-technique']}`}
          >
            {source.shortLabel}
          </a>
        )
      })}
    </span>
  )
}

function CitedClinicalText({ text, references }: { text: string; references: NeedleCitationRef[] }) {
  return (
    <>
      {sentenceParts(text).map((sentence, index) => (
        <span className="cited-sentence" key={`${sentence}-${index}`}>
          <HighlightedClinicalText text={sentence} /> <InlineCitation references={references} />
        </span>
      ))}
    </>
  )
}

const resourceKindLabel: Record<NeedleResourceKind, string> = {
  localization: '定位',
  technique: '操作技巧',
  ultrasound: 'Ultrasound',
  safety: '安全／限制',
}

function ResourceCard({ resource }: { resource: NeedleGuideResource }) {
  const source = evidenceSource(resource.citation.sourceId)
  return (
    <article className={`evidence-resource is-${resource.kind}`}>
      <div className="evidence-resource-head">
        <span>{resourceKindLabel[resource.kind]}</span>
        <span>{source.kind === 'teaching-atlas' ? '次級教材' : source.kind === 'peer-reviewed' ? '同儕審查' : '專業參考'}</span>
      </div>
      <h4>{resource.title}</h4>
      <p>{resource.summary}</p>
      <a href={resource.citation.href ?? source.url} target="_blank" rel="noreferrer">
        <ExternalLink size={14} aria-hidden="true" />
        <span>{source.shortLabel} · {resource.citation.locator}</span>
      </a>
    </article>
  )
}

const mediaKindLabel = {
  anatomy: '解剖圖',
  'surface-landmark': '表面定位',
  ultrasound: 'US 定位',
} as const

function guideReferences(guide: NeedleGuide): NeedleCitationRef[] {
  const references = [
    ...citationsForGuidePart(guide.evidence, 'innervation'),
    ...citationsForGuidePart(guide.evidence, 'insertion'),
    ...citationsForGuidePart(guide.evidence, 'activation'),
    ...guide.clinicalPoints.flatMap((_, index) => citationsForGuidePart(guide.evidence, 'clinicalPoint', index)),
    ...guide.anatomyPoints.flatMap((_, index) => citationsForGuidePart(guide.evidence, 'anatomyPoint', index)),
    ...guide.evidence.resources.map((resource) => resource.citation),
  ]
  return [...new Map(references.map((reference) => [
      `${reference.sourceId}|${reference.locator}|${reference.href ?? ''}|${reference.relation ?? ''}`,
    reference,
  ])).values()]
}

export function NeedlePointDialog({
  muscle,
  side,
  onClose,
  selectedSides,
  onToggleSide,
}: NeedlePointDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const guides = needleGuidesForMuscle(muscle.name)
  const [activeGuideIndex, setActiveGuideIndex] = useState(0)
  const activeGuide = guides[activeGuideIndex] ?? guides[0]
  const hasImages = Boolean(activeGuide?.images.length)
  const isSupplemental = activeGuide?.sourceKind === 'supplemental'

  useEffect(() => {
    setActiveGuideIndex(0)
  }, [muscle.id])

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <Overlay labelledBy="needle-dialog-title" panelClass="needle-dialog" onClose={onClose}>
      <header className="dialog-head">
        <div className="dialog-head-copy">
          <span className="eyebrow">
            {isSupplemental
              ? <Globe2 size={13} aria-hidden="true" />
              : <BookOpen size={13} aria-hidden="true" />}
            {isSupplemental ? '補充圖譜 · 扎針定位' : '課本圖譜 · 扎針定位'}
          </span>
          <h2 id="needle-dialog-title">{activeGuide?.chineseName ?? muscle.name}</h2>
          <p className="dialog-head-meta">
            <span className="dialog-head-en">{activeGuide?.englishName ?? muscle.name}</span>
            <span className={`side-tag side-${side}`}>{side}</span>
            <span>{muscle.rootLabel.replaceAll('-', '–')}</span>
            <span>{muscle.nerveLabel}</span>
          </p>
        </div>
        <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="關閉">
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      {guides.length > 1 ? (
        <div className="variant-tabs" role="tablist" aria-label="選擇肌肉分部">
          {guides.map((guide, index) => (
            <button
              key={guide.id}
              type="button"
              role="tab"
              aria-selected={index === activeGuideIndex}
              className={index === activeGuideIndex ? 'is-active' : ''}
              onClick={() => setActiveGuideIndex(index)}
            >
              {guide.chineseName}
              <span>{guide.englishName}</span>
            </button>
          ))}
        </div>
      ) : null}

      {activeGuide ? (
        <div className="dialog-body">
          <div className="needle-grid">
            {hasImages ? (
              <section className="needle-gallery" aria-label={`${activeGuide.chineseName}圖片`}>
                <div className="panel-heading">
                  <ImageIcon size={16} aria-hidden="true" />
                  <h3>{isSupplemental ? '解剖與定位圖' : '扎針位置與橫切面'}</h3>
                  <span>{activeGuide.images.length} 張</span>
                </div>
                {activeGuide.images.map((image, index) => (
                  <figure className={image.kind ? `is-${image.kind}` : undefined} key={image.src}>
                    <a href={image.src} target="_blank" rel="noreferrer" title="開啟原尺寸圖片">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <span><ExternalLink size={14} aria-hidden="true" /> 放大</span>
                    </a>
                    <figcaption>
                      <span className="needle-image-caption">
                        {image.kind ? <b className={`media-kind is-${image.kind}`}>{mediaKindLabel[image.kind]}</b> : null}
                        <span>{image.caption}</span>
                        {!isSupplemental ? <InlineCitation references={activeGuide.evidence.defaultCitations} /> : null}
                      </span>
                      {image.credit ? (
                        <small className="needle-image-credit">
                          圖片：<a href={image.credit.url} target="_blank" rel="noreferrer">{image.credit.label}</a>
                          <span aria-hidden="true"> · </span>
                          <a href={image.credit.licenseUrl} target="_blank" rel="noreferrer">{image.credit.license}</a>
                        </small>
                      ) : null}
                    </figcaption>
                  </figure>
                ))}
              </section>
            ) : (
              <aside className="no-image-card" aria-label="無圖片文字指引">
                <ImageIcon size={28} strokeWidth={1.4} aria-hidden="true" />
                <strong>目前沒有圖片</strong>
                <p>定位與臨床重點仍可在右側查閱。</p>
              </aside>
            )}

            <section className="needle-details" aria-label={`${activeGuide.chineseName}扎針說明`}>
              <dl className="field-list">
                <div>
                  <dt>神經支配</dt>
                  <dd><CitedClinicalText text={activeGuide.innervation} references={citationsForGuidePart(activeGuide.evidence, 'innervation')} /></dd>
                </div>
                <div>
                  <dt>病人姿勢／扎針方式</dt>
                  <dd><CitedClinicalText text={activeGuide.insertion} references={citationsForGuidePart(activeGuide.evidence, 'insertion')} /></dd>
                </div>
                <div>
                  <dt>肌肉啟動（activation）</dt>
                  <dd><CitedClinicalText text={activeGuide.activation} references={citationsForGuidePart(activeGuide.evidence, 'activation')} /></dd>
                </div>
              </dl>

              <div className="note-block">
                <h3>臨床重點</h3>
                <ul>
                  {activeGuide.clinicalPoints.map((point, index) => (
                    <li key={point}><CitedClinicalText text={point} references={citationsForGuidePart(activeGuide.evidence, 'clinicalPoint', index)} /></li>
                  ))}
                </ul>
              </div>

              {activeGuide.anatomyPoints.length ? (
                <div className="note-block is-caution">
                  <h3><ShieldAlert size={16} aria-hidden="true" /> 橫切面構造與避險</h3>
                  <ul>
                    {activeGuide.anatomyPoints.map((point, index) => (
                      <li key={point}><CitedClinicalText text={point} references={citationsForGuidePart(activeGuide.evidence, 'anatomyPoint', index)} /></li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          </div>

          {activeGuide.sourceKind === 'textbook' && activeGuide.evidence.resources.length ? (
            <section className="evidence-resources" aria-labelledby="external-evidence-title">
              <div className="panel-heading">
                <ExternalLink size={16} aria-hidden="true" />
                <h3 id="external-evidence-title">補充技巧與限制</h3>
                <span>{activeGuide.evidence.resources.length} 項</span>
              </div>
              <div className="evidence-resource-grid">
                {activeGuide.evidence.resources.map((resource) => (
                  <ResourceCard key={`${resource.title}-${resource.citation.locator}`} resource={resource} />
                ))}
              </div>
            </section>
          ) : null}

          <details className="source-note">
            <summary>
              <Info size={16} aria-hidden="true" />
              <span>來源</span>
              <small>{guideReferences(activeGuide).length} 筆精確定位</small>
            </summary>
            <div className="source-note-content">
              <ol className="source-list">
                {guideReferences(activeGuide).map((reference) => {
                  const source = evidenceSource(reference.sourceId)
                  return (
                    <li key={`${reference.sourceId}-${reference.locator}`}>
                      <a href={reference.href ?? source.url} target="_blank" rel="noreferrer">{source.citation}</a>
                      <span>{reference.locator}</span>
                      <small>{citationRelationLabel[reference.relation ?? 'direct-technique']}</small>
                    </li>
                  )
                })}
              </ol>
            </div>
          </details>
        </div>
      ) : (
        <div className="dialog-body">
          <div className="empty-state">
            <ImageIcon size={28} strokeWidth={1.4} aria-hidden="true" />
            <strong>本章沒有這條肌肉的專屬圖譜</strong>
            <p>目前只顯示第 13 章明確收錄且可對應到肌肉目錄的資料。</p>
          </div>
        </div>
      )}

      <footer className="dialog-foot">
        {onToggleSide && selectedSides ? (
          <div className="dialog-foot-add">
            <span>加入清單</span>
            <div className="side-pair">
              {(['L', 'R'] as Side[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`side-button side-${option}${selectedSides[option] ? ' is-on' : ''}`}
                  aria-pressed={selectedSides[option]}
                  aria-label={`${selectedSides[option] ? '移除' : '加入'}${option === 'L' ? '左側' : '右側'} ${muscle.name}`}
                  onClick={() => onToggleSide(option)}
                >
                  <span aria-hidden="true">{option}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <button className="primary-button" type="button" onClick={onClose}>關閉</button>
      </footer>
    </Overlay>
  )
}
