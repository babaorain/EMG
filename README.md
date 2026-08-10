# EMG 肌肉選擇器

以肌肉選擇為核心的 Needle EMG worksheet 工具。醫師可依區域、root、muscle 或 nerve 搜尋，查看每條肌肉的上游神經路徑與 downstream nerve，將左右側肌肉加入清單，再輸出依 root 排序的空白檢查表。

## 目前功能

- 99 條 legacy 肌肉，另補入 C5–C8 cervical paraspinal，共 103 條。
- 顯示 `Root → Trunk / upstream → Division → Cord / plexus → Downstream nerve → Muscle`。
- 以區域、root 與文字搜尋篩選。
- 分別加入左側或右側肌肉，右側清單自動依 root 排序。
- 產生包含 IA、SA、MUAP、Recruitment、Activation 等空白欄位的 worksheet。
- 下載 UTF-8 CSV，或使用瀏覽器列印為紙本／PDF。
- 點擊肌肉的「扎針點」可開啟資料視窗；內容目前保留為待臨床資料匯入狀態。

## 臨床資料狀態

目前 muscle、root、terminal nerve 來自原始 legacy catalog；trunk、division、cord／plexus 與 nerve chain 由現有 anatomy graph 顯示。所有解剖路徑仍標示為「尚待臨床覆核」。扎針點不含任何推測內容，待提供正式資料後再匯入。

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
