# TOEIC Learning｜多益英文學習平台

可直接發布至 GitHub Pages 的純靜態學習網站，不需登入或後端服務。

## 使用方式

1. 直接開啟 `index.html`，即可在支援的瀏覽器中使用。
2. GitHub Pages：將此資料夾內檔案上傳到儲存庫根目錄，於 GitHub **Settings → Pages → Build and deployment → Deploy from a branch** 選擇 `main` 與 `/(root)`。
3. 開啟 `https://你的帳號.github.io/儲存庫名稱/`。

語音播放使用瀏覽器的 Web Speech API，因裝置、瀏覽器與安裝語音而異。題目為自編練習，非 ETS 官方試題。

## 資料更新

- `data.js`：單字資料（由原始 626 筆含重複詞條與補充字整理）。
- `app.js`：文法課程、練習題與網站互動。
- `styles.css`：視覺樣式。

目前為第一版，內含 964 個字詞、8 堂基礎文法及 16 道自編練習題。3,000 字為後續擴充目標，並非宣稱目前已收錄 3,000 字。字根、拼字拆分與詞族已先整理部分單字，其餘待逐步校訂補齊。
