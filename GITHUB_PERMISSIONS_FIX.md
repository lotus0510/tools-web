# 🔐 GitHub Actions 權限修復

## 🚨 問題分析
```
remote: Permission to lotus0510/tools-web.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/lotus0510/tools-web.git/': The requested URL returned error: 403
```

**原因**: GitHub Actions 沒有推送到 gh-pages 分支的權限。

## ✅ 修復方案

### 1. 更新 GitHub Actions 工作流程
- 使用新的 GitHub Pages 部署方式
- 添加必要的權限設置
- 使用官方的 Pages 部署 Actions

### 2. 權限配置
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 3. 新的部署流程
1. `actions/configure-pages@v4` - 設置 Pages
2. `actions/upload-pages-artifact@v3` - 上傳構建產物
3. `actions/deploy-pages@v4` - 部署到 Pages

## 🔧 需要的 GitHub 設置

### 在 Repository Settings 中：
1. 進入 **Settings** > **Pages**
2. **Source** 選擇 **GitHub Actions**
3. 確保 **Actions permissions** 允許 GitHub Actions

### 檢查 Actions 權限：
1. 進入 **Settings** > **Actions** > **General**
2. 確保 **Workflow permissions** 設為：
   - ✅ **Read and write permissions**
   - 或者至少有 **Read repository contents and packages permissions**

## 🚀 立即執行
```bash
git add .
git commit -m "Fix GitHub Actions permissions for Pages deployment"
git push origin main
```

## 📊 預期結果
- ✅ GitHub Actions 有正確權限
- ✅ 使用新的 Pages 部署方式
- ✅ 自動部署成功
- ✅ 網站正常訪問

這個修復使用了 GitHub 推薦的新部署方式，應該解決權限問題！