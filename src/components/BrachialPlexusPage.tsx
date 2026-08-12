import { AlertTriangle, ArrowRight, BookOpenText, ExternalLink, GitBranch, ScanSearch } from 'lucide-react'
import {
  plexusFlowRows,
  plexusNcsChecklist,
  plexusPatternRows,
  plexusSources,
  type PlexusPatternBlock,
} from '../clinical/brachialPlexusReference'

function PatternCard({ block, kind }: { block: PlexusPatternBlock; kind: 'trunk' | 'cord' }) {
  return (
    <article className={`plexus-pattern-card ${kind}`}>
      <header>
        <span>{kind}</span>
        <h4>{block.title}</h4>
      </header>
      <div className="plexus-pattern-muscles">
        <h5>Muscle</h5>
        <ul>
          {block.muscles.map((muscle) => (
            <li className={muscle.key ? 'is-key' : ''} key={`${block.title}-${muscle.name}`}>
              <strong>{muscle.name}</strong>
              <span>{muscle.nerve}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="plexus-pattern-sensory">
        <h5>Sensory NCS</h5>
        {block.sensory.length ? (
          <div>{block.sensory.map((item) => <span key={item}>{item}</span>)}</div>
        ) : <p>依症狀分布與對側比較</p>}
      </div>
    </article>
  )
}

export function BrachialPlexusPage() {
  return (
    <main className="plexus-page">
      <section className="plexus-hero" aria-labelledby="plexus-title">
        <div>
          <span className="section-kicker">Electrodiagnostic reference</span>
          <h2 id="plexus-title">Brachial plexus 定位</h2>
          <p>先確認 preganglionic 或 postganglionic，再依手寫臨床卡的跨 terminal nerve 組合定位。</p>
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
          <p>先決定病灶是否位於 DRG distal，再進入 trunk／cord 圖表。</p>
        </div>
        <ol>
          <li><span>01</span><div><strong>SNAP 是否異常？</strong><p>有感覺症狀且 SNAP 低或消失，支持 postganglionic lesion；root lesion 常保留 SNAP。</p></div></li>
          <li><span>02</span><div><strong>C PSP 是否異常？</strong><p>Denervation 支持 root involvement；純 brachial plexopathy 通常相對保留。</p></div></li>
          <li><span>03</span><div><strong>是否跨至少兩條 terminal nerves？</strong><p>用共同 root／trunk／cord 解釋異常肌肉，同時尋找應保留的比較肌。</p></div></li>
        </ol>
      </section>

      <section className="plexus-flow-section" aria-labelledby="plexus-flow-title">
        <div className="plexus-section-heading">
          <div><span className="section-kicker">Anatomic routing</span><h3 id="plexus-flow-title">從 Root 走到 Cord</h3></div>
          <p>Anterior divisions 進入 flexor-side cords；三條 posterior divisions 全部匯入 Posterior cord。</p>
        </div>
        <div className="plexus-flow-board">
          <div className="plexus-flow-head" aria-hidden="true"><span>Roots</span><span>Trunk</span><span>Anterior division</span><span>Posterior division</span></div>
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

      <section className="plexus-pattern-section" aria-labelledby="plexus-pattern-title">
        <div className="plexus-section-heading">
          <div><span className="section-kicker">Bedside sampling card</span><h3 id="plexus-pattern-title">手寫 BPI 定位組合</h3></div>
          <p>框線肌肉是手寫卡特別標示的核心取樣；其餘肌肉用於跨神經與 cord 對照。</p>
        </div>
        <div className="plexus-pattern-matrix">
          {plexusPatternRows.map((row) => (
            <div className="plexus-pattern-row" key={row.roots}>
              <div className="plexus-pattern-root"><small>Root</small><strong>{row.roots}</strong></div>
              <PatternCard block={row.trunk} kind="trunk" />
              <PatternCard block={row.cord} kind="cord" />
            </div>
          ))}
        </div>
      </section>

      <section className="plexus-ncs-section" aria-labelledby="plexus-ncs-title">
        <div className="plexus-section-heading">
          <div><span className="section-kicker">NCS checklist</span><h3 id="plexus-ncs-title">手寫卡上方檢查清單</h3></div>
          <p>作為 bilateral comparison 與 axonal loss 量化的靜態提醒。</p>
        </div>
        <ol>{plexusNcsChecklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol>
      </section>

      <section className="plexus-caution" aria-label="判讀限制">
        <AlertTriangle size={21} aria-hidden="true" />
        <div><strong>作為定位參考，不是自動診斷規則</strong><p>解剖變異、病灶不完全、時間點與技術因素都可能偏離典型矩陣；需結合病史、理學檢查、NCS、needle EMG 與影像。</p></div>
      </section>

      <section className="plexus-sources" aria-labelledby="plexus-sources-title">
        <BookOpenText size={21} aria-hidden="true" />
        <div><h3 id="plexus-sources-title">核對來源</h3><ul>{plexusSources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={14} aria-hidden="true" /></a><span>{source.note}</span></li>)}</ul></div>
        <GitBranch className="plexus-source-mark" size={42} strokeWidth={1.2} aria-hidden="true" />
      </section>
    </main>
  )
}
