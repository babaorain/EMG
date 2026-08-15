import { AlertTriangle, Info, Plus, Target } from 'lucide-react'
import type { InferenceResult, SiteVerdict } from '../domain/inference'

interface InferencePanelProps {
  result: InferenceResult
  plannedMuscleIds: Set<string>
  onAddMuscle: (muscleId: string) => void
  onShowPathways: () => void
}

function VerdictCard({ verdict, tone }: { verdict: SiteVerdict; tone: 'live' | 'out' }) {
  return (
    <li className={`verdict ${tone}`}>
      <div className="verdict-head">
        <span className="verdict-label">{verdict.site.label}</span>
        <span className="verdict-level">{verdict.site.level}</span>
        {verdict.site.confidence === 'coarse' ? (
          <span className="coarse-flag" title="此層級的解剖對照在文獻上本身即為粗略分層">
            粗略分層
          </span>
        ) : null}
      </div>
      <p className="verdict-reason">{verdict.reason}</p>
      {verdict.caveats.map((caveat) => (
        <p className="verdict-caveat" key={caveat}>
          <Info size={12} aria-hidden="true" />
          {caveat}
        </p>
      ))}
    </li>
  )
}

export function InferencePanel({
  result,
  plannedMuscleIds,
  onAddMuscle,
  onShowPathways,
}: InferencePanelProps) {
  if (result.abnormal.length === 0) {
    return (
      <section className="inference-pane" aria-label="收斂狀態">
        <div className="pane-heading">
          <h2>收斂狀態</h2>
        </div>
        <div className="inference-empty">
          <Target size={20} aria-hidden="true" />
          <p>標記第一條異常肌肉後，這裡會即時列出仍然相容的病灶位置、已被排除的位置與理由。</p>
          {result.normal.length ? (
            <p className="inference-empty-note">
              目前 {result.normal.length} 條肌肉正常，尚無異常可供定位。
            </p>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="inference-pane" aria-label="收斂狀態">
      <div className="pane-heading">
        <h2>收斂狀態</h2>
        <button type="button" className="link-button" onClick={onShowPathways}>
          看推論路徑
        </button>
      </div>

      <div className="verdict-group">
        <h3>仍然相容 · {result.compatible.length}</h3>
        {result.compatible.length ? (
          <ul className="verdict-list">
            {result.compatible.map((verdict) => (
              <VerdictCard key={verdict.site.id} verdict={verdict} tone="live" />
            ))}
          </ul>
        ) : (
          <p className="no-explanation" role="status">
            <AlertTriangle size={14} aria-hidden="true" />
            沒有單一位置能解釋全部異常肌肉。考慮多發病灶、跨層病灶，或重新檢視技術品質。
          </p>
        )}
      </div>

      {result.suggestions.length ? (
        <div className="verdict-group">
          <h3>
            {result.suggestions[0].kind === 'discriminate' ? '下一針最有資訊量' : '可加強證據'}
          </h3>
          <ul className="suggestion-list">
            {result.suggestions.map((suggestion) => (
              <li key={suggestion.muscle.id} className="suggestion">
                <div className="suggestion-head">
                  <span className="suggestion-name">{suggestion.muscle.name}</span>
                  {suggestion.inPlan || plannedMuscleIds.has(suggestion.muscle.id) ? (
                    <span className="suggestion-status">清單中 · 待標記</span>
                  ) : (
                    <button
                      type="button"
                      className="add-suggestion"
                      onClick={() => onAddMuscle(suggestion.muscle.id)}
                    >
                      <Plus size={13} aria-hidden="true" />
                      加入
                    </button>
                  )}
                </div>
                <p className="suggestion-supply">
                  {suggestion.muscle.nerveLabel} · {suggestion.muscle.rootLabel}
                </p>
                <p className="suggestion-reason">{suggestion.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.partial.length ? (
        <div className="verdict-group">
          <h3>只能解釋部分異常 · {result.partial.length}</h3>
          <ul className="verdict-list">
            {result.partial.map((verdict) => (
              <VerdictCard key={verdict.site.id} verdict={verdict} tone="out" />
            ))}
          </ul>
        </div>
      ) : null}

      {result.contradicted.length ? (
        <div className="verdict-group">
          <h3>與正常肌肉牴觸 · {result.contradicted.length}</h3>
          <ul className="verdict-list">
            {result.contradicted.map((verdict) => (
              <VerdictCard key={verdict.site.id} verdict={verdict} tone="out" />
            ))}
          </ul>
        </div>
      ) : null}

      {result.inadequate.length ? (
        <p className="inadequate-note">
          {result.inadequate.map((ref) => ref.name).join('、')} 標記為技術不足，未納入推論。
        </p>
      ) : null}
    </section>
  )
}
