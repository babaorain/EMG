import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import { Info } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
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
} from './clinical/clinicalAreas'
import { needleGuidesForMuscle } from './clinical/needleGuides'
import { BrachialPlexusPage } from './components/BrachialPlexusPage'
import { MuscleLibrary, type AreaFilter } from './components/picker/MuscleLibrary'
import { NeedlePointDialog } from './components/picker/NeedlePointDialog'
import { SelectedMusclesPanel, type ResolvedSelectedMuscle } from './components/picker/SelectedMusclesPanel'
import { WorksheetDialog } from './components/picker/WorksheetDialog'
import { DermatomePage } from './components/DermatomePage'
import { compareMuscles, rootRank, selectedKey, type SelectedMuscle } from './domain/muscleSelection'
import type { Side } from './domain/types'

const visibleRoots = [
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1',
  'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4',
  'V', 'VII', 'XI', 'XII',
]

type AppPage = 'muscles' | 'dermatomes' | 'brachial-plexus'

function pageFromHash(): AppPage {
  if (window.location.hash === '#dermatomes') return 'dermatomes'
  if (window.location.hash === '#brachial-plexus') return 'brachial-plexus'
  return 'muscles'
}

function App() {
  const [activePage, setActivePage] = useState<AppPage>(pageFromHash)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const [area, setArea] = useState<AreaFilter>('all')
  const [root, setRoot] = useState('all')
  const [selected, setSelected] = useState<SelectedMuscle[]>([])
  const [needleTarget, setNeedleTarget] = useState<{ muscle: MuscleCatalogEntry; side: Side } | null>(null)
  const [worksheetOpen, setWorksheetOpen] = useState(false)

  useEffect(() => {
    const handleHashChange = () => setActivePage(pageFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const muscles = useMemo(() => {
    return muscleCatalog
      .filter((muscle) => area === 'all' || clinicalAreaForMuscle(muscle) === area)
      .filter((muscle) => root === 'all' || muscle.roots.includes(root))
      .filter((muscle) => {
        if (!deferredQuery) return true
        return [
          muscle.name,
          muscle.nerveLabel,
          muscle.rootLabel,
          clinicalAreaLabel(muscle),
          ...muscle.abbreviations,
        ].some((value) => value.toLowerCase().includes(deferredQuery))
      })
      .sort((a, b) => (
        clinicalAreaRank(a) - clinicalAreaRank(b)
        || Number(needleGuidesForMuscle(b.name).length > 0) - Number(needleGuidesForMuscle(a.name).length > 0)
        || compareMuscles(a, b)
      ))
  }, [area, deferredQuery, root])

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

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-main">
          <div className="app-brand">
            <h1>EMG 臨床圖譜</h1>
            <p>
              {activePage === 'muscles'
                ? '肌肉選擇、扎針定位與空白 worksheet'
                : activePage === 'dermatomes'
                  ? '皮節分布與標準化感覺檢查點'
                  : 'Brachial plexus 的 trunk 與 cord 定位'}
            </p>
          </div>
          <nav className="primary-nav" aria-label="主要頁面">
            <a
              href="#muscles"
              className={activePage === 'muscles' ? 'active' : ''}
              aria-current={activePage === 'muscles' ? 'page' : undefined}
              onClick={() => setActivePage('muscles')}
            >
              <span className="nav-wide">肌肉／扎針</span><span className="nav-compact">肌肉</span>
            </a>
            <a
              href="#dermatomes"
              className={activePage === 'dermatomes' ? 'active' : ''}
              aria-current={activePage === 'dermatomes' ? 'page' : undefined}
              onClick={() => setActivePage('dermatomes')}
            >
              <span className="nav-wide">Dermatome 皮節</span><span className="nav-compact">皮節</span>
            </a>
            <a
              href="#brachial-plexus"
              className={activePage === 'brachial-plexus' ? 'active' : ''}
              aria-current={activePage === 'brachial-plexus' ? 'page' : undefined}
              onClick={() => setActivePage('brachial-plexus')}
            >
              <span className="nav-wide">Brachial plexus</span><span className="nav-compact">Plexus</span>
            </a>
          </nav>
        </div>
        <div className="review-status">
          <Info size={17} aria-hidden="true" />
          {activePage === 'muscles'
            ? `${bookSourcedMuscleCount} 條依原書校正 · 其餘待覆核`
            : activePage === 'dermatomes'
              ? 'C2-S4/5 · 28 個標準檢查點'
              : 'C5-T1 · 3 trunks · 3 cords'}
        </div>
      </header>

      {activePage === 'muscles' ? (
        <main className="picker-layout">
          <MuscleLibrary
            muscles={muscles}
            query={query}
            onQueryChange={setQuery}
            area={area}
            onAreaChange={setArea}
            root={root}
            onRootChange={setRoot}
            roots={visibleRoots}
            selectedKeys={selectedKeys}
            onAdd={toggleMuscle}
            onNeedlePoint={(muscle, side) => setNeedleTarget({ muscle, side })}
          />
          <SelectedMusclesPanel
            rows={resolvedSelected}
            onRemove={(key) => setSelected((current) => current.filter((item) => item.key !== key))}
            onClear={() => setSelected([])}
            onOpenWorksheet={() => setWorksheetOpen(true)}
          />
        </main>
      ) : activePage === 'dermatomes' ? (
        <DermatomePage />
      ) : (
        <BrachialPlexusPage />
      )}

      {needleTarget ? (
        <NeedlePointDialog
          muscle={needleTarget.muscle}
          side={needleTarget.side}
          onClose={() => setNeedleTarget(null)}
        />
      ) : null}
      {worksheetOpen ? (
        <WorksheetDialog rows={resolvedSelected} onClose={() => setWorksheetOpen(false)} />
      ) : null}
    </div>
  )
}

export default App
