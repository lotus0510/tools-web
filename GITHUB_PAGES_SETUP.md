# GitHub Pages 設置指南

## 🚨 緊急修復步驟

您的網站 https://lotus0510.github.io/tools-web/ 顯示空白，我已經修復了以下問題：

### 1. ✅ 路徑配置修復
- 將 `base: '/toos-web/'` 改為 `base: '/tools-web/'`
- 更新 homepage URL 為正確的 repository 名稱

### 2. ✅ index.html 重建
- 重新創建了完整的 index.html 文件
- 添加了 SPA 路由支持腳本
- 包含完整的 meta 標籤和 SEO 優化

### 3. ✅ 404 頁面支持
- 創建 public/404.html 處理 GitHub Pages 路由

## 🔧 立即執行步驟

### 1. 推送修復
```bash
git add .
git commit -m "Fix GitHub Pages deployment - rebuild index.html and correct paths"
git push origin main
```

### 2. 檢查 GitHub Actions
1. 進入 https://github.com/lotus0510/tools-web/actions
2. 查看最新的 workflow 運行狀態
3. 確保構建成功完成

### 3. 清除緩存
- 清除瀏覽器緩存
- 等待 2-3 分鐘讓 GitHub Pages 更新
- 重新訪問 https://lotus0510.github.io/tools-web/

## 🔍 故障排除

### 如果頁面仍然空白：

#### 檢查 1: GitHub Pages 設置
1. 進入 https://github.com/lotus0510/tools-web/settings/pages
2. 確保 Source 設置為 "GitHub Actions"
3. 檢查是否有自定義域名設置

#### 檢查 2: 構建狀態
1. 查看 GitHub Actions 日誌
2. 確認構建沒有錯誤
3. 檢查 dist 目錄是否正確生成

#### 檢查 3: 瀏覽器開發者工具
1. 按 F12 打開開發者工具
2. 查看 Console 是否有錯誤
3. 檢查 Network 標籤的資源載入狀態

### 常見問題解決：

#### 問題 1: 資源 404 錯誤
```bash
# 確保 vite.config.ts 中的 base 路徑正確
base: '/tools-web/'
```

#### 問題 2: JavaScript 不執行
```bash
# 檢查 index.html 中的 script 標籤
<script type="module" src="/src/main.tsx"></script>
```

#### 問題 3: CSS 樣式不載入
```bash
# 確保所有資源使用相對路徑
# Vite 會自動處理路徑前綴
```

## 📊 驗證部署成功

### 成功指標：
- ✅ 頁面顯示 "實用工具集" 標題
- ✅ 左側顯示工具分類選單
- ✅ 可以點擊不同工具進行切換
- ✅ 響應式設計在移動端正常工作

### 測試步驟：
1. 訪問主頁：https://lotus0510.github.io/tools-web/
2. 點擊左側選單中的 "Base64 編碼"
3. 測試編碼功能是否正常
4. 切換到 "新聞閱讀器" 測試載入

## 🔄 如果問題持續

### 方案 A: 手動部署
```bash
npm install -g gh-pages
npm run deploy
```

### 方案 B: 檢查分支
```bash
# 確保 gh-pages 分支存在且有內容
git branch -a
git checkout gh-pages
ls -la
```

### 方案 C: 重新初始化
```bash
# 刪除 gh-pages 分支重新部署
git push origin --delete gh-pages
git push origin main
```

## 📞 聯繫支持

如果問題仍然存在，請：
1. 檢查 GitHub Actions 的詳細日誌
2. 確認 repository 名稱是否為 "tools-web"
3. 驗證 GitHub Pages 是否已啟用

---

**預期結果**: 修復後，您的網站應該在 2-3 分鐘內正常顯示。