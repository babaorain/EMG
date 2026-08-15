import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { searchMuscles } from '../clinical/catalog'
import {
  categoryLabels,
  categoryOrder,
  protocols,
  type ProtocolCategory,
} from '../domain/protocols'

interface ProtocolLauncherProps {
  onLoadProtocol: (protocolId: string) => void
  onAddMuscle: (muscleId: string) => void
}

export function ProtocolLauncher({ onLoadProtocol, onAddMuscle }: ProtocolLauncherProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    const map = new Map<ProtocolCategory, typeof protocols>()
    for (const category of categoryOrder) {
      map.set(
        category,
        protocols.filter((protocol) => protocol.category === category),
      )
    }
    return map
  }, [])

  const searchResults = useMemo(
    () => (query.trim() ? searchMuscles(query).slice(0, 8) : []),
    [query],
  )

  return (
    <section className="launcher" aria-label="開始一個檢查計畫">
      <div className="launcher-intro">
        <h2>你想驗證什麼？</h2>
        <p>
          選一個假設，工具會帶入能驗證它、同時能推翻它的肌肉組合。每條肌肉都會標明它在這組裡的角色。
        </p>
      </div>

      {categoryOrder.map((category) => (
        <div className="launcher-group" key={category}>
          <h3>{categoryLabels[category]}</h3>
          <div className="protocol-chips">
            {(grouped.get(category) ?? []).map((protocol) => (
              <div className="protocol-chip-wrap" key={protocol.id}>
                <button
                  type="button"
                  className={`protocol-chip ${openId === protocol.id ? 'open' : ''}`}
                  onClick={() => setOpenId(openId === protocol.id ? null : protocol.id)}
                  aria-expanded={openId === protocol.id}
                >
                  {protocol.label}
                  <span className="protocol-count">{protocol.muscles.length}</span>
                </button>
              </div>
            ))}
          </div>

          {(grouped.get(category) ?? [])
            .filter((protocol) => protocol.id === openId)
            .map((protocol) => (
              <div className="protocol-detail" key={protocol.id}>
                <p className="protocol-summary">{protocol.summary}</p>
                <ul className="protocol-muscles">
                  {protocol.muscles.map((muscle) => (
                    <li key={muscle.name}>
                      <span className={`plan-role ${muscle.role}`}>
                        {muscle.role === 'confirm'
                          ? '驗證'
                          : muscle.role === 'exclude'
                            ? '排除'
                            : '定位層級'}
                      </span>
                      <span className="protocol-muscle-name">{muscle.name}</span>
                      <span className="protocol-muscle-why">{muscle.rationale}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => onLoadProtocol(protocol.id)}
                >
                  載入這 {protocol.muscles.length} 條肌肉
                </button>
              </div>
            ))}
        </div>
      ))}

      <div className="launcher-group">
        <h3>或直接加入肌肉</h3>
        <div className="search-field">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            placeholder="搜尋名稱、縮寫、nerve 或 root"
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
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
