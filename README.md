# 🛠️ 實用工具集 (Tools Web)

> 一個集成多種實用工具的現代化 Web 應用，基於 React + TypeScript + Vite 構建

[![部署狀態](https://github.com/lotus0510/tools-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/lotus0510/tools-web/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://lotus0510.github.io/tools-web/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-purple)](https://vitejs.dev/)

## 🌟 功能特色

### 📝 編碼工具
- **🔐 Base64 編碼器** - 支持文字與 Base64 格式的雙向轉換
- **📡 摩斯電碼轉換器** - 文字與摩斯電碼互轉，支持音頻播放功能

### 🎮 休閒遊戲
- **🎯 猜數字遊戲** - 經典的數字猜測遊戲，支持多種難度設定
- **🧠 記憶卡片遊戲** - 翻牌配對記憶遊戲，訓練記憶力和專注力
- **🐍 貪吃蛇遊戲** - 經典街機遊戲，支持鍵盤和觸控操作

### 🤖 AI 與資訊工具
- **🤖 AI 聊天助手** - 與多種 AI 模型進行智能對話
- **📰 熱門新聞查詢** - 瀏覽最新熱門新聞，掌握時事動態

### 🎭 生成器工具
- **🎭 隨機身份生成器** - 生成虛假身份信息，適用於測試和開發

## 🚀 在線體驗

**[🌐 立即體驗 →](https://lotus0510.github.io/tools-web/)**

## 📱 功能截圖

### 主界面
- 🏠 直觀的工具分類展示
- 📱 響應式設計，支持各種設備
- 🌙 深色/淺色主題切換（開發中）

### 工具界面
- 🎨 現代化的 UI 設計
- ⚡ 快速響應的用戶交互
- 📊 實時結果顯示

## 🛠️ 技術棧

### 前端框架
- **React 19.1.0** - 現代化的用戶界面庫
- **TypeScript 5.8.3** - 類型安全的 JavaScript 超集
- **Vite 7.0.4** - 快速的前端構建工具

### 開發工具
- **ESLint** - 代碼質量檢查
- **CSS3** - 現代化樣式設計
- **GitHub Actions** - 自動化部署

### 部署平台
- **GitHub Pages** - 免費的靜態網站託管

## 🏗️ 本地開發

### 環境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安裝步驟

1. **克隆項目**
```bash
git clone https://github.com/lotus0510/tools-web.git
cd tools-web
```

2. **安裝依賴**
```bash
npm install
```

3. **啟動開發服務器**
```bash
npm run dev
```

4. **打開瀏覽器**
```
http://localhost:5173
```

### 可用腳本

```bash
# 開發模式
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview

# 代碼檢查
npm run lint
```

## 📦 項目結構

```
tools-web/
├── public/                 # 靜態資源
│   ├── vite.svg           # 網站圖標
│   └── 404.html           # GitHub Pages 404 頁面
├── src/                   # 源代碼
│   ├── components/        # React 組件
│   │   ├── Base64Tool.tsx        # Base64 編碼工具
│   │   ├── IdentityGenerator.tsx # 身份生成器
│   │   ├── MorseCodeConverter.tsx # 摩斯電碼轉換器
│   │   ├── NumberGuessingGame.tsx # 猜數字遊戲
│   │   ├── MemoryCardGame.tsx    # 記憶卡片遊戲
│   │   ├── SnakeGame.tsx         # 貪吃蛇遊戲
│   │   ├── AIChatWindow.tsx      # AI 聊天助手
│   │   ├── NewsReader.tsx        # 新聞閱讀器
│   │   └── index.ts              # 組件導出
│   ├── assets/            # 資源文件
│   ├── App.tsx           # 主應用組件
│   ├── App.css           # 主樣式文件
│   ├── main.tsx          # 應用入口
│   └── index.css         # 全局樣式
├── .github/              # GitHub 配置
│   └── workflows/        # GitHub Actions
│       └── deploy.yml    # 自動部署配置
├── index.html            # HTML 模板
├── package.json          # 項目配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md            # 項目說明
```

## 🚀 部署說明

本項目使用 GitHub Actions 自動部署到 GitHub Pages：

1. **推送代碼到 main 分支**
```bash
git add .
git commit -m "feat: 新增功能"
git push origin main
```

2. **自動觸發部署**
   - GitHub Actions 會自動構建項目
   - 構建完成後自動部署到 GitHub Pages

3. **訪問網站**
   - 部署完成後可通過 [https://lotus0510.github.io/tools-web/](https://lotus0510.github.io/tools-web/) 訪問

## 🎯 開發計劃

### 即將推出
- [ ] 🌙 深色主題支持
- [ ] 📱 PWA 支持（離線使用）
- [ ] 🔧 更多編碼工具（URL 編碼、HTML 實體等）
- [ ] 🎮 更多小遊戲
- [ ] 📊 數據可視化工具

### 長期規劃
- [ ] 🔐 用戶設置保存
- [ ] 🌍 多語言支持
- [ ] 📈 使用統計
- [ ] 🔌 插件系統

## 🤝 貢獻指南

歡迎貢獻代碼！請遵循以下步驟：

1. **Fork 本項目**
2. **創建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **創建 Pull Request**

### 代碼規範
- 使用 TypeScript 進行開發
- 遵循 ESLint 配置
- 組件使用 PascalCase 命名
- 文件使用 camelCase 命名

## 📄 許可證

本項目採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情

## 👨‍💻 作者

**lotus0510**
- GitHub: [@lotus0510](https://github.com/lotus0510)
- 項目鏈接: [https://github.com/lotus0510/tools-web](https://github.com/lotus0510/tools-web)

## 🙏 致謝

- [React](https://reactjs.org/) - 用戶界面庫
- [Vite](https://vitejs.dev/) - 前端構建工具
- [TypeScript](https://www.typescriptlang.org/) - 類型安全
- [GitHub Pages](https://pages.github.com/) - 免費託管

---

⭐ 如果這個項目對你有幫助，請給它一個星星！

📧 有問題或建議？歡迎 [創建 Issue](https://github.com/lotus0510/tools-web/issues)