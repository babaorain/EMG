import {
  AlertTriangle,
  BookOpenText,
  ChevronRight,
  CircleDot,
  Gauge,
  Images,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  Zap,
} from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
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
import { Overlay } from './ui/Overlay'

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
            <span className="ncv-index-title">{study.englishTitle}</span>
            <span className="ncv-index-subtitle" lang="zh-Hant">{study.title}</span>
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
          <h2 id={`ncv-${study.id}-title`}>{study.englishTitle}</h2>
          <p className="ncv-detail-subtitle" lang="zh-Hant">{study.title}</p>
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

function NcvFilterPanel({
  region,
  modality,
  regionCounts,
  modalityCounts,
  onRegionChange,
  onModalityChange,
  onReset,
}: {
  region: RegionFilter
  modality: ModalityFilter
  regionCounts: Map<RegionFilter, number>
  modalityCounts: Map<ModalityFilter, number>
  onRegionChange: (value: RegionFilter) => void
  onModalityChange: (value: ModalityFilter) => void
  onReset: () => void
}) {
  const hasFilters = region !== 'all' || modality !== 'all'

  return (
    <div className="filters ncv-filters">
      <div className="filters-head">
        <h2>篩選條件</h2>
        <button type="button" className="ghost-button" onClick={onReset} disabled={!hasFilters}>
          <RotateCcw size={14} aria-hidden="true" />
          重設
        </button>
      </div>

      <fieldset className="filter-block">
        <legend>檢查區域</legend>
        <div className="chip-stack">
          {ncvRegionOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`chip chip-wide${region === option.value ? ' is-active' : ''}`}
              aria-pressed={region === option.value}
              onClick={() => onRegionChange(option.value)}
            >
              <span>{option.label}</span>
              <em>{regionCounts.get(option.value) ?? 0}</em>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-block">
        <legend>檢查類型</legend>
        <div className="chip-stack">
          {ncvModalityOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`chip chip-wide${modality === option.value ? ' is-active' : ''}`}
              aria-pressed={modality === option.value}
              onClick={() => onModalityChange(option.value)}
            >
              <span>{option.label}</span>
              <em>{modalityCounts.get(option.value) ?? 0}</em>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

function NcvStudyIndex({
  commonStudies,
  supplementalStudies,
  selectedId,
  onSelect,
}: {
  commonStudies: NcvStudy[]
  supplementalStudies: NcvStudy[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="ncv-index">
      <StudyIndexGroup title="常用上／下肢" description="例行檢查與常見比較研究優先" studies={commonStudies} selectedId={selectedId} onSelect={onSelect} />
      <StudyIndexGroup title="特殊與延伸" description="近端、顱神經、呼吸與少用技術" studies={supplementalStudies} selectedId={selectedId} onSelect={onSelect} />
    </div>
  )
}

export function NcvPage({ compact, stickyTop }: { compact: boolean; stickyTop: number }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const searchRef = useRef<HTMLInputElement>(null)
  const [region, setRegion] = useState<RegionFilter>('all')
  const [modality, setModality] = useState<ModalityFilter>('all')
  const [selectedId, setSelectedId] = useState(ncvStudies[0]?.id ?? '')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  const filteredStudies = useMemo(() => ncvStudies.filter((study) => (
    (region === 'all' || study.region === region)
    && (modality === 'all' || study.modality === modality)
    && matchesStudy(study, deferredQuery)
  )), [deferredQuery, modality, region])

  const commonStudies = filteredStudies.filter((study) => study.priority === 'common')
  const supplementalStudies = filteredStudies.filter((study) => study.priority === 'supplemental')
  const selectedStudy = filteredStudies.find((study) => study.id === selectedId) ?? filteredStudies[0]
  const activeFilterCount = Number(region !== 'all') + Number(modality !== 'all')

  const regionCounts = useMemo(() => new Map<RegionFilter, number>(
    ncvRegionOptions.map((option) => [
      option.value,
      ncvStudies.filter((study) => (
        matchesStudy(study, deferredQuery)
        && (modality === 'all' || study.modality === modality)
        && (option.value === 'all' || study.region === option.value)
      )).length,
    ]),
  ), [deferredQuery, modality])

  const modalityCounts = useMemo(() => new Map<ModalityFilter, number>(
    ncvModalityOptions.map((option) => [
      option.value,
      ncvStudies.filter((study) => (
        matchesStudy(study, deferredQuery)
        && (region === 'all' || study.region === region)
        && (option.value === 'all' || study.modality === option.value)
      )).length,
    ]),
  ), [deferredQuery, region])

  useEffect(() => {
    if (selectedStudy && selectedStudy.id !== selectedId) setSelectedId(selectedStudy.id)
  }, [selectedId, selectedStudy])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const resetFilters = () => {
    setRegion('all')
    setModality('all')
  }

  const clearAll = () => {
    setQuery('')
    resetFilters()
  }

  const filterPanel = (
    <NcvFilterPanel
      region={region}
      modality={modality}
      regionCounts={regionCounts}
      modalityCounts={modalityCounts}
      onRegionChange={setRegion}
      onModalityChange={setModality}
      onReset={resetFilters}
    />
  )

  const railStyle = {
    top: stickyTop + 20,
    maxHeight: `calc(100vh - ${stickyTop + 40}px)`,
  }

  return (
    <main className="workspace ncv-workspace">
      {compact ? null : (
        <aside className="rail rail-filters" aria-label="NCV 篩選條件" style={railStyle}>
          {filterPanel}
        </aside>
      )}

      <section className="library ncv-library" aria-labelledby="ncv-library-title">
        <h2 id="ncv-library-title" className="sr-only">Nerve Conduction Studies 神經傳導檢查</h2>

        <div className="library-bar" style={{ top: stickyTop }}>
          <label className="searchbar">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">搜尋 NCV 檢查</span>
            <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋 study / nerve / muscle" />
            {query ? (
              <button type="button" onClick={() => setQuery('')} aria-label="清除搜尋">
                <X size={16} aria-hidden="true" />
              </button>
            ) : <kbd aria-hidden="true">/</kbd>}
          </label>
          {compact ? (
            <button type="button" className="filter-trigger" aria-label="篩選 NCV 檢查" onClick={() => setFilterSheetOpen(true)}>
              <SlidersHorizontal size={17} aria-hidden="true" />
              <span>篩選</span>
              {activeFilterCount > 0 ? <em>{activeFilterCount}</em> : null}
            </button>
          ) : null}
          <p className="library-count" aria-live="polite"><strong>{filteredStudies.length}</strong> 項檢查</p>
        </div>

        <section className="ncv-safety-note" aria-label="正常值判讀限制">
          <AlertTriangle size={21} aria-hidden="true" />
          <div>
            <strong>相同技術條件才可套用正常值</strong>
            <p>先確認皮膚溫度、距離、電極位置與 supramaximal stimulation；個案判讀仍以所屬實驗室驗證過的 reference values 為準。</p>
          </div>
        </section>

        {selectedStudy ? (
          <>
            {compact ? (
              <nav className="ncv-mobile-index" aria-label="NCV 檢查清單">
                <NcvStudyIndex commonStudies={commonStudies} supplementalStudies={supplementalStudies} selectedId={selectedStudy.id} onSelect={setSelectedId} />
              </nav>
            ) : null}
            <NcvStudyDetail study={selectedStudy} />
          </>
        ) : (
          <div className="ncv-empty">
            <Search size={24} aria-hidden="true" />
            <h3>沒有符合條件的檢查</h3>
            <p>清除搜尋字詞，或切回「全部區域／全部類型」。</p>
            <button type="button" onClick={clearAll}>清除篩選</button>
          </div>
        )}

        <section className="ncv-sources" aria-labelledby="ncv-sources-title">
          <BookOpenText size={21} aria-hidden="true" />
          <div>
            <h3 id="ncv-sources-title">資料來源與使用範圍</h3>
            <p>技術步驟、圖版與本頁所列數值以 <cite>Electromyography and Neuromuscular Disorders</cite>, 4th ed. (2020) 第 4、10、11 章為主。AANEM 的 reference values 資源僅用於提醒實驗室應建立與驗證自己的常模。</p>
            <a href="https://www.aanem.org/certification-accreditation/edx-laboratory-accreditation/my-accreditation-dashboard/application-resources" target="_blank" rel="noreferrer">AANEM Laboratory Accreditation resources</a>
          </div>
        </section>
      </section>

      {compact || !selectedStudy ? null : (
        <aside className="queue-panel rail ncv-study-panel" aria-labelledby="ncv-index-title" style={railStyle}>
          <header className="queue-head">
            <div>
              <span className="eyebrow">Study index</span>
              <h2 id="ncv-index-title">檢查項目 <span className="count-badge">{filteredStudies.length}</span></h2>
            </div>
          </header>
          <div className="queue-body">
            <NcvStudyIndex commonStudies={commonStudies} supplementalStudies={supplementalStudies} selectedId={selectedStudy.id} onSelect={setSelectedId} />
          </div>
        </aside>
      )}

      {filterSheetOpen ? (
        <Overlay labelledBy="ncv-filter-sheet-title" panelClass="sheet filter-sheet" onClose={() => setFilterSheetOpen(false)}>
          <header className="sheet-head">
            <div>
              <span className="eyebrow">Filters</span>
              <h2 id="ncv-filter-sheet-title">篩選 NCV 檢查</h2>
            </div>
            <button type="button" className="icon-button" onClick={() => setFilterSheetOpen(false)} aria-label="關閉">
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <div className="sheet-body">{filterPanel}</div>
          <footer className="sheet-foot">
            <button type="button" className="primary-button" onClick={() => setFilterSheetOpen(false)}>顯示 {filteredStudies.length} 項檢查</button>
          </footer>
        </Overlay>
      ) : null}
    </main>
  )
}
