# EMG 臨床圖譜

以肌肉選擇為核心的 Needle EMG worksheet 工具。醫師可依區域、root、muscle 或 nerve 搜尋，查看每條肌肉的上游神經路徑與 downstream nerve，將左右側肌肉加入清單，再輸出依 root 排序的空白檢查表。

## 目前功能

- 99 條 legacy 肌肉，另補入 C5–C8、thoracic paraspinal 與 flexor hallucis brevis，共 105 條。
- 顯示 `Root → Trunk / upstream → Division → Cord / plexus → Downstream nerve → Muscle`。
- 以區域、root 與文字搜尋篩選。
- 分別加入左側或右側肌肉，右側清單自動依 root 排序。
- 產生包含 IA、SA、MUAP、Recruitment、Activation 等空白欄位的 worksheet。
- 下載 UTF-8 CSV，或使用瀏覽器列印為紙本／PDF。
- 點擊肌肉的「扎針點」可查看第 13 章整理的 61 組繁中說明與 63 組圖版；同一肌肉可切換分部或瀏覽多張圖片。
- 71 條具有第 13 章個別描述的網站肌肉，已依原書校正神經根與終末神經，並以第 32 章表 32.3／32.4 交叉核對。
- `#dermatomes` 為可獨立開啟的 Dermatome 頁面，包含書中頸胸與腰薦皮節圖，以及 ISNCSCI C2–S4/5 共 28 個標準化感覺檢查點。

## 臨床資料狀態

目前 71 條有扎針章節對應的肌肉，其 root 與 terminal nerve 來自 Preston & Shapiro 第四版第 13 章，並以第 32 章表格交叉核對；其餘 34 條仍沿用 legacy catalog。trunk、division、cord／plexus 與 nerve chain 由 anatomy graph 推導。這些資料均屬來源校正或教育用途，尚未標記為正式臨床覆核內容。皮節圖顯示典型分布，標準檢查點依 ISNCSCI 2019；相鄰皮節廣泛重疊，不應單獨用來證實或排除病灶。

## 本機執行

```bash
npm install
npm run dev
```

## 驗證

```bash
npm run lint
npm test
npm run build
```

視覺概念位於 `docs/design/`，瀏覽器 QA 截圖位於 `docs/qa/`。
