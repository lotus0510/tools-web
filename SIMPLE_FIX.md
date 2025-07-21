# 🎯 GitHub Pages 路徑問題 - 簡單修復

## 問題
資源路徑沒有包含 `/tools-web/` 前綴，導致404錯誤。

## 🔧 立即測試方案

### 1. 檢查當前配置
```bash
# 推送當前修復
git add .
git commit -m "Fix vite config for proper GitHub Pages paths"
git push origin main
```

### 2. 如果仍然404，使用備用方案

#### 備用方案A: 修改 index.html
將 index.html 中的路徑改為：
```html
<link rel="icon" href="./vite.svg" />
<script type="module" src="./assets/main.js"></script>
```

#### 備用方案B: 檢查 GitHub Pages 設置
1. Repository Settings > Pages
2. 確認 Source = "GitHub Actions"
3. 確認沒有自定義域名

#### 備用方案C: 使用相對路徑
在 vite.config.ts 中設置：
```typescript
base: './'  // 使用相對路徑
```

## 🚀 立即執行
先推送當前修復，等待3分鐘查看結果。