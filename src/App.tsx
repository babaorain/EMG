import { Activity, Cable, Crosshair, GitBranch, Info } from 'lucide-react'
import { lazy, Suspense, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  bookSourcedMuscleCount,
  muscleById,
  muscleCatalog,
  type MuscleCatalogEntry,
} from './clinical/catalog'
import {
  clinicalAreaForMuscle,
  clinicalAreaLabel,
  clinicalAreaRank,
  type MuscleArea,
} from './clinical/clinicalAreas'
import { hasNeedleGuideImage } from './clinical/needleGuideAvailability'
import { FilterPanel } from './components/picker/FilterPanel'
import { FilterSheet } from './components/picker/FilterSheet'
import { activeFilterCount, type AreaFilter } from './components/picker/filterState'
import { MuscleLibrary } from './components/picker/MuscleLibrary'
import { QueueBar, QueueSheet } from './components/picker/QueueBar'
import {
  SelectedMusclesPanel,
  type ResolvedSelectedMuscle,
} from './components/picker/SelectedMusclesPanel'
import { COMPACT_QUERY, useMediaQuery } from './hooks/useMediaQuery'
import {
  compareMuscles,
  matchesRootFilter,
  rootRank,
  selectedKey,
  THORACIC_PARASPINAL_FILTER,
  type SelectedMuscle,
} from './domain/muscleSelection'
import type { Side } from './domain/types'

const BrachialPlexusPage = lazy(() => import('./components/BrachialPlexusPage').then((module) => ({
  default: module.BrachialPlexusPage,
})))
const DermatomePage = lazy(() => import('./components/DermatomePage').then((module) => ({
  default: module.DermatomePage,
})))
const NcvPage = lazy(() => import('./components/NcvPage').then((module) => ({
  default: module.NcvPage,
})))
const NeedlePointDialog = lazy(() => import('./components/picker/NeedlePointDialog').then((module) => ({
  default: module.NeedlePointDialog,
})))
const WorksheetDialog = lazy(() => import('./components/picker/WorksheetDialog').then((module) => ({
  default: module.WorksheetDialog,
})))

const visibleRoots = [
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', THORACIC_PARASPINAL_FILTER,
  'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4',
  'V', 'VII', 'XI', 'XII',
]

type AppPage = 'muscles' | 'ncv' | 'dermatomes' | 'brachial-plexus'

const pageTabs = [
  { id: 'muscles', hash: '#muscles', label: '肌肉／扎針', short: '肌肉', Icon: Crosshair },
  { id: 'ncv', hash: '#ncv', label: 'NCV 傳導技術', short: 'NCV', Icon: Cable },
  { id: 'dermatomes', hash: '#dermatomes', label: 'Dermatome 皮節', short: '皮節', Icon: Activity },
  { id: 'brachial-plexus', hash: '#brachial-plexus', label: 'Brachial plexus', short: 'Plexus', Icon: GitBranch },
] as const satisfies ReadonlyArray<{ id: AppPage; hash: string; label: string; short: string; Icon: typeof Info }>

const pageCopy: Record<AppPage, { subtitle: string; status: string }> = {
  muscles: {
    subtitle: '肌肉選擇、扎針定位與空白 worksheet',
    status: `${bookSourcedMuscleCount} 條課本圖譜 · ${muscleCatalog.length - bookSourcedMuscleCount} 條文字指引`,
  },
  ncv: {
    subtitle: '貼片、刺激位置、距離與技術陷阱',
    status: '34 項檢查 · 58 張課本圖版',
  },
  dermatomes: {
    subtitle: '皮節分布與標準化感覺檢查點',
    status: 'C2–S4/5 · 28 個標準檢查點',
  },
  'brachial-plexus': {
    subtitle: 'Brachial plexus 的 trunk 與 cord 定位',
    status: 'C5–T1 · 3 trunks · 3 cords',
  },
}

function pageFromHash(): AppPage {
  if (window.location.hash === '#ncv') return 'ncv'
  if (window.location.hash === '#dermatomes') return 'dermatomes'
  if (window.location.hash === '#brachial-plexus') return 'brachial-plexus'
  return 'muscles'
}

function LoadingNotice({ children }: { children: string }) {
  return (
    <div className="loading-notice" role="status">
      <Activity size={17} aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

function matchesQuery(muscle: MuscleCatalogEntry, query: string): boolean {
  if (!query) return true
  return [
    muscle.name,
    muscle.nerveLabel,
    muscle.rootLabel,
    clinicalAreaLabel(muscle),
    ...muscle.abbreviations,
  ].some((value) => value.toLowerCase().includes(query))
}

function App() {
  const [activePage, setActivePage] = useState<AppPage>(pageFromHash)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const [area, setArea] = useState<AreaFilter>('all')
  const [root, setRoot] = useState('all')
  const [selected, setSelected] = useState<SelectedMuscle[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [needleTarget, setNeedleTarget] = useState<{ muscle: MuscleCatalogEntry; side: Side } | null>(null)
  const [worksheetOpen, setWorksheetOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [queueSheetOpen, setQueueSheetOpen] = useState(false)

  const compact = useMediaQuery(COMPACT_QUERY)
  const topbarRef = useRef<HTMLElement>(null)
  const [topbarHeight, setTopbarHeight] = useState(60)

  useEffect(() => {
    const handleHashChange = () => setActivePage(pageFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  /**
   * The top bar wraps to two rows on narrow screens, so the sticky search bar
   * and the side rails need its measured height to sit right below it.
   */
  useEffect(() => {
    const element = topbarRef.current
    if (!element) return
    const sync = () => setTopbarHeight(Math.round(element.getBoundingClientRect().height))
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!compact) {
      setFilterSheetOpen(false)
      setQueueSheetOpen(false)
    }
  }, [compact])

  const queryMatches = useMemo(
    () => muscleCatalog.filter((muscle) => matchesQuery(muscle, deferredQuery)),
    [deferredQuery],
  )

  const muscles = useMemo(() => {
    return queryMatches
      .filter((muscle) => area === 'all' || clinicalAreaForMuscle(muscle) === area)
      .filter((muscle) => matchesRootFilter(muscle, root))
      .sort((a, b) => (
        clinicalAreaRank(a) - clinicalAreaRank(b)
        || Number(hasNeedleGuideImage(b.name)) - Number(hasNeedleGuideImage(a.name))
        || compareMuscles(a, b)
      ))
  }, [area, queryMatches, root])

  /** Counts ignore the filter they describe, so a chip never reads zero for itself. */
  const areaCounts = useMemo(() => {
    const counts = new Map<MuscleArea, number>()
    for (const muscle of queryMatches) {
      if (!matchesRootFilter(muscle, root)) continue
      const key = clinicalAreaForMuscle(muscle)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [queryMatches, root])

  const rootCounts = useMemo(() => {
    const counts = new Map<string, number>()
    const pool = queryMatches.filter((muscle) => area === 'all' || clinicalAreaForMuscle(muscle) === area)
    for (const candidate of visibleRoots) {
      counts.set(candidate, pool.filter((muscle) => matchesRootFilter(muscle, candidate)).length)
    }
    return counts
  }, [area, queryMatches])

  const resolvedSelected = useMemo<ResolvedSelectedMuscle[]>(() => {
    return selected
      .flatMap((selection) => {
        const muscle = muscleById.get(selection.muscleId)
        return muscle ? [{ selection, muscle }] : []
      })
      .sort((a, b) => (
        rootRank(a.muscle) - rootRank(b.muscle)
        || a.muscle.name.localeCompare(b.muscle.name)
        || a.selection.side.localeCompare(b.selection.side)
      ))
  }, [selected])

  const selectedKeys = useMemo(() => new Set(selected.map((item) => item.key)), [selected])

  const toggleMuscle = (muscle: MuscleCatalogEntry, side: Side) => {
    const key = selectedKey(muscle.id, side)
    setSelected((current) => current.some((item) => item.key === key)
      ? current.filter((item) => item.key !== key)
      : [...current, { key, muscleId: muscle.id, side }])
  }

  const resetFilters = () => {
    setArea('all')
    setRoot('all')
  }

  const filterProps = {
    area,
    onAreaChange: (next: AreaFilter) => setArea(next),
    root,
    onRootChange: (next: string) => setRoot(next),
    roots: visibleRoots,
    areaCounts,
    rootCounts,
    totalCount: queryMatches.filter((muscle) => matchesRootFilter(muscle, root)).length,
    onReset: resetFilters,
  }

  const openWorksheet = () => {
    setQueueSheetOpen(false)
    setWorksheetOpen(true)
  }

  const railStyle = {
    top: topbarHeight + 20,
    maxHeight: `calc(100vh - ${topbarHeight + 40}px)`,
  }

  return (
    <div className={`app${activePage === 'muscles' && compact ? ' has-action-bar' : ''}`}>
      <header className="topbar" ref={topbarRef}>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">EMG</span>
          <span className="brand-copy">
            <h1>臨床圖譜</h1>
            <p>{pageCopy[activePage].subtitle}</p>
          </span>
        </div>

        <nav className="nav-seg" aria-label="主要頁面">
          {pageTabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.hash}
              className={activePage === tab.id ? 'is-active' : ''}
              aria-current={activePage === tab.id ? 'page' : undefined}
              onClick={() => setActivePage(tab.id)}
            >
              <tab.Icon size={16} aria-hidden="true" />
              <span className="nav-wide">{tab.label}</span>
              <span className="nav-compact">{tab.short}</span>
            </a>
          ))}
        </nav>

        <p className="topbar-status">
          <Info size={15} aria-hidden="true" />
          {pageCopy[activePage].status}
        </p>
      </header>

      {activePage === 'muscles' ? (
        <main className="workspace">
          {compact ? null : (
            <aside className="rail rail-filters" aria-label="篩選條件" style={railStyle}>
              <FilterPanel {...filterProps} />
            </aside>
          )}

          <MuscleLibrary
            muscles={muscles}
            query={query}
            onQueryChange={setQuery}
            selectedKeys={selectedKeys}
            onAdd={toggleMuscle}
            onNeedlePoint={(muscle, side) => setNeedleTarget({ muscle, side })}
            expandedId={expandedId}
            onToggleExpanded={(id) => setExpandedId((current) => (current === id ? null : id))}
            compact={compact}
            activeFilterCount={activeFilterCount(area, root)}
            onOpenFilters={() => setFilterSheetOpen(true)}
            onResetFilters={resetFilters}
            stickyTop={topbarHeight}
          />

          {compact ? null : (
            <SelectedMusclesPanel
              rows={resolvedSelected}
              onRemove={(key) => setSelected((current) => current.filter((item) => item.key !== key))}
              onClear={() => setSelected([])}
              onOpenWorksheet={openWorksheet}
              style={railStyle}
            />
          )}
        </main>
      ) : (
        <Suspense fallback={<LoadingNotice>載入臨床參考頁…</LoadingNotice>}>
          {activePage === 'dermatomes' ? (
            <DermatomePage />
          ) : activePage === 'brachial-plexus' ? (
            <BrachialPlexusPage />
          ) : (
            <NcvPage compact={compact} stickyTop={topbarHeight} />
          )}
        </Suspense>
      )}

      {activePage === 'muscles' && compact ? (
        <QueueBar
          rows={resolvedSelected}
          onOpenQueue={() => setQueueSheetOpen(true)}
          onOpenWorksheet={openWorksheet}
        />
      ) : null}

      {filterSheetOpen ? (
        <FilterSheet
          {...filterProps}
          resultCount={muscles.length}
          onClose={() => setFilterSheetOpen(false)}
        />
      ) : null}

      {queueSheetOpen ? (
        <QueueSheet
          rows={resolvedSelected}
          onRemove={(key) => setSelected((current) => current.filter((item) => item.key !== key))}
          onClear={() => setSelected([])}
          onOpenQueue={() => setQueueSheetOpen(true)}
          onOpenWorksheet={openWorksheet}
          onClose={() => setQueueSheetOpen(false)}
        />
      ) : null}

      {needleTarget ? (
        <Suspense fallback={<LoadingNotice>載入扎針資料…</LoadingNotice>}>
          <NeedlePointDialog
            muscle={needleTarget.muscle}
            side={needleTarget.side}
            selectedSides={{
              L: selectedKeys.has(selectedKey(needleTarget.muscle.id, 'L')),
              R: selectedKeys.has(selectedKey(needleTarget.muscle.id, 'R')),
            }}
            onToggleSide={(side) => toggleMuscle(needleTarget.muscle, side)}
            onClose={() => setNeedleTarget(null)}
          />
        </Suspense>
      ) : null}

      {worksheetOpen ? (
        <Suspense fallback={<LoadingNotice>載入 worksheet…</LoadingNotice>}>
          <WorksheetDialog rows={resolvedSelected} onClose={() => setWorksheetOpen(false)} />
        </Suspense>
      ) : null}
    </div>
  )
}

export default App
