import {
  AlertTriangle,
  BookOpenText,
  ChevronRight,
  CircleDot,
  Gauge,
  Images,
  Search,
  SlidersHorizontal,
  X,
  Zap,
} from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import {
  ncvModalityLabels,
  ncvRegionLabels,
  ncvStudies,
  type NcvStudy,
} from '../clinical/ncvStudies'
import {
  ncvCategoryOptions,
  ncvNavigationGroups,
  type NcvCategory,
  type NcvNavigationEntry,
  type NcvNavigationGroup,
} from '../clinical/ncvNavigation'

interface NcvStudyIndexEntry extends NcvNavigationEntry {
  study: NcvStudy
}

interface NcvStudyIndexGroup extends Omit<NcvNavigationGroup, 'entries'> {
  entries: NcvStudyIndexEntry[]
}

function matchesStudy(study: NcvStudy, entry: NcvNavigationEntry, query: string): boolean {
  if (!query) return true
  return [
    entry.listTitle,
    entry.listSubtitle,
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
  entries,
  selectedId,
  onSelect,
}: {
  title: string
  description: string
  entries: NcvStudyIndexEntry[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  if (!entries.length) return null

  return (
    <section className="ncv-index-group">
      <header>
        <div><h3>{title}</h3><span>{entries.length}</span></div>
        <p>{description}</p>
      </header>
      <div className="ncv-index-list">
        {entries.map(({ study, listTitle, listSubtitle }) => (
          <button
            type="button"
            key={study.id}
            className={selectedId === study.id ? 'is-active' : ''}
            aria-pressed={selectedId === study.id}
            onClick={() => onSelect(study.id)}
          >
            <span className="ncv-index-title">{listTitle}</span>
            <span className="ncv-index-subtitle" lang="zh-Hant">{listSubtitle}</span>
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

      <section className="ncv-evidence-section" aria-label="課本圖版、成人參考值與注意事項">
        <div className="ncv-image-column">
          <div className="ncv-block-heading">
            <div><Images size={18} aria-hidden="true" /><h3 id={`ncv-${study.id}-images`}>課本圖版</h3></div>
            <span>{study.images.length} 張</span>
          </div>
          <div className={`ncv-image-grid count-${Math.min(study.images.length, 4)}`} aria-labelledby={`ncv-${study.id}-images`}>
            {study.images.map((entry, index) => (
              <figure key={entry.src}>
                <div><img src={entry.src} alt={entry.alt} loading={index === 0 ? 'eager' : 'lazy'} /></div>
                <figcaption><span>{String(index + 1).padStart(2, '0')}</span><p>{entry.caption}</p></figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="ncv-reference-column">
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
      </section>

      <footer className="ncv-source-locator">
        <BookOpenText size={17} aria-hidden="true" />
        <span>Preston &amp; Shapiro, 4th ed. (2020) · {study.sourceLocator}</span>
      </footer>
    </article>
  )
}

function NcvCategoryBar({
  category,
  onChange,
}: {
  category: NcvCategory
  onChange: (value: NcvCategory) => void
}) {
  return (
    <div className="ncv-filter-bar" aria-label="NCV 檢查區域">
      <SlidersHorizontal size={17} aria-hidden="true" />
      <div className="ncv-category-options" role="group" aria-label="檢查區域">
        {ncvCategoryOptions.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`chip${category === option.value ? ' is-active' : ''}`}
            aria-pressed={category === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function NcvStudyIndex({
  groups,
  selectedId,
  onSelect,
}: {
  groups: NcvStudyIndexGroup[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="ncv-index">
      {groups.map((group) => (
        <StudyIndexGroup key={group.id} {...group} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  )
}

export function NcvPage({ compact, stickyTop }: { compact: boolean; stickyTop: number }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const searchRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<NcvCategory>('upper')
  const [selectedId, setSelectedId] = useState(ncvStudies[0]?.id ?? '')

  const studyById = useMemo(() => new Map(ncvStudies.map((study) => [study.id, study])), [])
  const categoryGroups = ncvNavigationGroups[category]
  const groups = useMemo<NcvStudyIndexGroup[]>(() => categoryGroups.map((group) => ({
    ...group,
    entries: group.entries.flatMap((entry) => {
      const study = studyById.get(entry.studyId)
      return study && matchesStudy(study, entry, deferredQuery) ? [{ ...entry, study }] : []
    }),
  })).filter((group) => group.entries.length > 0), [categoryGroups, deferredQuery, studyById])
  const filteredEntries = groups.flatMap((group) => group.entries)
  const selectedEntry = filteredEntries.find((entry) => entry.study.id === selectedId) ?? filteredEntries[0]
  const selectedStudy = selectedEntry?.study
  const categoryTotal = categoryGroups.reduce((total, group) => total + group.entries.length, 0)

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

  const clearAll = () => {
    setQuery('')
  }

  const railStyle = {
    top: stickyTop + 20,
    maxHeight: `calc(100vh - ${stickyTop + 40}px)`,
  }

  return (
    <main className="workspace ncv-workspace">
      {compact ? null : (
        <aside className="rail ncv-left-rail" aria-label="NCV 檢查項目" style={railStyle}>
          {selectedStudy ? (
            <section className="queue-panel ncv-study-panel" aria-labelledby="ncv-index-title">
              <header className="queue-head">
                <div>
                  <span className="eyebrow">Study index</span>
                  <h2 id="ncv-index-title">檢查項目 <span className="count-badge">{filteredEntries.length}</span></h2>
                </div>
              </header>
              <div className="queue-body">
                <NcvStudyIndex groups={groups} selectedId={selectedStudy.id} onSelect={setSelectedId} />
              </div>
            </section>
          ) : null}
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
          <p className="library-count" aria-live="polite"><strong>{filteredEntries.length}</strong> / {categoryTotal} 項</p>
        </div>

        <NcvCategoryBar category={category} onChange={setCategory} />

        {selectedStudy ? (
          <>
            {compact ? (
              <nav className="ncv-mobile-index" aria-label="NCV 檢查清單">
                <NcvStudyIndex groups={groups} selectedId={selectedStudy.id} onSelect={setSelectedId} />
              </nav>
            ) : null}
            <NcvStudyDetail study={selectedStudy} />
          </>
        ) : (
          <div className="ncv-empty">
            <Search size={24} aria-hidden="true" />
            <h3>沒有符合條件的檢查</h3>
            <p>清除搜尋字詞，或切換至其他檢查區域。</p>
            <button type="button" onClick={clearAll}>清除搜尋</button>
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

    </main>
  )
}
