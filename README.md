# EMG 臨床圖譜

以肌肉選擇為核心的 Needle EMG worksheet 工具。醫師可依區域、root、muscle 或 nerve 搜尋，查看每條肌肉的上游神經路徑與 downstream nerve，將左右側肌肉加入清單，再輸出依 root 排序的空白檢查表。

## 目前功能

- 99 條 legacy 肌肉，另補入 C5–C8、thoracic paraspinal 與 flexor hallucis brevis，共 105 條；同一臨床區域內優先顯示有圖版者。
- 顯示 `Root → Trunk / upstream → Division → Cord / plexus → Downstream nerve → Muscle`。
- 以區域、root 與文字搜尋篩選。
- 分別加入左側或右側肌肉，右側清單自動依 root 排序。
- 產生包含 IA、SA、MUAP、Recruitment、Activation 等空白欄位的 worksheet。
- 下載 UTF-8 CSV，或使用瀏覽器列印為紙本／PDF。
- 點擊肌肉的「扎針點」可查看第 13 章整理的 61 組繁中說明與 64 個圖檔；同一肌肉可切換分部或瀏覽多張圖片。
- 課本未附圖的 34 條肌肉均有文字卡；每個欄位與條列逐句顯示精確來源、章節／圖號／頁碼或論文段落，並區分「直接技術依據、anatomy only、safety only、次級教學支持」。
- 課本有圖的部分肌肉另連結 peer-reviewed 技術、ultrasound 與風險資料；外部圖片或影片只提供原站連結，不複製到專案。
- 71 條具有第 13 章個別描述的網站肌肉，已依原書校正神經根與終末神經，並以第 32 章表 32.3／32.4 交叉核對。
- `#dermatomes` 為可獨立開啟的 Dermatome 頁面，包含書中頸胸與腰薦皮節圖，以及 ISNCSCI C2–S4/5 共 28 個標準化感覺檢查點。
- `#ncv` 為神經傳導技術頁面，收錄 34 項常用與特殊檢查、58 張課本圖版，以及 G1／G2／ground、刺激位置、距離、姿勢、成人參考值與技術陷阱。

## 臨床資料狀態

目前 71 條有扎針章節對應的肌肉，其 root 與 terminal nerve 來自 Preston & Shapiro 第四版第 13 章，並以第 32 章表格交叉核對；其餘 34 條仍沿用 legacy catalog。trunk、division、cord／plexus 與 nerve chain 由 anatomy graph 推導。NCV 技術與數值以同書第 4、10、11 章為主，必須在相同溫度、距離、電極與刺激條件下使用，正式判讀仍以所屬實驗室驗證過的 reference values 為準。皮節圖顯示典型分布，標準檢查點依 ISNCSCI 2019；相鄰皮節廣泛重疊，不應單獨用來證實或排除病灶。

扎針卡將「來源已查核」與「臨床內容已覆核」分開顯示。現階段新增內容的 `clinicalReviewStatus` 全部仍是 `pending-emg-physician`；來源映射不代表已由 EMG 醫師確認臨床可執行性。若只有 anatomy 或區域安全資料、找不到可驗證的 diagnostic needle route，介面不提供固定位置、角度或深度。Brachial plexus 頁面的 bedside matrix 是使用者手寫卡的忠實轉錄並搭配外部證據，不是自動診斷規則或 externally validated protocol。

## 來源與媒體政策

- 外部來源集中於 `src/clinical/needleGuideEvidence.ts`，記錄完整 citation、HTTPS URL、精確 locator、證據層級、支持關係與查核日期。
- 外部補充媒體採 `link-only`；不把第三方網站、論文或影片的圖片下載進 `public/`。
- `public/needle-guides/` 內的 Preston & Shapiro 圖版是專案既有素材。書目引用不等於取得公開網路重製授權；專案擁有者在公開部署前仍須自行確認授權範圍。若無公開重製權，應移除這些圖檔，只保留圖號、文字摘要及正版來源連結。
- 深層或高風險肌肉的 anatomy／ultrasound 資料不能被外推成 blind diagnostic needle protocol。

## 資料與效能邊界

- 本專案目前是靜態、client-only 工具；worksheet 的病人背景文字只存在目前瀏覽器記憶體，不會主動上傳或持久化，重新整理即消失。仍不應在共用裝置留下可識別資料或未受控的列印／下載檔。
- 臨床 catalog 在 production 直接使用 TypeScript 型別；Zod schema 留在測試階段驗證靜態 JSON，避免首屏支付 runtime validation 成本。
- Dermatome、NCV、Brachial plexus、扎針 dialog 與 worksheet 採 lazy loading；首屏只載入肌肉選擇需要的程式碼與字型字重。

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
