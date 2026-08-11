import { ExternalLink, ImageIcon, Info, ShieldAlert, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MuscleCatalogEntry } from '../../clinical/catalog'
import { needleGuidesForMuscle } from '../../clinical/needleGuides'
import type { Side } from '../../domain/types'

interface NeedlePointDialogProps {
  muscle: MuscleCatalogEntry
  side: Side
  onClose: () => void
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

export function NeedlePointDialog({ muscle, side, onClose }: NeedlePointDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const guides = needleGuidesForMuscle(muscle.name)
  const [activeGuideIndex, setActiveGuideIndex] = useState(0)
  const activeGuide = guides[activeGuideIndex] ?? guides[0]

  useEffect(() => {
    setActiveGuideIndex(0)
  }, [muscle.id])

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog needle-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="needle-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dialog-header needle-dialog-header">
          <div>
            <div className="needle-title-line">
              <h2 id="needle-dialog-title">
                {activeGuide?.chineseName ?? muscle.name}
              </h2>
              <span>扎針圖譜</span>
            </div>
            <p>
              {activeGuide?.englishName ?? muscle.name} · {side === 'L' ? '左側' : '右側'} · {muscle.rootLabel} · {muscle.nerveLabel}
            </p>
          </div>
          <button ref={closeRef} className="dialog-close" type="button" onClick={onClose} aria-label="關閉">
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        {guides.length > 1 ? (
          <div className="needle-variant-tabs" role="tablist" aria-label="選擇肌肉分部">
            {guides.map((guide, index) => (
              <button
                key={guide.id}
                type="button"
                role="tab"
                aria-selected={index === activeGuideIndex}
                className={index === activeGuideIndex ? 'active' : ''}
                onClick={() => setActiveGuideIndex(index)}
              >
                {guide.chineseName}
                <span>{guide.englishName}</span>
              </button>
            ))}
          </div>
        ) : null}

        {activeGuide ? (
          <div className="needle-dialog-scroll">
            <div className="needle-dialog-body">
              <section className="needle-gallery" aria-label={`${activeGuide.chineseName}圖片`}>
                <div className="needle-section-heading">
                  <ImageIcon size={17} aria-hidden="true" />
                  <h3>扎針位置與橫切面</h3>
                  <span>{activeGuide.images.length} 張</span>
                </div>
                {activeGuide.images.map((image) => (
                  <figure key={image.src}>
                    <a href={image.src} target="_blank" rel="noreferrer" title="開啟原尺寸圖片">
                      <img src={image.src} alt={image.alt} />
                      <span><ExternalLink size={15} aria-hidden="true" /> 原尺寸</span>
                    </a>
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </section>

              <section className="needle-guide-details" aria-label={`${activeGuide.chineseName}扎針說明`}>
                <dl className="needle-core-fields">
                  <div>
                    <dt>神經支配</dt>
                    <dd>{activeGuide.innervation}</dd>
                  </div>
                  <div>
                    <dt>病人姿勢／扎針方式</dt>
                    <dd><HighlightedClinicalText text={activeGuide.insertion} /></dd>
                  </div>
                  <div className="activation-field">
                    <dt>肌肉啟動（activation）</dt>
                    <dd>{activeGuide.activation}</dd>
                  </div>
                </dl>

                <div className="needle-point-section">
                  <h3>臨床重點</h3>
                  <ul>
                    {activeGuide.clinicalPoints.map((point) => (
                      <li key={point}><HighlightedClinicalText text={point} /></li>
                    ))}
                  </ul>
                </div>

                <div className="needle-point-section caution">
                  <h3><ShieldAlert size={17} aria-hidden="true" /> 橫切面構造與避險</h3>
                  {activeGuide.anatomyPoints.length ? (
                    <ul>
                      {activeGuide.anatomyPoints.map((point) => (
                        <li key={point}><HighlightedClinicalText text={point} /></li>
                      ))}
                    </ul>
                  ) : <p>本章未另列此肌肉的橫切面避險文字；請依圖示構造判讀。</p>}
                </div>
              </section>
            </div>

            <div className="needle-review-note">
              <Info size={17} aria-hidden="true" />
              <span>
                私人臨床參考用。翻譯整理自 Preston &amp; Shapiro, <i>Electromyography and Neuromuscular Disorders</i>, 4th ed. (2020), Chapter 13, Fig. {figureLabel(activeGuide.figures)}。
              </span>
            </div>
          </div>
        ) : (
          <div className="needle-empty-guide">
            <ImageIcon size={32} strokeWidth={1.4} aria-hidden="true" />
            <strong>本章沒有這條肌肉的專屬圖譜</strong>
            <p>目前只顯示第 13 章明確收錄且可對應到肌肉目錄的資料。</p>
          </div>
        )}

        <footer className="dialog-footer">
          <button className="primary-small-button" type="button" onClick={onClose}>關閉</button>
        </footer>
      </section>
    </div>
  )
}
