import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import { Info } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import './App.css'
import { muscleById, muscleCatalog, type MuscleCatalogEntry } from './clinical/catalog'
import {
  clinicalAreaForMuscle,
  clinicalAreaLabel,
  clinicalAreaRank,
} from './clinical/clinicalAreas'
import { MuscleLibrary, type AreaFilter } from './components/picker/MuscleLibrary'
import { NeedlePointDialog } from './components/picker/NeedlePointDialog'
import { SelectedMusclesPanel, type ResolvedSelectedMuscle } from './components/picker/SelectedMusclesPanel'
import { WorksheetDialog } from './components/picker/WorksheetDialog'
import { compareMuscles, rootRank, selectedKey, type SelectedMuscle } from './domain/muscleSelection'
import type { Side } from './domain/types'

const visibleRoots = [
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1',
  'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4',
  'V', 'VII', 'XI', 'XII',
]

function App() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const [area, setArea] = useState<AreaFilter>('all')
  const [root, setRoot] = useState('all')
  const [selected, setSelected] = useState<SelectedMuscle[]>([])
  const [needleTarget, setNeedleTarget] = useState<{ muscle: MuscleCatalogEntry; side: Side } | null>(null)
  const [worksheetOpen, setWorksheetOpen] = useState(false)

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
      .sort((a, b) => clinicalAreaRank(a) - clinicalAreaRank(b) || compareMuscles(a, b))
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
        <div>
          <h1>EMG 肌肉選擇器</h1>
          <p>依臨床區域選擇肌肉，產生空白 Needle EMG worksheet</p>
        </div>
        <div className="review-status">
          <Info size={17} aria-hidden="true" />
          解剖路徑尚待臨床覆核
        </div>
      </header>

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
