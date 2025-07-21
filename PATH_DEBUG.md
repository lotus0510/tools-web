# 🔍 GitHub Pages 路徑問題調試

## 🚨 問題確認
- **網站URL**: https://lotus0510.github.io/tools-web/
- **資源404**: `/vite.svg`, `/src/main.tsx`
- **正確路徑應該是**: `/tools-web/vite.svg`, `/tools-web/assets/main-[hash].js`

## 🔧 調試步驟

### 1. 檢查 vite.config.ts
```typescript
base: '/tools-web/'  // ✅ 已設置
```

### 2. 檢查 index.html (源文件)
```html
<link rel="icon" href="/vite.svg" />           // ✅ 正確 - Vite會處理
<script src="/src/main.tsx"></script>         // ✅ 正確 - Vite會處理
```

### 3. 檢查構建後的 index.html
應該變成:
```html
<link rel="icon" href="/tools-web/vite.svg" />
<script src="/tools-web/assets/main-[hash].js"></script>
```

## 🛠️ 可能的解決方案

### 方案A: 強制路徑處理
在 vite.config.ts 中添加 `renderBuiltUrl` 配置

### 方案B: 檢查構建環境
確保 GitHub Actions 中 `NODE_ENV=production`

### 方案C: 手動測試構建
```bash
npm run build
# 檢查 dist/index.html 內容
```

## 📊 下一步
1. 運行本地構建測試
2. 檢查構建產物
3. 修復路徑配置
4. 重新部署