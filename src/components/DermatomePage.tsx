import { AlertTriangle, BookOpenText, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  dermatomePoints,
  dermatomeRegionOptions,
  type DermatomeRegion,
} from '../clinical/dermatomes'

type DermatomeFilter = 'all' | DermatomeRegion

export function DermatomePage() {
  const [region, setRegion] = useState<DermatomeFilter>('all')
  const visiblePoints = useMemo(
    () => dermatomePoints.filter((point) => region === 'all' || point.region === region),
    [region],
  )

  return (
    <main className="dermatome-page">
      <section className="dermatome-hero" aria-labelledby="dermatome-title">
        <div className="dermatome-hero-copy">
          <span className="section-kicker">Sensory reference</span>
          <h2 id="dermatome-title">皮節定位（Dermatome）</h2>
          <p>
            以身體表面的典型感覺分布快速定位神經根，並列出 C2-S4/5 的標準化感覺檢查點。
            圖譜與檢查點分開呈現，方便先看整體分布、再回到可重複觸認的骨性標誌。
          </p>
        </div>
        <aside className="dermatome-caution" aria-label="臨床使用限制">
          <AlertTriangle size={22} aria-hidden="true" />
          <div>
            <strong>相鄰皮節廣泛重疊</strong>
            <span>邊界與個體差異都很大；單一感覺點不能獨立證實或排除神經根病變。</span>
          </div>
        </aside>
      </section>

      <section className="dermatome-section" aria-labelledby="distribution-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Distribution maps</span>
            <h3 id="distribution-title">典型皮節分布</h3>
          </div>
          <p>前、後側應一起比對；粗線標示圖譜中的主要分界，不代表絕對邊界。</p>
        </div>

        <div className="dermatome-map-grid">
          <figure className="dermatome-map-card">
            <div className="dermatome-image-wrap">
              <img
                src="/dermatomes/cervical-thoracic.png"
                alt="頸髓與胸髓皮節的前側及後側分布圖"
              />
            </div>
            <figcaption>
              <strong>頸髓與胸髓</strong>
              <span>C3-T12 · 上肢與軀幹前後側</span>
            </figcaption>
          </figure>
          <figure className="dermatome-map-card">
            <div className="dermatome-image-wrap">
              <img
                src="/dermatomes/lumbosacral.png"
                alt="下胸髓、腰髓與薦髓皮節的前側及後側分布圖"
              />
            </div>
            <figcaption>
              <strong>下胸髓、腰髓與薦髓</strong>
              <span>T10-S5 · 下肢與會陰前後側</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="dermatome-section dermatome-landmarks" aria-labelledby="landmarks-title">
        <div className="section-heading landmarks-heading">
          <div>
            <span className="section-kicker">ISNCSCI key sensory points</span>
            <h3 id="landmarks-title">標準化感覺檢查點</h3>
          </div>
          <p>每一點皆左右測試；臨床可分別評估輕觸覺（light touch）與針刺覺（pin prick）。</p>
        </div>

        <div className="dermatome-filter" aria-label="依脊髓區域篩選">
          {dermatomeRegionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={region === option.value ? 'active' : ''}
              aria-pressed={region === option.value}
              onClick={() => setRegion(option.value)}
            >
              <span>{option.label}</span>
              <small>{option.range}</small>
            </button>
          ))}
        </div>

        <div className="dermatome-table" role="table" aria-label="C2 至 S4-5 標準感覺檢查點">
          <div className="dermatome-table-head" role="row">
            <span role="columnheader">節段</span>
            <span role="columnheader">區域</span>
            <span role="columnheader">檢查位置</span>
          </div>
          <div className="dermatome-table-body">
            {visiblePoints.map((point) => (
              <div
                className={`dermatome-row${point.quickReference ? ' quick-reference' : ''}`}
                role="row"
                key={point.root}
              >
                <strong className="dermatome-root" role="cell">{point.root}</strong>
                <span className="dermatome-region" role="cell">{point.regionLabel}</span>
                <span className="dermatome-landmark" role="cell">
                  <MapPin size={16} aria-hidden="true" />
                  <span>
                    <strong>{point.landmark}</strong>
                    <small>{point.landmarkEnglish}</small>
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dermatome-source-note" aria-labelledby="dermatome-source-title">
        <BookOpenText size={21} aria-hidden="true" />
        <div>
          <h3 id="dermatome-source-title">來源與使用界線</h3>
          <p>
            皮節圖取自本網站使用的 Preston &amp; Shapiro 2020 第 32 章（Fig. 32.1、32.2）；
            檢查點依 <a href="https://asia-spinalinjury.org/wp-content/uploads/2023/12/ASIA-ISCOS-Worksheet-Sides-12_12_4_2023.pdf" target="_blank" rel="noreferrer">ISNCSCI 2019 標準表</a>整理。
            本頁供臨床定位與學習參考，不取代完整病史、理學檢查、神經傳導或肌電圖判讀。
          </p>
        </div>
      </section>
    </main>
  )
}
