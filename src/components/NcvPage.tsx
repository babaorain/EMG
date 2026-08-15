import {
  AlertTriangle,
  BookOpenText,
  ChevronRight,
  CircleDot,
  Gauge,
  Images,
  Search,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  ncvModalityLabels,
  ncvModalityOptions,
  ncvRegionLabels,
  ncvRegionOptions,
  ncvStudies,
  type NcvModality,
  type NcvRegion,
  type NcvStudy,
} from '../clinical/ncvStudies'

type RegionFilter = 'all' | NcvRegion
type ModalityFilter = 'all' | NcvModality

function matchesStudy(study: NcvStudy, query: string): boolean {
  if (!query) return true
  return [
    study.title,
    study.englishTitle,
    study.nerve,
    study.recording.target,
    study.sourceLocator,
    ...(study.searchTerms ?? []),
  ].some((value) => value.toLowerCase().includes(query))
}

function StudyIndexGroup({
  title,
  description,
  studies,
  selectedId,
  onSelect,
}: {
  title: string
  description: string
  studies: NcvStudy[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  if (!studies.length) return null

  return (
    <section className="ncv-index-group">
      <header>
        <div><h3>{title}</h3><span>{studies.length}</span></div>
        <p>{description}</p>
      </header>
      <div className="ncv-index-list">
        {studies.map((study) => (
          <button
            type="button"
            key={study.id}
            className={selectedId === study.id ? 'is-active' : ''}
            aria-pressed={selectedId === study.id}
            onClick={() => onSelect(study.id)}
          >
            <span className="ncv-index-title">{study.title}</span>
            <span className="ncv-index-meta">
              {ncvRegionLabels[study.region]} · {ncvModalityLabels[study.modality]}
            </span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}

function NcvStudyDetail({ study }: { study: NcvStudy }) {
  return (
    <article className="ncv-detail" aria-labelledby={`ncv-${study.id}-title`}>
      <header className="ncv-detail-head">
        <div>
          <div className="ncv-detail-tags">
            <span>{ncvRegionLabels[study.region]}</span>
            <span>{ncvModalityLabels[study.modality]}</span>
            <span>{study.priority === 'common' ? '常用檢查' : '特殊／延伸'}</span>
          </div>
          <h2 id={`ncv-${study.id}-title`}>{study.title}</h2>
          <p>{study.englishTitle}</p>
        </div>
        <div className="ncv-nerve-label"><Zap size={17} aria-hidden="true" /><span>{study.nerve}</span></div>
      </header>

      <section className="ncv-montage-section" aria-labelledby={`ncv-${study.id}-montage`}>
        <div className="ncv-block-heading">
          <div><CircleDot size={18} aria-hidden="true" /><h3 id={`ncv-${study.id}-montage`}>貼片與姿勢</h3></div>
          <span>{study.recording.target}</span>
        </div>
        <div className="ncv-electrode-grid">
          <div className="g1"><span>G1</span><p>{study.recording.g1}</p></div>
          <div className="g2"><span>G2</span><p>{study.recording.g2}</p></div>
          <div className="ground"><span>GROUND</span><p>{study.recording.ground}</p></div>
        </div>
        <dl className="ncv-setup-notes">
          <div><dt>陰極方向</dt><dd>{study.cathode}</dd></div>
          <div><dt>受檢姿勢</dt><dd>{study.position}</dd></div>
        </dl>
      </section>

      <section className="ncv-stimulation-section" aria-labelledby={`ncv-${study.id}-stim`}>
        <div className="ncv-block-heading">
          <div><Zap size={18} aria-hidden="true" /><h3 id={`ncv-${study.id}-stim`}>刺激位置</h3></div>
          <span>{study.stimulations.length} 個位置</span>
        </div>
        <ol className="ncv-stimulation-list">
          {study.stimulations.map((site, index) => (
            <li key={`${study.id}-${site.label}`}>
              <span className="ncv-stim-number">{String(index + 1).padStart(2, '0')}</span>
              <div><h4>{site.label}</h4><p>{site.site}</p></div>
              {site.distance ? <strong>{site.distance}</strong> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="ncv-image-section" aria-labelledby={`ncv-${study.id}-images`}>
        <div className="ncv-block-heading">
          <div><Images size={18} aria-hidden="true" /><h3 id={`ncv-${study.id}-images`}>課本圖版</h3></div>
          <span>{study.images.length} 張</span>
        </div>
        <div className={`ncv-image-grid count-${Math.min(study.images.length, 4)}`}>
          {study.images.map((entry, index) => (
            <figure key={entry.src}>
              <div><img src={entry.src} alt={entry.alt} loading={index === 0 ? 'eager' : 'lazy'} /></div>
              <figcaption><span>{String(index + 1).padStart(2, '0')}</span><p>{entry.caption}</p></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="ncv-interpretation-grid">
        <section className="ncv-normal-values" aria-labelledby={`ncv-${study.id}-normal`}>
          <div className="ncv-block-heading">
            <div><Gauge size={18} aria-hidden="true" /><h3 id={`ncv-${study.id}-normal`}>課本成人參考值</h3></div>
          </div>
          <ul>{study.normalValues.map((value) => <li key={value}>{value}</li>)}</ul>
        </section>

        <section className="ncv-pitfalls" aria-labelledby={`ncv-${study.id}-pitfalls`}>
          <div className="ncv-block-heading">
            <div><AlertTriangle size={18} aria-hidden="true" /><h3 id={`ncv-${study.id}-pitfalls`}>注意事項</h3></div>
          </div>
          <ul>{study.notes.map((note) => <li key={note}>{note}</li>)}</ul>
        </section>
      </div>

      <footer className="ncv-source-locator">
        <BookOpenText size={17} aria-hidden="true" />
        <span>Preston &amp; Shapiro, 4th ed. (2020) · {study.sourceLocator}</span>
      </footer>
    </article>
  )
}

export function NcvPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const [region, setRegion] = useState<RegionFilter>('all')
  const [modality, setModality] = useState<ModalityFilter>('all')
  const [selectedId, setSelectedId] = useState(ncvStudies[0]?.id ?? '')

  const filteredStudies = useMemo(() => ncvStudies.filter((study) => (
    (region === 'all' || study.region === region)
    && (modality === 'all' || study.modality === modality)
    && matchesStudy(study, deferredQuery)
  )), [deferredQuery, modality, region])

  const commonStudies = filteredStudies.filter((study) => study.priority === 'common')
  const supplementalStudies = filteredStudies.filter((study) => study.priority === 'supplemental')
  const selectedStudy = filteredStudies.find((study) => study.id === selectedId) ?? filteredStudies[0]

  useEffect(() => {
    if (selectedStudy && selectedStudy.id !== selectedId) setSelectedId(selectedStudy.id)
  }, [selectedId, selectedStudy])

  return (
    <main className="ncv-page">
      <section className="ncv-hero" aria-labelledby="ncv-title">
        <div>
          <span className="section-kicker">Nerve conduction atlas</span>
          <h2 id="ncv-title">NCV 貼片與刺激位置</h2>
          <p>以 Preston 與 Shapiro 第 4 版為主軸，先列常用上、下肢檢查，再收錄顱神經、呼吸與較少用技術。</p>
        </div>
        <dl>
          <div><dt>檢查項目</dt><dd>{ncvStudies.length}</dd></div>
          <div><dt>課本圖版</dt><dd>58</dd></div>
          <div><dt>主要章節</dt><dd>Ch. 4 · 10 · 11</dd></div>
        </dl>
      </section>

      <section className="ncv-safety-note" aria-label="正常值判讀限制">
        <AlertTriangle size={21} aria-hidden="true" />
        <div>
          <strong>正常值只能在相同技術條件下使用</strong>
          <p>先確認皮膚溫度、距離、電極位置與 supramaximal stimulation；年齡、身高、肢長及實驗室常模都會改變界值。個案判讀以所屬實驗室驗證過的 reference values 為準。</p>
        </div>
      </section>

      <section className="ncv-browser" aria-labelledby="ncv-browser-title">
        <header className="ncv-browser-head">
          <div><span className="section-kicker">Technique browser</span><h2 id="ncv-browser-title">選擇檢查</h2></div>
          <span>{filteredStudies.length} / {ncvStudies.length}</span>
        </header>

        <div className="ncv-toolbar">
          <label className="ncv-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">搜尋 NCV 檢查</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋神經、肌肉或檢查名稱…" />
          </label>
          <div className="ncv-filter-set" aria-label="區域篩選">
            <SlidersHorizontal size={16} aria-hidden="true" />
            {ncvRegionOptions.map((option) => (
              <button type="button" key={option.value} className={region === option.value ? 'is-active' : ''} onClick={() => setRegion(option.value)}>{option.label}</button>
            ))}
          </div>
          <div className="ncv-filter-set modality" aria-label="檢查類型篩選">
            {ncvModalityOptions.map((option) => (
              <button type="button" key={option.value} className={modality === option.value ? 'is-active' : ''} onClick={() => setModality(option.value)}>{option.label}</button>
            ))}
          </div>
        </div>

        {selectedStudy ? (
          <div className="ncv-browser-layout">
            <aside className="ncv-index" aria-label="NCV 檢查清單">
              <StudyIndexGroup title="常用上／下肢" description="例行檢查與常見比較研究優先" studies={commonStudies} selectedId={selectedStudy.id} onSelect={setSelectedId} />
              <StudyIndexGroup title="特殊與延伸" description="近端、顱神經、呼吸與少用技術" studies={supplementalStudies} selectedId={selectedStudy.id} onSelect={setSelectedId} />
            </aside>
            <NcvStudyDetail study={selectedStudy} />
          </div>
        ) : (
          <div className="ncv-empty">
            <Search size={24} aria-hidden="true" />
            <h3>沒有符合條件的檢查</h3>
            <p>清除搜尋字詞，或切回「全部區域／全部類型」。</p>
            <button type="button" onClick={() => { setQuery(''); setRegion('all'); setModality('all') }}>清除篩選</button>
          </div>
        )}
      </section>

      <section className="ncv-sources" aria-labelledby="ncv-sources-title">
        <BookOpenText size={21} aria-hidden="true" />
        <div>
          <h2 id="ncv-sources-title">資料來源與使用範圍</h2>
          <p>技術步驟、圖版與本頁所列數值以 <cite>Electromyography and Neuromuscular Disorders</cite>, 4th ed. (2020) 第 4、10、11 章為主。AANEM 的 reference values 資源僅用於提醒實驗室應建立與驗證自己的常模。</p>
          <a href="https://www.aanem.org/certification-accreditation/edx-laboratory-accreditation/my-accreditation-dashboard/application-resources" target="_blank" rel="noreferrer">AANEM Laboratory Accreditation resources</a>
        </div>
      </section>
    </main>
  )
}
