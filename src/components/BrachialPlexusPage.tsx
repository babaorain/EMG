import { AlertTriangle, ArrowRight, BookOpenText, ExternalLink, GitBranch, ScanSearch } from 'lucide-react'
import {
  plexusFlowRows,
  plexusLocalizationCards,
  plexusSources,
  type PlexusReferenceLevel,
} from '../clinical/brachialPlexusReference'

const levelCopy: Record<PlexusReferenceLevel, { eyebrow: string; title: string; description: string }> = {
  trunk: {
    eyebrow: 'Supraclavicular localization',
    title: 'Trunk pattern',
    description: '同一 root level 橫跨不同 cord 與 terminal nerve，形成一致的 denervation pattern。',
  },
  cord: {
    eyebrow: 'Infraclavicular localization',
    title: 'Cord pattern',
    description: '同一 cord 的多條分支異常，而來自其他 cord、相近 root 的肌肉相對保留。',
  },
}

function LocalizationSection({ level }: { level: PlexusReferenceLevel }) {
  const copy = levelCopy[level]
  const cards = plexusLocalizationCards.filter((card) => card.level === level)

  return (
    <section className={`plexus-localization-section ${level}`} aria-labelledby={`${level}-pattern-title`}>
      <div className="plexus-section-heading">
        <div>
          <span className="section-kicker">{copy.eyebrow}</span>
          <h3 id={`${level}-pattern-title`}>{copy.title}</h3>
        </div>
        <p>{copy.description}</p>
      </div>

      <div className="plexus-card-grid">
        {cards.map((card) => (
          <article className="plexus-localization-card" key={card.id}>
            <header>
              <div>
                <span>{card.level}</span>
                <h4>{card.title}</h4>
              </div>
              <strong>{card.roots}</strong>
            </header>
            <p className="plexus-composition">{card.composition}</p>

            <div className="plexus-card-block muscle-set">
              <h5>代表性跨神經肌肉</h5>
              <ul>
                {card.muscles.map((muscle) => (
                  <li key={`${card.id}-${muscle.name}`}>
                    <strong>{muscle.name}</strong>
                    <span>{muscle.nerve}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="plexus-evidence-list">
              <div>
                <dt>Sensory NCS</dt>
                <dd>{card.sensory}</dd>
              </div>
              <div>
                <dt>最有鑑別力</dt>
                <dd>{card.discriminator}</dd>
              </div>
              <div>
                <dt>相對保留</dt>
                <dd>{card.relativeSparing}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}

export function BrachialPlexusPage() {
  return (
    <main className="plexus-page">
      <section className="plexus-hero" aria-labelledby="plexus-title">
        <div>
          <span className="section-kicker">Electrodiagnostic reference</span>
          <h2 id="plexus-title">Brachial plexus 定位</h2>
          <p>先確認 preganglionic 或 postganglionic，再用跨 terminal nerve 的肌肉組合定位 trunk 或 cord。</p>
        </div>
        <aside>
          <ScanSearch size={22} aria-hidden="true" />
          <div>
            <strong>Pattern before label</strong>
            <span>單一肌肉、單一 SNAP 或單一神經異常，都不足以獨立命名一個 plexus lesion。</span>
          </div>
        </aside>
      </section>

      <section className="plexus-first-pass" aria-labelledby="first-pass-title">
        <div className="plexus-section-heading">
          <div>
            <span className="section-kicker">First-pass localization</span>
            <h3 id="first-pass-title">先做三個判斷</h3>
          </div>
          <p>這三項先決定病灶是否位於 DRG distal，再進入 trunk／cord 圖表。</p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div><strong>SNAP 是否異常？</strong><p>有感覺症狀且 SNAP 低或消失，支持 postganglionic lesion；root lesion 常保留 SNAP。</p></div>
          </li>
          <li>
            <span>02</span>
            <div><strong>Cervical paraspinals 是否異常？</strong><p>Denervation 支持 root involvement；純 brachial plexopathy 通常相對保留。</p></div>
          </li>
          <li>
            <span>03</span>
            <div><strong>是否跨至少兩條 terminal nerves？</strong><p>用共同 root／trunk／cord 解釋異常肌肉，同時尋找應保留的比較肌。</p></div>
          </li>
        </ol>
      </section>

      <section className="plexus-flow-section" aria-labelledby="plexus-flow-title">
        <div className="plexus-section-heading">
          <div>
            <span className="section-kicker">Anatomic routing</span>
            <h3 id="plexus-flow-title">從 Root 走到 Cord</h3>
          </div>
          <p>Anterior divisions 進入 flexor-side cords；三條 posterior divisions 全部匯入 Posterior cord。</p>
        </div>

        <div className="plexus-flow-board">
          <div className="plexus-flow-head" aria-hidden="true">
            <span>Roots</span><span>Trunk</span><span>Anterior division</span><span>Posterior division</span>
          </div>
          {plexusFlowRows.map((row) => (
            <div className="plexus-flow-row" key={row.trunk}>
              <div><small>Roots</small><strong>{row.roots}</strong></div>
              <ArrowRight aria-hidden="true" />
              <div><small>Trunk</small><strong>{row.trunk}</strong></div>
              <div className="flow-branch anterior"><small>Anterior</small><strong>{row.anterior}</strong></div>
              <div className="flow-branch posterior"><small>Posterior</small><strong>{row.posterior}</strong></div>
            </div>
          ))}
        </div>
      </section>

      <LocalizationSection level="trunk" />
      <LocalizationSection level="cord" />

      <section className="plexus-caution" aria-label="判讀限制">
        <AlertTriangle size={21} aria-hidden="true" />
        <div>
          <strong>作為定位參考，不是自動診斷規則</strong>
          <p>解剖變異、病灶不完全、時間點、技術因素與 neuralgic amyotrophy 的 patchy pattern 都可能偏離典型矩陣；需結合病史、理學檢查、NCS、needle EMG 與影像。</p>
        </div>
      </section>

      <section className="plexus-sources" aria-labelledby="plexus-sources-title">
        <BookOpenText size={21} aria-hidden="true" />
        <div>
          <h3 id="plexus-sources-title">核對來源</h3>
          <ul>
            {plexusSources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer">
                  {source.label}<ExternalLink size={14} aria-hidden="true" />
                </a>
                <span>{source.note}</span>
              </li>
            ))}
          </ul>
        </div>
        <GitBranch className="plexus-source-mark" size={42} strokeWidth={1.2} aria-hidden="true" />
      </section>
    </main>
  )
}
