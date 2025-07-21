import { useState } from 'react'
import './Base64Tool.css'

const Base64Tool = () => {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const handleEncode = (text: string) => {
    try {
      setError('')
      // 使用 btoa 進行 Base64 編碼，但需要先處理 UTF-8
      const encoded = btoa(unescape(encodeURIComponent(text)))
      setOutputText(encoded)
    } catch (err) {
      setError('編碼失敗：輸入包含無效字符')
      setOutputText('')
    }
  }

  const handleDecode = (text: string) => {
    try {
      setError('')
      // 使用 atob 進行 Base64 解碼，然後處理 UTF-8
      const decoded = decodeURIComponent(escape(atob(text)))
      setOutputText(decoded)
    } catch (err) {
      setError('解碼失敗：輸入不是有效的 Base64 格式')
      setOutputText('')
    }
  }

  const handleInputChange = (text: string) => {
    setInputText(text)
    if (text.trim() === '') {
      setOutputText('')
      setError('')
      return
    }

    if (mode === 'encode') {
      handleEncode(text)
    } else {
      handleDecode(text)
    }
  }

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode)
    setError('')
    if (inputText.trim() === '') {
      setOutputText('')
      return
    }

    if (newMode === 'encode') {
      handleEncode(inputText)
    } else {
      handleDecode(inputText)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // 可以添加一個臨時的成功提示
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
    setError('')
  }

  const swapInputOutput = () => {
    if (outputText && !error) {
      setInputText(outputText)
      setMode(mode === 'encode' ? 'decode' : 'encode')
    }
  }

  return (
    <div className="base64-tool">
      <div className="tool-header">
        <h2>🔐 Base64 編碼/解碼工具</h2>
        <p>支持文本的 Base64 編碼和解碼，自動處理 UTF-8 字符</p>
      </div>

      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'encode' ? 'active' : ''}`}
          onClick={() => handleModeChange('encode')}
        >
          編碼 (Encode)
        </button>
        <button 
          className={`mode-btn ${mode === 'decode' ? 'active' : ''}`}
          onClick={() => handleModeChange('decode')}
        >
          解碼 (Decode)
        </button>
      </div>

      <div className="tool-content">
        <div className="input-section">
          <div className="section-header">
            <h3>{mode === 'encode' ? '原始文本' : 'Base64 文本'}</h3>
            <div className="section-actions">
              <button 
                className="action-btn"
                onClick={clearAll}
                disabled={!inputText && !outputText}
              >
                清空
              </button>
            </div>
          </div>
          <textarea
            className="text-input"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? '請輸入要編碼的文本...' : '請輸入要解碼的 Base64 文本...'}
            rows={8}
          />
          <div className="input-info">
            字符數: {inputText.length} | 字節數: {new Blob([inputText]).size}
          </div>
        </div>

        <div className="conversion-controls">
          <button 
            className="swap-btn"
            onClick={swapInputOutput}
            disabled={!outputText || !!error}
            title="交換輸入輸出"
          >
            ⇅
          </button>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h3>{mode === 'encode' ? 'Base64 結果' : '解碼結果'}</h3>
            <div className="section-actions">
              <button 
                className="action-btn"
                onClick={() => copyToClipboard(outputText)}
                disabled={!outputText || !!error}
              >
                複製
              </button>
            </div>
          </div>
          <textarea
            className={`text-output ${error ? 'error' : ''}`}
            value={error || outputText}
            readOnly
            placeholder={mode === 'encode' ? 'Base64 編碼結果將顯示在這裡...' : '解碼結果將顯示在這裡...'}
            rows={8}
          />
          {outputText && !error && (
            <div className="output-info">
              字符數: {outputText.length} | 字節數: {new Blob([outputText]).size}
            </div>
          )}
        </div>
      </div>

      <div className="tool-info">
        <h4>使用說明：</h4>
        <ul>
          <li><strong>編碼模式</strong>：將普通文本轉換為 Base64 格式</li>
          <li><strong>解碼模式</strong>：將 Base64 格式文本還原為普通文本</li>
          <li>支持中文和其他 UTF-8 字符</li>
          <li>點擊 ⇅ 按鈕可以快速交換輸入輸出內容</li>
          <li>Base64 常用於數據傳輸、存儲和 URL 安全編碼</li>
        </ul>
      </div>
    </div>
  )
}

export default Base64Tool