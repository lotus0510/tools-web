# Node.js PATH 環境變數問題記錄

## 問題描述

在 Windows 系統中，雖然 Node.js 已正確安裝，但在 PowerShell 中執行 `node --version` 和 `npm --version` 時出現以下錯誤：

```
node : The term 'node' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

## 問題分析

### 1. 實際狀況
- ✅ Node.js 已安裝在：`C:\Program Files\nodejs`
- ✅ PATH 環境變數中包含：`C:\Program Files\nodejs`
- ✅ 使用完整路徑可以成功執行：Node.js v22.13.0

### 2. 根本原因
- **PowerShell 會話環境變數載入問題**
- 可能是 Node.js 在當前 PowerShell 會話啟動後安裝
- PowerShell 沒有正確識別 PATH 中的 Node.js 路徑

## 解決方案

### 方案 1：重新啟動終端（推薦）
```powershell
# 關閉當前 PowerShell 視窗，重新開啟
```

### 方案 2：重新載入環境變數
```powershell
# 重新載入系統環境變數
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
```

### 方案 3：使用完整路徑（臨時解決）
```powershell
# 檢查版本
Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "--version" -Wait -NoNewWindow -PassThru

# 執行 npm 命令
& "C:\Program Files\nodejs\npm.cmd" install
```

### 方案 4：檢查 PowerShell 執行策略
```powershell
# 查看當前執行策略
Get-ExecutionPolicy

# 如果需要，設定執行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 驗證步驟

1. **檢查安裝**：
   ```powershell
   Test-Path "C:\Program Files\nodejs"
   Get-ChildItem "C:\Program Files\nodejs"
   ```

2. **檢查 PATH**：
   ```powershell
   $env:PATH -split ';' | Where-Object { $_ -like "*nodejs*" }
   ```

3. **測試執行**：
   ```powershell
   node --version
   npm --version
   ```

## 預防措施

1. **安裝後重啟終端**：Node.js 安裝完成後，務必重新啟動命令列工具
2. **使用官方安裝器**：使用 Node.js 官方 MSI 安裝器，確保正確設定環境變數
3. **檢查安裝路徑**：確認安裝路徑沒有特殊字元或空格問題

## 相關資訊

- **Node.js 版本**：v22.13.0
- **安裝路徑**：`C:\Program Files\nodejs`
- **npm 全域路徑**：`C:\Users\lotus\AppData\Roaming\npm`
- **系統**：Windows
- **終端**：PowerShell

## 備註

這是 Windows 環境下常見的環境變數載入時機問題，不是 Node.js 安裝本身的問題。大多數情況下，重新啟動終端即可解決。