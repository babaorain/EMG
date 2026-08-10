import { Plus, Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { muscleById, searchMuscles } from '../clinical/catalog'
import { protocolById, type ProtocolMuscle } from '../domain/protocols'
import type { NeedleFinding, Side, Study } from '../domain/types'
import { MuscleRow } from './MuscleRow'

interface MuscleListProps {
  study: Study
  side: Side
  expandedId: string | null
  onToggleExpand: (findingId: string) => void
  onUpdateFinding: (finding: NeedleFinding) => void
  onRemoveFinding: (findingId: string) => void
  onAddMuscle: (muscleId: string) => void
}

export function MuscleList({
  study,
  side,
  expandedId,
  onToggleExpand,
  onUpdateFinding,
  onRemoveFinding,
  onAddMuscle,
}: MuscleListProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const findings = useMemo(
    () => study.findings.filter((finding) => finding.side === side),
    [study.findings, side],
  )

  const planRoles = useMemo(() => {
    const protocol = study.protocolId ? protocolById.get(study.protocolId) : undefined
    const map = new Map<string, ProtocolMuscle>()
    for (const entry of protocol?.muscles ?? []) map.set(entry.name, entry)
    return map
  }, [study.protocolId])

  const searchResults = useMemo(() => {
    if (!deferredQuery.trim()) return []
    const existing = new Set(findings.map((finding) => finding.muscleId))
    return searchMuscles(deferredQuery)
      .filter((muscle) => !existing.has(muscle.id))
      .slice(0, 8)
  }, [deferredQuery, findings])

  const marked = findings.filter((finding) => finding.coverage !== 'not_tested').length

  return (
    <section className="muscle-list-pane" aria-label="檢查清單">
      <div className="pane-heading">
        <h2>檢查清單</h2>
        <span className="pane-meta">
          {findings.length ? `${marked} / ${findings.length} 已標記` : '尚未加入肌肉'}
        </span>
      </div>

      <ul className="muscle-list">
        {findings.map((finding) => {
          const muscle = muscleById.get(finding.muscleId)
          if (!muscle) return null
          return (
            <MuscleRow
              key={finding.id}
              muscle={muscle}
              finding={finding}
              planEntry={planRoles.get(muscle.name)}
              expanded={expandedId === finding.id}
              onToggleExpand={() => onToggleExpand(finding.id)}
              onChange={onUpdateFinding}
              onRemove={() => onRemoveFinding(finding.id)}
            />
          )
        })}
      </ul>

      <div className="add-muscle">
        <div className="search-field">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            placeholder="加入肌肉 — 搜尋名稱、縮寫、nerve 或 root"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {searchResults.length ? (
          <ul className="search-results">
            {searchResults.map((muscle) => (
              <li key={muscle.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAddMuscle(muscle.id)
                    setQuery('')
                  }}
                >
                  <span>
                    <strong>{muscle.name}</strong>
                    <small>
                      {muscle.nerveLabel} · {muscle.rootLabel}
                    </small>
                  </span>
                  <Plus size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
