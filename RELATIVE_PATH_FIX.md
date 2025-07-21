# 🎯 使用相對路徑修復 GitHub Pages

## 🔧 修復內容
將 `base: '/tools-web/'` 改為 `base: './'`

## 為什麼使用相對路徑？
- ✅ **通用性**: 在任何部署環境都能工作
- ✅ **簡單**: 不需要考慮具體的base路徑
- ✅ **可靠**: GitHub Pages、Netlify、Vercel都支持

## 🚀 立即執行
```bash
git add .
git commit -m "Use relative paths for GitHub Pages compatibility"
git push origin main
```

## 📊 預期結果
- 資源路徑變成相對路徑 `./assets/main-[hash].js`
- 在 GitHub Pages 上正常載入
- 404 錯誤消失