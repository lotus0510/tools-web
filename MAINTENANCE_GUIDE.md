# 🛠️ 實用工具集 - 維護指南

> 完整的項目維護、API 配置、部署流程文檔

## 📋 目錄

- [項目概述](#項目概述)
- [環境變數配置](#環境變數配置)
- [API 設置指南](#api-設置指南)
- [本地開發](#本地開發)
- [部署流程](#部署流程)
- [功能模組說明](#功能模組說明)
- [故障排除](#故障排除)
- [維護檢查清單](#維護檢查清單)

---

## 🎯 項目概述

### 技術棧
- **前端框架**：React 19.1.0 + TypeScript 5.8.3
- **構建工具**：Vite 7.0.4
- **部署平台**：GitHub Pages
- **CI/CD**：GitHub Actions

### 項目結構
```
tools-web/
├── src/
│   ├── components/          # React 組件
│   │   ├── Base64Tool.tsx          # Base64 編碼工具
│   │   ├── IdentityGenerator.tsx   # 身份生成器
│   │   ├── MorseCodeConverter.tsx  # 摩斯電碼轉換器
│   │   ├── NumberGuessingGame.tsx  # 猜數字遊戲
│   │   ├── MemoryCardGame.tsx      # 記憶卡片遊戲
│   │   ├── SnakeGame.tsx           # 貪吃蛇遊戲
│   │   ├── AIChatWindow.tsx        # AI 聊天助手 ⚠️ 需要 API
│   │   └── NewsReader.tsx          # 新聞閱讀器 ⚠️ 可選 API
│   ├── App.tsx              # 主應用組件
│   └── main.tsx            # 應用入口
├── .github/workflows/       # GitHub Actions
├── vite.config.ts          # Vite 配置
└── package.json            # 項目配置
```

---

## 🔐 環境變數配置

### 必需的環境變數

| 變數名 | 用途 | 必需性 | 獲取方式 |
|--------|------|--------|----------|
| `VITE_NEWS_API_KEY` | 新聞閱讀器後備 API | 可選 | [NewsAPI](https://newsapi.org/) |
| `VITE_AI_API_KEY` | AI 聊天助手 | 可選 | [OpenRouter](https://openrouter.ai/keys) |

### 環境變數優先級

#### 新聞功能
```
1. Google RSS (免費，無需 API) ✅
2. NewsAPI (需要 VITE_NEWS_API_KEY) ⚠️
3. 示例文章 (保證可用) ✅
```

#### AI 聊天功能
```
1. 環境變數 (VITE_AI_API_KEY) ⚠️
2. 用戶手動設置 ✅
3. 提示設置 API Key ✅
```

---

## 🔑 API 設置指南

### 1. NewsAPI 設置（可選）

#### 獲取 API Key
1. 訪問：https://newsapi.org/
2. 點擊 "Get API Key"
3. 免費註冊帳號
4. 複製 API Key

#### 功能說明
- **主要功能**：Google RSS（免費，無限制）
- **後備功能**：NewsAPI（免費額度：1000 請求/月）
- **無 API Key 影響**：僅失去 NewsAPI 後備，主要功能正常

### 2. OpenRouter AI API 設置（可選）

#### 獲取 API Key
1. 訪問：https://openrouter.ai/keys
2. 註冊並登入
3. 創建新的 API Key
4. 複製 API Key（格式：`sk-or-v1-...`）

#### 支援的模型
```typescript
// 免費模型（推薦）
'deepseek/deepseek-chat-v3-0324:free'     // 🥇 DeepSeek V3 (免費推薦)
'deepseek/deepseek-r1:free'               // 🥈 DeepSeek R1 (免費)
'moonshotai/kimi-k2:free'                 // 🥉 MoonshotAI Kimi K2 (免費)

// 付費模型
'anthropic/claude-4-sonnet'               // 🏆 Claude Sonnet 4 (付費推薦)
'google/gemini-2.0-flash-001'             // ⚡ Gemini 2.0 Flash (付費)
```

#### 無 API Key 影響
- 用戶可以在設置中手動配置 API Key
- 顯示設置提示和說明
- 不影響其他功能

---

## 💻 本地開發

### 環境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 開發步驟

#### 1. 克隆項目
```bash
git clone https://github.com/lotus0510/tools-web.git
cd tools-web
```

#### 2. 安裝依賴
```bash
npm install
```

#### 3. 環境變數設置（可選）
```bash
# 複製環境變數範例
cp .env.example .env

# 編輯 .env 文件
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_AI_API_KEY=your_openrouter_key_here
```

#### 4. 啟動開發服務器
```bash
npm run dev
```

#### 5. 訪問應用
```
http://localhost:5173
```

### 可用腳本
```bash
npm run dev      # 開發模式
npm run build    # 構建生產版本
npm run preview  # 預覽生產版本
npm run lint     # 代碼檢查
```

---

## 🚀 部署流程

### GitHub Pages 自動部署

#### 1. GitHub Secrets 設置（可選）
```
路徑：https://github.com/lotus0510/tools-web/settings/secrets/actions

添加 Secrets：
- Name: VITE_NEWS_API_KEY
  Value: 你的 NewsAPI 密鑰

- Name: VITE_AI_API_KEY  
  Value: 你的 OpenRouter 密鑰
```

#### 2. 推送代碼觸發部署
```bash
git add .
git commit -m "feat: 新功能或修復"
git push origin main
```

#### 3. 檢查部署狀態
```
GitHub Actions：https://github.com/lotus0510/tools-web/actions
部署網址：https://lotus0510.github.io/tools-web/
```

### 部署配置文件

#### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/tools-web/',  // ⚠️ 必須與 GitHub 倉庫名稱一致
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
```

#### .github/workflows/deploy.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      env:
        VITE_NEWS_API_KEY: ${{ secrets.VITE_NEWS_API_KEY }}
        VITE_AI_API_KEY: ${{ secrets.VITE_AI_API_KEY }}
        
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

---

## 🧩 功能模組說明

### 1. 編碼工具

#### Base64 編碼器
- **文件**：`src/components/Base64Tool.tsx`
- **功能**：文字與 Base64 雙向轉換
- **依賴**：無
- **狀態**：✅ 完全獨立

#### 摩斯電碼轉換器
- **文件**：`src/components/MorseCodeConverter.tsx`
- **功能**：文字與摩斯電碼轉換，音頻播放
- **依賴**：Web Audio API
- **狀態**：✅ 完全獨立

### 2. 遊戲娛樂

#### 猜數字遊戲
- **文件**：`src/components/NumberGuessingGame.tsx`
- **功能**：多難度數字猜測遊戲
- **依賴**：無
- **狀態**：✅ 完全獨立

#### 記憶卡片遊戲
- **文件**：`src/components/MemoryCardGame.tsx`
- **功能**：翻牌配對記憶遊戲
- **依賴**：無
- **狀態**：✅ 完全獨立

#### 貪吃蛇遊戲
- **文件**：`src/components/SnakeGame.tsx`
- **功能**：經典貪吃蛇遊戲
- **依賴**：Canvas API
- **狀態**：✅ 完全獨立

### 3. 生成器工具

#### 隨機身份生成器
- **文件**：`src/components/IdentityGenerator.tsx`
- **功能**：生成測試用虛假身份
- **依賴**：無
- **狀態**：✅ 完全獨立

### 4. AI 與資訊工具

#### AI 聊天助手
- **文件**：`src/components/AIChatWindow.tsx`
- **功能**：多模型 AI 對話
- **API**：OpenRouter API
- **環境變數**：`VITE_AI_API_KEY`
- **後備方案**：用戶手動設置
- **狀態**：⚠️ 需要 API Key

#### 新聞閱讀器
- **文件**：`src/components/NewsReader.tsx`
- **功能**：多國新聞瀏覽
- **主要 API**：Google RSS（免費）
- **後備 API**：NewsAPI
- **環境變數**：`VITE_NEWS_API_KEY`（可選）
- **狀態**：✅ 主要功能免費

---

## 🔧 故障排除

### 常見問題

#### 1. 部署後頁面空白
**原因**：`vite.config.ts` 中的 `base` 路徑不正確
```typescript
// ❌ 錯誤
base: '/wrong-repo-name/'

// ✅ 正確
base: '/tools-web/'
```

#### 2. 資源 404 錯誤
**原因**：路徑配置問題
**解決**：
1. 確認 `base: '/tools-web/'` 設置正確
2. 重新構建：`npm run build`
3. 檢查 `dist/` 目錄中的文件路徑

#### 3. GitHub Actions 部署失敗
**檢查步驟**：
1. 查看 Actions 日誌：https://github.com/lotus0510/tools-web/actions
2. 確認 Node.js 版本兼容
3. 檢查 package.json 依賴

#### 4. AI 聊天功能無法使用
**檢查步驟**：
1. 確認 API Key 格式：`sk-or-v1-...`
2. 檢查 OpenRouter 帳戶餘額
3. 查看瀏覽器控制台錯誤
4. 使用用戶設置手動配置

#### 5. 新聞功能載入失敗
**檢查步驟**：
1. Google RSS 是主要來源（通常可用）
2. 檢查網路連接
3. 查看日誌面板了解詳情
4. NewsAPI 僅為後備（可選）

### 調試工具

#### 1. 瀏覽器開發者工具
```javascript
// 檢查環境變數
console.log('News API Key:', import.meta.env.VITE_NEWS_API_KEY)
console.log('AI API Key:', import.meta.env.VITE_AI_API_KEY)
```

#### 2. 應用內日誌
- AI 聊天：點擊 📋 按鈕查看日誌
- 新聞閱讀器：點擊 📋 按鈕查看日誌

---

## ✅ 維護檢查清單

### 每月檢查

- [ ] **依賴更新**：檢查 npm 依賴是否有安全更新
- [ ] **API 狀態**：確認 OpenRouter 和 NewsAPI 服務正常
- [ ] **部署狀態**：檢查 GitHub Actions 是否正常運行
- [ ] **網站可用性**：訪問 https://lotus0510.github.io/tools-web/ 確認正常

### 功能測試

- [ ] **編碼工具**：Base64、摩斯電碼轉換正常
- [ ] **遊戲功能**：猜數字、記憶卡片、貪吃蛇正常
- [ ] **生成器**：身份生成器正常
- [ ] **AI 聊天**：API 連接和對話功能正常
- [ ] **新聞閱讀**：Google RSS 和搜索功能正常

### 安全檢查

- [ ] **API Keys**：確認 GitHub Secrets 安全存儲
- [ ] **依賴漏洞**：運行 `npm audit` 檢查安全漏洞
- [ ] **HTTPS**：確認網站使用 HTTPS 訪問

### 性能監控

- [ ] **載入速度**：檢查首頁載入時間
- [ ] **資源大小**：監控 bundle 大小變化
- [ ] **錯誤率**：檢查瀏覽器控制台錯誤

---

## 📞 支援聯繫

### 開發者
- **GitHub**：[@lotus0510](https://github.com/lotus0510)
- **項目**：[tools-web](https://github.com/lotus0510/tools-web)

### 相關資源
- **Vite 文檔**：https://vitejs.dev/
- **React 文檔**：https://reactjs.org/
- **GitHub Pages**：https://pages.github.com/
- **OpenRouter API**：https://openrouter.ai/docs
- **NewsAPI**：https://newsapi.org/docs

---

## 📝 更新日誌

### 版本記錄
- **v1.0.0** (2024-01): 初始版本，包含 8 個工具模組
- **v1.1.0** (2024-01): 優化 API 配置，改善錯誤處理
- **v1.2.0** (2024-01): 新增維護文檔，完善部署流程

### 下一步計劃
- [ ] PWA 支援（離線使用）
- [ ] 深色主題
- [ ] 更多編碼工具
- [ ] 數據可視化工具

---

**📋 本文檔最後更新：2024年1月**
**🔄 建議定期檢查並更新此文檔**