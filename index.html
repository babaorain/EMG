<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EMG Nerve–Muscle Pathways • Static Interactive App</title>
  <style>
    :root {
      --bg: #0b1324;          /* deep blue background for contrast */
      --panel: #111a33;       /* panels */
      --text: #e5e7eb;        /* light gray */
      --muted: #9ca3af;       /* secondary text */
      --accent: #60a5fa;      /* blue */
      --accent-2: #34d399;    /* green */
      --warn: #f59e0b;        /* amber */
      --danger: #f87171;      /* red */
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; background: var(--bg); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; }
    a { color: var(--accent); }
    .app { display: grid; grid-template-columns: 320px 1fr 360px; gap: 12px; height: 100%; padding: 12px; }
    .panel { background: var(--panel); border-radius: 16px; padding: 14px; box-shadow: 0 10px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02); }
    h1 { font-size: 18px; margin: 0 0 8px; letter-spacing: .5px; }
    h2 { font-size: 14px; margin: 14px 0 6px; color: var(--muted); font-weight: 600; }
    .row { display: grid; gap: 8px; }
    label { font-size: 12px; color: var(--muted); margin-bottom: 4px; display:block; }
    input[type="text"], select { width: 100%; padding: 8px 10px; border-radius: 10px; border: 1px solid #273253; background: #0e1831; color: var(--text); outline:none; }
    .btn { display:inline-flex; align-items:center; gap:6px; padding:8px 10px; border-radius:10px; border:1px solid #27406a; background:#102244; color:#cfe2ff; cursor:pointer; user-select:none; }
    .btn:hover { filter: brightness(1.1); }
    .btn.secondary { border-color:#32425b; background:#121b2f; color:#cbd5e1; }
    .kbd { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; padding:2px 6px; border-radius:6px; background:#0e1831; border:1px solid #273253; font-size:12px; color:#c7d2fe; }

    /* Main viz */
    #viz { width: 100%; height: calc(100vh - 24px); background: radial-gradient(1200px 600px at 60% -10%, rgba(96,165,250,0.08), transparent 60%), linear-gradient(180deg, rgba(52, 211, 153, 0.06), rgba(96,165,250,0.06)); border-radius: 16px; position: relative; overflow: hidden; }
    svg { width: 100%; height: 100%; font: 12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
    .node rect { rx: 6px; }
    .node text { fill: #e5e7eb; pointer-events: none; font-weight: 600; text-shadow: 0 1px 0 rgba(0,0,0,.8); }
    .link { fill: none; stroke-opacity: .25; }
    .link:hover { stroke-opacity: .7; }
    .hl-node rect { stroke: var(--accent-2); stroke-width: 2.5px; }
    .hl-link { stroke-opacity: .9 !important; }
    .dimmed { opacity: .12; }

    /* Right info */
    .chips { display:flex; flex-wrap:wrap; gap:6px; }
    .chip { padding:6px 10px; border-radius:999px; border:1px solid #2b3e66; background:#0f1a34; color:#dbeafe; font-size:12px; }
    .list { display:grid; gap:8px; }
    .card { border:1px solid #273253; background:#0c162e; border-radius:12px; padding:10px; }
    .muted { color: var(--muted); }
    .hr { height:1px; background:linear-gradient(90deg, transparent, #2b3e66, transparent); margin:10px 0; }
    .pill { font-size:11px; padding:2px 8px; border-radius:999px; border:1px solid #334155; }
    .legend { display:flex; gap:6px; flex-wrap:wrap; }
    .legend > span { display:inline-flex; align-items:center; gap:6px; }
    .dot { width:10px; height:10px; border-radius:3px; display:inline-block; }

    .footer { position:absolute; bottom:10px; left:12px; color:#8aa2c7; font-size:11px; }
      /* Highlight current target */
    .picked { border:1px solid #3b82f6; background:#0b1840; border-radius:12px; padding:10px; margin:8px 0 12px; box-shadow:0 0 0 2px rgba(59,130,246,.15) inset; }
    .picked .title { font-size:16px; font-weight:700; color:#e0eaff; }
    .picked .subtitle { font-size:12px; color:#9fb3d9; margin-top:2px; }
  </style>
</head>
<body>
  <div class="app">
    <!-- Controls -->
    <aside class="panel" style="height:100%">
      <h1>EMG 神經–肌肉路徑學習器</h1>
      <div class="row">
        <div>
          <label>選擇區域 (Region)</label>
          <select id="regionSel">
            <option value="upper">上肢（Brachial plexus）</option>
            <option value="lower">下肢（Lumbar/Sacral plexus）</option>
            <option value="all">全部</option>
          </select>
        </div>
        <div>
          <label>搜尋類別 (Category)</label>
          <select id="categorySel">
            <option value="root">Roots</option>
            <option value="plexuscord">Plexus / Cords</option>
            <option value="nerve" selected>Terminal Nerves</option>
            <option value="muscle">Muscles</option>
          </select>
        </div>
        <div>
          <label>快速搜尋 (輸入關鍵字後，下拉選單自動過濾)</label>
          <input id="globalFilter" type="text" placeholder="例：C6、L5、Median、FDI..." />
          <select id="globalSel"></select>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <button class="btn" id="showSelected">顯示路徑</button>
          <button class="btn secondary" id="resetBtn">重置</button>
        </div>
      </div>

      <h2>操作說明</h2>
      <ul class="muted" style="margin-top:6px;line-height:1.6">
        <li>選擇 <span class="kbd">區域</span> 與 <span class="kbd">類別</span>，在單一搜尋框中挑選節點，按「顯示路徑」。</li>
        <li>圖中節點/邊可懸停預覽或點擊固定高亮；右側會凸顯此次選擇的標的。</li>
        <li>下方「圖例」說明各層級顏色；右側可匯出 SVG/PNG。</li>
      </ul>

      <h2>圖例 (Legend)</h2>
      <div class="legend">
        <span><i class="dot" style="background:#60a5fa"></i> Roots</span>
        <span><i class="dot" style="background:#34d399"></i> Plexus / Cords</span>
        <span><i class="dot" style="background:#f59e0b"></i> Nerves</span>
        <span><i class="dot" style="background:#f87171"></i> Muscles</span>
      </div>

      <div class="hr"></div>
      <div class="chips" id="activeTags"></div>
    </aside>

    <!-- Visualization -->
    <main id="viz" class="panel">
      <svg id="svg"></svg>
      <div class="footer">Sankey 版路徑圖：顯示訊息自脊髓根源到肌肉的「流向」。</div>
    </main>

    <!-- Details / Tips -->
    <aside class="panel" style="height:100%; overflow:auto;">
      <h1>路徑細節與 EMG 提示</h1>
      <div id="pickedTarget" class="picked" style="display:none">
        <div class="title" id="pickedTitle"></div>
        <div class="subtitle" id="pickedMeta"></div>
      </div>
      <div id="detail" class="list"></div>

      <h2>匯出</h2>
      <div class="row">
        <button class="btn" id="exportSVG">下載 SVG</button>
        <button class="btn" id="exportPNG">下載 PNG</button>
      </div>

      <h2>資料擴充</h2>
      <p class="muted">在本檔案底部 <code>DATA</code> 常數可新增/編輯節點與連結；可依您的兩張圖表逐步擴充（保留層級欄位）。</p>
    </aside>
  </div>

  <!-- Libraries -->
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>

  <script>
  // =====================
  // Data model (可自行擴充)
  // =====================
  // type: root | plexus | trunk | division | cord | nerve | muscle
  // region: upper | lower
  const DATA = {
    nodes: [
      // Roots
      { id: 'C5', type: 'root', region:'upper' },
      { id: 'C6', type: 'root', region:'upper' },
      { id: 'C7', type: 'root', region:'upper' },
      { id: 'C8', type: 'root', region:'upper' },
      { id: 'T1', type: 'root', region:'upper' },
      { id: 'L2', type: 'root', region:'lower' },
      { id: 'L3', type: 'root', region:'lower' },
      { id: 'L4', type: 'root', region:'lower' },
      { id: 'L5', type: 'root', region:'lower' },
      { id: 'S1', type: 'root', region:'lower' },
      { id: 'S2', type: 'root', region:'lower' },

      // Plexus/Cords
      { id: 'Brachial plexus', type: 'plexus', region:'upper' },
      { id: 'Lateral cord', type: 'cord', region:'upper' },
      { id: 'Posterior cord', type: 'cord', region:'upper' },
      { id: 'Medial cord', type: 'cord', region:'upper' },
      { id: 'Lumbar plexus', type: 'plexus', region:'lower' },
      { id: 'Sacral plexus', type: 'plexus', region:'lower' },

      // Nerves (Upper limb)
      { id: 'Musculocutaneous nerve', type: 'nerve', region:'upper' },
      { id: 'Axillary nerve', type: 'nerve', region:'upper' },
      { id: 'Radial nerve', type: 'nerve', region:'upper' },
      { id: 'Median nerve', type: 'nerve', region:'upper' },
      { id: 'Ulnar nerve', type: 'nerve', region:'upper' },

      // Nerves (Lower limb)
      { id: 'Femoral nerve', type: 'nerve', region:'lower' },
      { id: 'Obturator nerve', type: 'nerve', region:'lower' },
      { id: 'Sciatic nerve', type: 'nerve', region:'lower' },
      { id: 'Tibial nerve', type: 'nerve', region:'lower' },
      { id: 'Common peroneal nerve', type: 'nerve', region:'lower' },
      { id: 'Deep peroneal nerve', type: 'nerve', region:'lower' },
      { id: 'Superficial peroneal nerve', type: 'nerve', region:'lower' },
      { id: 'Saphenous nerve', type: 'nerve', region:'lower' }, // sensory branch of femoral

      // Muscles (Upper limb examples)
      { id: 'Deltoid', type: 'muscle', region:'upper' },
      { id: 'Teres minor', type: 'muscle', region:'upper' },
      { id: 'Biceps brachii', type: 'muscle', region:'upper' },
      { id: 'Brachialis', type: 'muscle', region:'upper' },
      { id: 'Triceps brachii', type: 'muscle', region:'upper' },
      { id: 'Extensor digitorum', type: 'muscle', region:'upper' },
      { id: 'Pronator teres', type: 'muscle', region:'upper' },
      { id: 'Flexor carpi radialis', type: 'muscle', region:'upper' },
      { id: 'Abductor pollicis brevis (APB)', type: 'muscle', region:'upper' },
      { id: 'First dorsal interosseous (FDI)', type: 'muscle', region:'upper' },
      { id: 'Abductor digiti minimi (ADM)', type: 'muscle', region:'upper' },

      // Muscles (Lower limb examples)
      { id: 'Quadriceps (VL/VM/VI)', type: 'muscle', region:'lower' },
      { id: 'Iliopsoas', type: 'muscle', region:'lower' },
      { id: 'Adductor longus', type: 'muscle', region:'lower' },
      { id: 'Adductor magnus', type: 'muscle', region:'lower' },
      { id: 'Tibialis anterior', type: 'muscle', region:'lower' },
      { id: 'Extensor digitorum brevis (EDB)', type: 'muscle', region:'lower' },
      { id: 'Peroneus longus', type: 'muscle', region:'lower' },
      { id: 'Gastrocnemius', type: 'muscle', region:'lower' },
      { id: 'Soleus', type: 'muscle', region:'lower' },
      { id: 'Tibialis posterior', type: 'muscle', region:'lower' },
    ],

    links: [
      // Roots -> Brachial plexus
      { source: 'C5', target: 'Brachial plexus', value: 2 },
      { source: 'C6', target: 'Brachial plexus', value: 2 },
      { source: 'C7', target: 'Brachial plexus', value: 2 },
      { source: 'C8', target: 'Brachial plexus', value: 2 },
      { source: 'T1', target: 'Brachial plexus', value: 2 },

      // Brachial plexus -> cords (simplified)
      { source: 'Brachial plexus', target: 'Lateral cord', value: 2 },
      { source: 'Brachial plexus', target: 'Posterior cord', value: 2 },
      { source: 'Brachial plexus', target: 'Medial cord', value: 2 },

      // Cords -> major nerves
      { source: 'Lateral cord', target: 'Musculocutaneous nerve', value: 2 },
      { source: 'Posterior cord', target: 'Axillary nerve', value: 1 },
      { source: 'Posterior cord', target: 'Radial nerve', value: 3 },
      { source: 'Lateral cord', target: 'Median nerve', value: 1 },
      { source: 'Medial cord', target: 'Median nerve', value: 1 },
      { source: 'Medial cord', target: 'Ulnar nerve', value: 2 },

      // Nerves -> muscles (upper limb)
      { source: 'Axillary nerve', target: 'Deltoid', value: 1 },
      { source: 'Axillary nerve', target: 'Teres minor', value: 1 },
      { source: 'Musculocutaneous nerve', target: 'Biceps brachii', value: 1 },
      { source: 'Musculocutaneous nerve', target: 'Brachialis', value: 1 },
      { source: 'Radial nerve', target: 'Triceps brachii', value: 1 },
      { source: 'Radial nerve', target: 'Extensor digitorum', value: 1 },
      { source: 'Median nerve', target: 'Pronator teres', value: 1 },
      { source: 'Median nerve', target: 'Flexor carpi radialis', value: 1 },
      { source: 'Median nerve', target: 'Abductor pollicis brevis (APB)', value: 1 },
      { source: 'Ulnar nerve', target: 'First dorsal interosseous (FDI)', value: 1 },
      { source: 'Ulnar nerve', target: 'Abductor digiti minimi (ADM)', value: 1 },

      // Roots -> Lower plexus
      { source: 'L2', target: 'Lumbar plexus', value: 2 },
      { source: 'L3', target: 'Lumbar plexus', value: 2 },
      { source: 'L4', target: 'Lumbar plexus', value: 2 },
      { source: 'L4', target: 'Sacral plexus', value: 1 }, // lumbosacral trunk
      { source: 'L5', target: 'Sacral plexus', value: 2 },
      { source: 'S1', target: 'Sacral plexus', value: 2 },
      { source: 'S2', target: 'Sacral plexus', value: 2 },

      // Plexus -> Nerves (lower limb)
      { source: 'Lumbar plexus', target: 'Femoral nerve', value: 3 },
      { source: 'Lumbar plexus', target: 'Obturator nerve', value: 2 },
      { source: 'Femoral nerve', target: 'Saphenous nerve', value: 1 },
      { source: 'Sacral plexus', target: 'Sciatic nerve', value: 4 },
      { source: 'Sciatic nerve', target: 'Tibial nerve', value: 2 },
      { source: 'Sciatic nerve', target: 'Common peroneal nerve', value: 2 },
      { source: 'Common peroneal nerve', target: 'Deep peroneal nerve', value: 1 },
      { source: 'Common peroneal nerve', target: 'Superficial peroneal nerve', value: 1 },

      // Nerves -> muscles (lower limb)
      { source: 'Femoral nerve', target: 'Quadriceps (VL/VM/VI)', value: 1 },
      { source: 'Femoral nerve', target: 'Iliopsoas', value: 1 },
      { source: 'Obturator nerve', target: 'Adductor longus', value: 1 },
      { source: 'Obturator nerve', target: 'Adductor magnus', value: 1 },
      { source: 'Deep peroneal nerve', target: 'Tibialis anterior', value: 1 },
      { source: 'Deep peroneal nerve', target: 'Extensor digitorum brevis (EDB)', value: 1 },
      { source: 'Superficial peroneal nerve', target: 'Peroneus longus', value: 1 },
      { source: 'Tibial nerve', target: 'Gastrocnemius', value: 1 },
      { source: 'Tibial nerve', target: 'Soleus', value: 1 },
      { source: 'Tibial nerve', target: 'Tibialis posterior', value: 1 },
    ]
  };

  // EMG screening suggestions (簡化示例，可擴充)
  const EMG_TIPS = {
    'C6': ['Biceps, BR（近端）', 'Median/FCR（遠端對照）'],
    'C7': ['Triceps', 'Extensor digitorum'],
    'C8': ['APB（median）', 'ADM/FDI（ulnar）'],
    'T1': ['FDI（深層手內在肌）'],
    'L4': ['Vastus medialis（Femoral）', 'Tibialis anterior（Deep peroneal）'],
    'L5': ['Tibialis anterior, EDB（Deep peroneal）', 'Tibialis posterior（Tibial）'],
    'S1': ['Gastrocnemius, Soleus（Tibial）', 'Peroneus longus（Superficial peroneal）'],
    'Median nerve': ['APB, Pronator teres'],
    'Ulnar nerve': ['FDI, ADM'],
    'Radial nerve': ['Triceps（高位）/ EDC（前臂）'],
    'Femoral nerve': ['Vastus medialis / Quadriceps'],
    'Obturator nerve': ['Adductor longus / magnus'],
    'Deep peroneal nerve': ['Tibialis anterior, EDB'],
    'Tibial nerve': ['Gastrocnemius, Soleus, Tibialis posterior']
  };

  // ===============
  // Helpers
  // ===============
  const colorFor = (type) => ({
    root: '#60a5fa', plexus: '#34d399', trunk: '#34d399', division: '#34d399', cord: '#34d399', nerve: '#f59e0b', muscle: '#f87171'
  })[type] || '#93c5fd';

  const byId = new Map(DATA.nodes.map(n => [n.id, n]));

  function filterByRegion(region) {
    if (region === 'all') return { nodes: DATA.nodes.slice(), links: DATA.links.slice() };
    const allowed = new Set(DATA.nodes.filter(n => n.region === region || n.type === 'root').map(n => n.id));
    // keep intermediate shared nodes (e.g., cords) if connected to allowed links
    const links = DATA.links.filter(l => allowed.has(l.source) || allowed.has(l.target));
    const used = new Set();
    links.forEach(l => { used.add(l.source); used.add(l.target); });
    const nodes = DATA.nodes.filter(n => used.has(n.id));
    return { nodes, links };
  }

  function buildSankeyData(region) {
    const { nodes, links } = filterByRegion(region);
    // d3-sankey expects indices
    const nodeIndex = new Map(nodes.map((n, i) => [n.id, i]));
    const sNodes = nodes.map(n => ({ ...n }));
    const sLinks = links.map(l => ({ source: nodeIndex.get(l.source), target: nodeIndex.get(l.target), value: l.value, _ids: {source:l.source, target:l.target} }));
    return { sNodes, sLinks, indexToId: new Map(nodes.map((n, i)=>[i, n.id])) };
  }

  // BFS to get path for a selected endpoint
  function computePath(graph, startId, direction = 'down') {
    // graph: { out: Map(id -> [targetId]), in: Map(id -> [sourceId]) }
    const visited = new Set();
    const queue = [startId];
    visited.add(startId);
    while (queue.length) {
      const v = queue.shift();
      const nexts = direction === 'down' ? (graph.out.get(v) || []) : (graph.in.get(v) || []);
      for (const u of nexts) if (!visited.has(u)) { visited.add(u); queue.push(u); }
    }
    return visited; // nodes reachable
  }

  function buildGraph(links) {
    const out = new Map();
    const inw = new Map();
    for (const l of links) {
      if (!out.has(l._ids.source)) out.set(l._ids.source, []);
      if (!inw.has(l._ids.target)) inw.set(l._ids.target, []);
      out.get(l._ids.source).push(l._ids.target);
      inw.get(l._ids.target).push(l._ids.source);
    }
    return { out, in: inw };
  }

  // ===============
  // Render Sankey
  // ===============
  const svg = d3.select('#svg');
  const g = svg.append('g').attr('transform', 'translate(24,24)');
  const width = () => svg.node().clientWidth - 48;
  const height = () => svg.node().clientHeight - 48;

  const sankey = d3.sankey()
    .nodeWidth(14)
    .nodePadding(10)
    .extent([[0,0],[width(),height()]]);

  let current = { region: 'upper', sNodes:[], sLinks:[], idFromIndex:new Map(), graph:null };

  function render(region) {
    svg.selectAll('*').remove();
    const root = svg.append('g').attr('transform','translate(24,24)');

    const { sNodes, sLinks, indexToId } = buildSankeyData(region);
    const { nodes, links } = sankey({ nodes: sNodes, links: sLinks });

    // Links
    const link = root.append('g').selectAll('path')
      .data(links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', d => d3.color(colorFor(nodes[d.source.index].type)).darker(0.5))
      .attr('stroke-width', d => Math.max(0.6, d.width * 0.72))
      .on('mouseover', (_, d) => highlightLink(d))
      .on('mouseout', clearHover)
      .on('click', (_, d) => selectPath(nodes[d.source.index].id, nodes[d.target.index].id));

    // Nodes
    const node = root.append('g').selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .on('mouseover', (_, d) => highlightNode(d.id))
      .on('mouseout', clearHover)
      .on('click', (_, d) => selectNode(d.id));

    node.append('rect')
      .attr('height', d => Math.max(8, d.y1 - d.y0))
      .attr('width', d => Math.max(8, d.x1 - d.x0))
      .attr('fill', d => colorFor(d.type))
      .attr('opacity', .95)
      .append('title').text(d => d.id);

    node.append('text')
      .attr('x', d => (d.x0 < width()/2 ? (d.x1 - d.x0 + 6) : -6))
      .attr('y', d => (d.y1 - d.y0)/2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width()/2 ? 'start' : 'end')
      .text(d => d.id);

    current = { region, sNodes:nodes, sLinks:links, idFromIndex: indexToId, graph: buildGraph(sLinks) };

    function highlightNode(id) {
      const related = new Set([id]);
      // add neighbors
      for (const l of links) if (l._ids && (l._ids.source === id || l._ids.target === id)) {
        related.add(l._ids.source); related.add(l._ids.target);
      }
      dimExcept(related);
    }

    function highlightLink(l) {
      const set = new Set([l._ids.source, l._ids.target]);
      dimExcept(set, l);
    }

    function clearHover() { undim(); }

    function dimExcept(keepSet, linkKeep=null) {
      node.classed('dimmed', d => !keepSet.has(d.id));
      link.classed('dimmed', d => !(linkKeep ? d === linkKeep : (keepSet.has(d._ids.source) && keepSet.has(d._ids.target))));
    }

    function undim(){ node.classed('dimmed', false); link.classed('dimmed', false); }

    // expose for buttons
    window.__dimExcept = dimExcept; window.__undim = undim; window.__nodeSel = node; window.__linkSel = link;
  }

  // ===============
  // Selections & Details
  // ===============
  function setActiveTags(tags) {
    const box = document.getElementById('activeTags');
    box.innerHTML = '';
    tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = t; box.appendChild(span);
    })
  }

  function detailCard(title, items, hint) {
    const wrap = document.createElement('div');
    wrap.className = 'card';
    const h = document.createElement('div'); h.innerHTML = `<b>${title}</b>`; wrap.appendChild(h);
    const ul = document.createElement('ul'); ul.style.margin='6px 0'; ul.style.lineHeight='1.6';
    items.forEach(i => { const li = document.createElement('li'); li.textContent = i; ul.appendChild(li); });
    wrap.appendChild(ul);
    if (hint) { const p = document.createElement('div'); p.className='muted'; p.textContent = hint; wrap.appendChild(p); }
    return wrap;
  }

  function showDetails(pathNodes, key) {
    const box = document.getElementById('detail');
    box.innerHTML = '';

    // Ordered by categories
    const typeOrder = ['root','plexus','trunk','division','cord','nerve','muscle'];
    const grouped = d3.group(pathNodes, n => n.type);
    const list = [];
    for (const t of typeOrder) if (grouped.has(t)) list.push([t, grouped.get(t)]);

    const labels = {root:'Spinal roots', plexus:'Plexus / Cords', trunk:'Trunks', division:'Divisions', cord:'Cords', nerve:'Terminal nerves', muscle:'Target muscles'};

    list.forEach(([t, arr]) => {
      const names = arr.map(d => d.id);
      box.appendChild(detailCard(labels[t]||t, names));
    });

    if (EMG_TIPS[key]) {
      box.appendChild(detailCard('EMG 建議取樣肌肉', EMG_TIPS[key], '依臨床而調整，搭配感覺/運動傳導檢查、針極電位與招募時相。'));
    }
  }

  function selectNode(id) {
    const node = current.sNodes.find(n => n.id === id);
    if (!node) return;
    const dir = (node.type === 'nerve' || node.type === 'plexus' || node.type === 'root' || node.type === 'cord') ? 'down' : 'up';
    const setA = computePath(current.graph, id, 'down');
    const setB = computePath(current.graph, id, 'up');
    const all = new Set([...setA, ...setB]);
    const nodes = current.sNodes.filter(n => all.has(n.id));
    setActiveTags(['選取：'+id]);
    // Highlight in viz
    const keep = new Set(nodes.map(n => n.id));
    window.__dimExcept(keep);
    // Mark selected nodes/links strongly
    window.__nodeSel.classed('hl-node', d => keep.has(d.id));
    window.__linkSel.classed('hl-link', d => keep.has(d._ids.source) && keep.has(d._ids.target));

    showDetails(nodes, id);
  }

  function selectPath(srcId, tgtId){
    setActiveTags(['路徑：'+srcId+' → '+tgtId]);
  }

  // ===============
  // Export helpers
  // ===============
  function download(filename, text) {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    el.setAttribute('download', filename);
    el.style.display = 'none'; document.body.appendChild(el); el.click(); document.body.removeChild(el);
  }

  function exportSVG(){
    const s = document.querySelector('#viz svg');
    const blob = new Blob([s.outerHTML], {type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'emg_pathways.svg'; a.click(); URL.revokeObjectURL(url);
  }

  function exportPNG(){
    const s = document.querySelector('#viz svg');
    const xml = new XMLSerializer().serializeToString(s);
    const svg64 = btoa(unescape(encodeURIComponent(xml)));
    const imgSrc = 'data:image/svg+xml;base64,'+svg64;
    const image = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = s.clientWidth; canvas.height = s.clientHeight; const ctx = canvas.getContext('2d');
    image.onload = function(){ ctx.drawImage(image,0,0); const a = document.createElement('a'); a.download='emg_pathways.png'; a.href=canvas.toDataURL('image/png'); a.click(); };
    image.src = imgSrc;
  }

  // ===============
  // Populate selects & events
  // ===============
  function getItems(region, category){
    const nodes = DATA.nodes.filter(n => (region==='all' || n.region===region));
    if (category === 'root') return nodes.filter(n => n.type==='root');
    if (category === 'plexuscord') return nodes.filter(n => n.type==='plexus' || n.type==='cord');
    if (category === 'nerve') return nodes.filter(n => n.type==='nerve');
    if (category === 'muscle') return nodes.filter(n => n.type==='muscle');
    return nodes;
  }

  function populateGlobalOptions(region){
    const cat = document.getElementById('categorySel').value;
    const list = getItems(region, cat).map(n => ({id:n.id,type:n.type})).sort((a,b)=>a.id.localeCompare(b.id));
    const sel = document.getElementById('globalSel');
    sel.innerHTML = list.map(o => `<option value="${o.id}">${o.id}</option>`).join('');
  }

  function attachGlobalFilter(){
    const gf = document.getElementById('globalFilter');
    gf.addEventListener('input', () => {
      const sel = document.getElementById('globalSel');
      const v = (gf.value||'').toLowerCase();
      Array.from(sel.options).forEach(o => { o.hidden = v && !o.value.toLowerCase().includes(v); });
    });
  }

  function attachActions(){
    document.getElementById('showSelected').onclick = () => selectNode(document.getElementById('globalSel').value);
    document.getElementById('resetBtn').onclick = () => { setActiveTags([]); window.__undim(); showPicked(null); };
    document.getElementById('exportSVG').onclick = exportSVG;
    document.getElementById('exportPNG').onclick = exportPNG;
    document.getElementById('regionSel').onchange = (e) => { const r = e.target.value; populateGlobalOptions(r); render(r); };
    document.getElementById('categorySel').onchange = () => populateGlobalOptions(current.region);
  }

  function showPicked(node){
    const box = document.getElementById('pickedTarget');
    if (!node){ box.style.display = 'none'; return; }
    box.style.display = 'block';
    document.getElementById('pickedTitle').textContent = node.id;
    const meta = [];
    if (node.type) meta.push(`類別：${node.type}`);
    const reg = node.region ? node.region : (byId.get(node.id)||{}).region;
    if (reg) meta.push(`區域：${reg}`);
    document.getElementById('pickedMeta').textContent = meta.join(' ｜ ');
  }

  // override selectNode to also update right highlight
  const _origSelectNode = selectNode;
  selectNode = function(id){
    const node = current.sNodes.find(n => n.id === id) || byId.get(id);
    _origSelectNode(id);
    if (node) showPicked(node);
  }

  // ===============
  // Init
  // ===============
  function init(){
    attachGlobalFilter();
    attachActions();
    render('upper');
    populateGlobalOptions('upper');
  }

  window.addEventListener('resize', () => render(current.region));
  init();
  </script>
</body>
</html>
