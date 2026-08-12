import { BookOpen, ExternalLink, ImageIcon, Info, ShieldAlert, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MuscleCatalogEntry } from '../../clinical/catalog'
import { needleGuidesForMuscle } from '../../clinical/needleGuides'
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

function figureLabel(figures: number[]): string {
  return figures.map((figure) => `13.${figure}`).join('、')
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
            <BookOpen size={13} aria-hidden="true" />
            扎針定位
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
          <div className={`needle-grid${hasImages ? '' : ' text-only'}`}>
            {hasImages ? (
              <section className="needle-gallery" aria-label={`${activeGuide.chineseName}圖片`}>
                <div className="panel-heading">
                  <ImageIcon size={16} aria-hidden="true" />
                  <h3>扎針位置與橫切面</h3>
                  <span>{activeGuide.images.length} 張</span>
                </div>
                {activeGuide.images.map((image, index) => (
                  <figure key={image.src}>
                    <a href={image.src} target="_blank" rel="noreferrer" title="開啟原尺寸圖片">
                      <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                      <span><ExternalLink size={14} aria-hidden="true" /> 原尺寸</span>
                    </a>
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </section>
            ) : (
              <aside className="no-image-card" aria-label="無圖片文字指引">
                <ImageIcon size={28} strokeWidth={1.4} aria-hidden="true" />
                <strong>目前沒有課本圖片</strong>
                <p>以下提供可查核的文字版定位與安全提醒。</p>
              </aside>
            )}

            <section className="needle-details" aria-label={`${activeGuide.chineseName}扎針說明`}>
              <dl className="field-list">
                <div>
                  <dt>神經支配</dt>
                  <dd>{activeGuide.innervation}</dd>
                </div>
                <div>
                  <dt>病人姿勢／扎針方式</dt>
                  <dd><HighlightedClinicalText text={activeGuide.insertion} /></dd>
                </div>
                <div>
                  <dt>肌肉啟動（activation）</dt>
                  <dd>{activeGuide.activation}</dd>
                </div>
              </dl>

              <div className="note-block">
                <h3>臨床重點</h3>
                <ul>
                  {activeGuide.clinicalPoints.map((point) => (
                    <li key={point}><HighlightedClinicalText text={point} /></li>
                  ))}
                </ul>
              </div>

              {activeGuide.anatomyPoints.length ? (
                <div className="note-block is-caution">
                  <h3><ShieldAlert size={16} aria-hidden="true" /> 橫切面構造與避險</h3>
                  <ul>
                    {activeGuide.anatomyPoints.map((point) => (
                      <li key={point}><HighlightedClinicalText text={point} /></li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          </div>

          <div className="source-note">
            <Info size={16} aria-hidden="true" />
            <div>
              {activeGuide.sourceKind === 'textbook' ? (
                <span>
                  私人臨床參考用。翻譯整理自 Preston &amp; Shapiro, <i>Electromyography and Neuromuscular Disorders</i>, 4th ed. (2020), Chapter 13, Fig. {figureLabel(activeGuide.figures)}；肌肉專屬內容另參照下列指引。
                </span>
              ) : (
                <span>無原書圖片的文字補充；依系統性 needle EMG 技術文章、標準區域解剖與安全指引整理。</span>
              )}
              <ul>
                {activeGuide.sources.map((source) => (
                  <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
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
