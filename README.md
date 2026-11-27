# 小步學英文｜第十二版：原創多益題型入門、進度備份、四入口導覽

**適用於 GitHub Pages 的純靜態網站。** 不需要伺服器或付費 API。保留原有 3,000 字詞、59 個文法主題、字首字根字尾與字族索引、學習筆記、朗讀與間隔複習。

## 這一版新增

- **四大入口**：今天學習、查教材、練習卷、我的紀錄。進入首頁即可繼續上次的學習步驟。
- **36 回／510 題練習卷**：第 1–30 回為原有的 450 題基礎練習；第 31–36 回新增 60 題**原創 TOEIC L&R 題型入門題**。每回 10 題，依照 Part 2、3、4、5、6、7 分類，非官方歷屆試題。
- **線上作答、解析與 PDF**：新增 12 份 PDF（第 31–36 回，題目卷與答案解析卷各 1 份）。聽力題在網站上透過裝置內建英文語音朗讀，音質和正式多益錄音有所不同；Part 1 圖片題請先使用官方範例。
- **外部免費練習入口**：EnglishClub、TOEIC Training、WeLang、台灣 TOEIC 官方，提供前往原網站的連結。未複製他人的題目、音檔或解析。
- **學習進度保護**：「我的紀錄」提供儲存測試、JSON 備份下載、JSON 匯入還原。這些資料仍保存在**同一裝置、同一瀏覽器、同一網址**的 localStorage；**沒有跨裝置自動同步**。
- **保存狀態提醒**：使用瀏覽器儲存後再讀回檢查；若寫入失敗，顯示明確警示，不再靜默忽略。

## 練習卷分類

| 分類 | 回數 | 題數 |
|---|---:|---:|
| 基礎入門 | 01–10 | 150 |
| 文法打底 | 11–20 | 150 |
| 單字情境 | 21–30 | 150 |
| 原創多益題型入門 | 31–36 | 60 |
| **總計** | **36 回** | **510 題** |

站內新題的 `toeic-original.js` 含每題答案索引與中文解析。答題後會立即顯示理由。PDF 的聽力題**題目卷不印逐字稿**，須搭配網站朗讀作答；答案卷附完整文字稿。Part 6 題目為「單題段落填空入門」，不是官方完整題組的難度和篇幅；所有題目均非 ETS 官方考題，也不換算正式 TOEIC 分數。

## 授權與資料來源

以下資料只用來參考測驗題型、理解語言學習場景，**沒有重製或改寫其中的題目**：

- ETS 官方 TOEIC 準備資源：https://www.ets.org/toeic/test-takers/prepare.html
- IIBC 官方 TOEIC Listening & Reading 題型介紹：https://www.iibc-global.org/english/toeic/test/lr/about/format.html
- 台灣 TOEIC 官方題型範例：https://toeic.com.tw/sample-test/toeic-listening-reading/sample01.html
- EnglishClub TOEIC 練習：https://www.englishclub.com/esl-exams/ets-toeic-practice.php

公開免費不一定表示允許轉載。本網站新題為自行撰寫，外部題庫只提供連結。

## 更新 GitHub Pages

網站原址：https://coco11465002.github.io/toeic-learning/

1. **推薦：完整網站 ZIP** 解壓縮後，將所有根目錄檔案與 `papers/` 資料夾上傳到 `https://github.com/coco11465002/toeic-learning` 的 `main` 分支根目錄。
2. 確保 `index.html` 位於儲存庫根目錄，`papers/31_questions.pdf` 等新增 PDF 放在 `papers/` 資料夾內，而非 ZIP 內。
3. 提交到 `main` 後由 GitHub Pages 自動重新部署，網址不變。不要刪除原本儲存庫或清除瀏覽器網站資料。
4. **快速更新包只適合已使用第十一版的網站**：更新根目錄 `index.html`、`styles.css`、`app.js`、`toeic-original.js`、`README.md`，並上傳 `papers/31–36` 的 12 份 PDF。

## 進度安全說明

學習紀錄的 localStorage 鍵值仍是 `toeic-smallsteps-v5`，**沒有改名**，所以正常情況下可沿用第十、第十一版在同一網址與同一瀏覽器中的舊紀錄。

但以下情況可能看不到舊紀錄：換瀏覽器、換裝置、改為無痕模式、清除網站資料、打開不同網域網址，或瀏覽器限制 localStorage。這不代表 GitHub Pages 會主動刪除紀錄。**請每隔幾天到「我的紀錄」下載一次 JSON 備份，必要時匯入還原。**

## 各檔案用途

- `index.html`：網站入口與四大導覽
- `styles.css`：手帳樣式與手機版
- `app.js`：學習／答題／儲存／備份／還原等功能
- `toeic-original.js`：這一版新增的 6 回、60 題原創多益題型入門題
- `papers/31_questions.pdf` ～ `papers/36_answers.pdf`：新題目的 12 份 PDF
- `papers-data.js`、`papers-extra.js`：既有 30 回練習題
- `data.js`、`curriculum.js`、`enrichment.js`、`morphology-index.js`：既有單字、文法、例句及構詞索引
- `LICENSE-ECDICT.txt`、`MORPH-AUDIT.txt`：既有字典授權與構詞索引說明

注意：網站目前只是個人學習工具，不具備帳號系統、跨裝置雲端同步或官方多益測驗的認證功能。
