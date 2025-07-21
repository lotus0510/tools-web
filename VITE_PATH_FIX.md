# 🚨 Vite 路徑問題修復

## 問題分析
```
Failed to resolve /tools-web/src/main.tsx from index.html
```

**根本原因**: 在 index.html 中手動添加了 base 路徑前綴，但 Vite 構建時會自動處理這些路徑。

## ✅ 修復方案

### 1. 恢復標準路徑
- `/tools-web/vite.svg` → `/vite.svg`
- `/tools-web/src/main.tsx` → `/src/main.tsx`

### 2. Vite 自動處理
- `vite.config.ts` 中的 `base: '/tools-web/'` 會自動為所有資源添加前綴
- index.html 中應該使用標準路徑，讓 Vite 處理

## 🔧 工作原理

### 開發時:
```
/src/main.tsx → http://localhost:5173/src/main.tsx
```

### 構建後:
```
/src/main.tsx → https://lotus0510.github.io/tools-web/assets/main-[hash].js
```

## 🚀 立即執行
```bash
git add .
git commit -m "Fix Vite build paths - remove manual base prefix from index.html"
git push origin main
```

## 📊 預期結果
- ✅ 本地構建成功: `npm run build`
- ✅ GitHub Actions 構建成功
- ✅ 網站正常部署和訪問

這次修復應該徹底解決路徑問題！