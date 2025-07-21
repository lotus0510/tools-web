# GitHub Pages 故障排除指南

## 🚨 當前問題：404 資源載入失敗

### 問題描述
```
Failed to load resource: the server responded with a status of 404 ()
vite.svg:1 Failed to load resource: the server responded with a status of 404 ()
```

### 🔧 已修復的問題

#### 1. 資源路徑修正
- 將絕對路徑 `/vite.svg` 改為相對路徑 `./vite.svg`
- 將 `/src/main.tsx` 改為 `./src/main.tsx`
- 確保Vite構建時使用正確的base路徑

#### 2. Vite配置優化
- 添加 `renderBuiltUrl` 配置確保資源路徑正確
- 保持 `base: '/tools-web/'` 配置

## 🚀 解決步驟

### 立即執行：
```bash
git add .
git commit -m "Fix 404 resource loading - use relative paths"
git push origin main
```

### 等待部署完成後測試：
1. 清除瀏覽器緩存 (Ctrl+Shift+R)
2. 訪問 https://lotus0510.github.io/tools-web/
3. 檢查開發者工具是否還有404錯誤

## 🔍 進一步診斷

### 如果問題持續，檢查以下：

#### 1. GitHub Actions 構建日誌
```
https://github.com/lotus0510/tools-web/actions
```
查看最新的workflow是否成功完成

#### 2. 檢查構建產物
確認dist目錄結構：
```
dist/
├── index.html
├── vite.svg
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

#### 3. 驗證資源URL
正確的資源URL應該是：
```
https://lotus0510.github.io/tools-web/vite.svg ✅
https://lotus0510.github.io/vite.svg ❌
```

## 🛠️ 替代解決方案

### 方案A：手動部署測試
```bash
npm run build
npm run preview
```
在本地測試構建結果

### 方案B：檢查GitHub Pages設置
1. 進入 Repository Settings > Pages
2. 確認Source設為 "GitHub Actions"
3. 檢查是否有自定義域名干擾

### 方案C：重新部署
```bash
# 清理並重新部署
rm -rf dist
npm run build
git add .
git commit -m "Rebuild and redeploy"
git push origin main
```

## 📊 成功指標

修復成功後，您應該看到：
- ✅ 無404錯誤在開發者工具Console
- ✅ 網站圖標正常顯示
- ✅ 頁面完全載入，顯示工具集界面
- ✅ 所有CSS和JS資源正常載入

## 🔄 常見GitHub Pages問題

### 問題1：緩存問題
- 解決：強制刷新 (Ctrl+Shift+R)
- 等待CDN更新 (可能需要5-10分鐘)

### 問題2：路徑大小寫敏感
- GitHub Pages區分大小寫
- 確保所有路徑使用正確的大小寫

### 問題3：MIME類型問題
- 確保 `.nojekyll` 文件存在
- 避免Jekyll處理干擾

---

**預期修復時間**: 推送後2-3分鐘內生效