# GitHub Pages 部署指南

## 🚀 自動部署設置

### 1. GitHub Repository 設置

#### 創建Repository
```bash
# 在GitHub上創建新的repository: toos-web
# 然後在本地初始化
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/toos-web.git
git push -u origin main
```

#### 啟用GitHub Pages
1. 進入Repository的 **Settings** 頁面
2. 滾動到 **Pages** 部分
3. 在 **Source** 下選擇 **GitHub Actions**
4. 保存設置

### 2. 環境變量設置

#### 添加Secrets
1. 進入Repository的 **Settings** > **Secrets and variables** > **Actions**
2. 點擊 **New repository secret**
3. 添加以下secrets：

```
Name: VITE_NEWS_API_KEY
Value: 3575154992b347df82eecc86f5e36d63
```

### 3. 自動部署流程

#### GitHub Actions工作流程
- **觸發條件**：推送到main分支
- **構建環境**：Ubuntu + Node.js 18
- **部署目標**：GitHub Pages
- **構建產物**：dist目錄

#### 部署步驟
1. 檢出代碼
2. 設置Node.js環境
3. 安裝依賴
4. 構建項目（注入環境變量）
5. 部署到GitHub Pages

### 4. 訪問網站

部署完成後，您的網站將可以通過以下地址訪問：
```
https://yourusername.github.io/toos-web/
```

## 🛠️ 手動部署（可選）

### 安裝gh-pages工具
```bash
npm install --save-dev gh-pages
```

### 手動部署命令
```bash
# 構建並部署
npm run deploy
```

## 📝 配置說明

### Vite配置 (vite.config.ts)
```typescript
export default defineConfig({
  base: '/toos-web/',  // GitHub Pages子路徑
  build: {
    outDir: 'dist',    // 構建輸出目錄
    sourcemap: false,  // 生產環境不生成sourcemap
  }
})
```

### 重要文件
- **`.github/workflows/deploy.yml`** - GitHub Actions工作流程
- **`public/.nojekyll`** - 禁用Jekyll處理
- **`CNAME`** - 自定義域名（如需要）

## 🔧 故障排除

### 常見問題

#### 1. 404錯誤
- 檢查`vite.config.ts`中的`base`路徑是否正確
- 確保repository名稱與配置一致

#### 2. 環境變量未生效
- 檢查GitHub Secrets是否正確設置
- 確保變量名稱以`VITE_`開頭

#### 3. 構建失敗
- 檢查Node.js版本兼容性
- 查看GitHub Actions日誌詳細錯誤

#### 4. 樣式或資源載入失敗
- 確保所有資源路徑使用相對路徑
- 檢查`public`目錄下的文件

### 調試步驟
1. 查看GitHub Actions執行日誌
2. 本地運行`npm run build`測試構建
3. 使用`npm run preview`預覽構建結果
4. 檢查瀏覽器開發者工具的網路請求

## 🌐 自定義域名（可選）

### 設置自定義域名
1. 在`public`目錄下創建`CNAME`文件
2. 在文件中寫入您的域名：
```
your-domain.com
```
3. 在域名提供商處設置DNS記錄：
```
Type: CNAME
Name: www (或 @)
Value: yourusername.github.io
```

### 更新配置
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // 自定義域名使用根路徑
})
```

## 📊 性能優化

### 構建優化
- **代碼分割**：自動分離vendor和應用代碼
- **資源壓縮**：Vite自動壓縮CSS和JS
- **Tree Shaking**：移除未使用的代碼

### CDN加速
GitHub Pages自動提供全球CDN加速，無需額外配置。

## 🔄 更新部署

### 自動更新
每次推送到main分支都會自動觸發部署：
```bash
git add .
git commit -m "Update features"
git push origin main
```

### 手動觸發
在GitHub Actions頁面可以手動觸發工作流程。

---

## 📞 技術支持

### 有用的鏈接
- [GitHub Pages文檔](https://docs.github.com/en/pages)
- [GitHub Actions文檔](https://docs.github.com/en/actions)
- [Vite部署指南](https://vitejs.dev/guide/static-deploy.html)

### 常用命令
```bash
# 本地開發
npm run dev

# 構建測試
npm run build
npm run preview

# 代碼檢查
npm run lint

# 部署到GitHub Pages
git push origin main  # 自動部署
npm run deploy        # 手動部署
```

---

*部署完成後，您的實用工具集將在GitHub Pages上24/7可用！* 🚀