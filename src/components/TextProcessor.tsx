import { useState, useEffect } from 'react'
import './TextProcessor.css'

interface TextStats {
  lines: number
  words: number
  characters: number
  charactersNoSpaces: number
  paragraphs: number
  sentences: number
}

const TextProcessor = () => {
  const [text, setText] = useState('')
  const [stats, setStats] = useState<TextStats>({
    lines: 0,
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
    sentences: 0
  })

  // 計算文本統計
  const calculateStats = (inputText: string): TextStats => {
    if (!inputText) {
      return {
        lines: 0,
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        paragraphs: 0,
        sentences: 0
      }
    }

    // 行數統計
    const lines = inputText.split('\n').length

    // 字符數統計
    const characters = inputText.length
    const charactersNoSpaces = inputText.replace(/\s/g, '').length

    // 單詞數統計（支援中英文）
    const words = inputText
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length

    // 段落數統計（以空行分隔）
    const paragraphs = inputText
      .split(/\n\s*\n/)
      .filter(paragraph => paragraph.trim().length > 0).length

    // 句子數統計（以句號、問號、驚嘆號結尾）
    const sentences = inputText
      .split(/[.!?。！？]+/)
      .filter(sentence => sentence.trim().length > 0).length

    return {
      lines,
      words,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences
    }
  }

  // 實時更新統計
  useEffect(() => {
    const newStats = calculateStats(text)
    setStats(newStats)
  }, [text])

  // 清空文本
  const clearText = () => {
    setText('')
  }

  // 複製統計結果
  const copyStats = () => {
    const statsText = `文本統計結果：
行數：${stats.lines}
段落數：${stats.paragraphs}
句子數：${stats.sentences}
單詞數：${stats.words}
字符數：${stats.characters}
字符數（不含空格）：${stats.charactersNoSpaces}`

    navigator.clipboard.writeText(statsText).then(() => {
      alert('統計結果已複製到剪貼板！')
    }).catch(() => {
      alert('複製失敗，請手動複製')
    })
  }

  // 從文件讀取文本
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setText(content)
      }
      reader.readAsText(file, 'UTF-8')
    }
  }

  return (
    <div className="text-processor">
      {/* 標題區域 */}
      <div className="tool-header">
        <h2>📝 文本處理工具</h2>
        <p>統計文本的行數、字數、字元數等資訊</p>
      </div>

      {/* 控制面板 */}
      <div className="text-controls">
        <div className="control-row">
          <button 
            className="btn btn-secondary"
            onClick={clearText}
            disabled={!text}
          >
            🗑️ 清空文本
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={copyStats}
            disabled={!text}
          >
            📋 複製統計
          </button>

          <label className="file-upload-btn">
            📁 讀取文件
            <input
              type="file"
              accept=".txt,.md,.csv,.json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="text-content">
        {/* 文本輸入區域 */}
        <div className="text-input-section">
          <h3>📝 文本輸入</h3>
          <textarea
            className="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="請在此輸入或貼上要統計的文本內容..."
            rows={15}
          />
        </div>

        {/* 統計結果區域 */}
        <div className="text-stats-section">
          <h3>📊 統計結果</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📏</div>
              <div className="stat-content">
                <div className="stat-label">行數</div>
                <div className="stat-value">{stats.lines.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <div className="stat-content">
                <div className="stat-label">段落數</div>
                <div className="stat-value">{stats.paragraphs.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <div className="stat-label">句子數</div>
                <div className="stat-value">{stats.sentences.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔤</div>
              <div className="stat-content">
                <div className="stat-label">單詞數</div>
                <div className="stat-value">{stats.words.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-label">字符數</div>
                <div className="stat-value">{stats.characters.toLocaleString()}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✂️</div>
              <div className="stat-content">
                <div className="stat-label">字符數（不含空格）</div>
                <div className="stat-value">{stats.charactersNoSpaces.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 詳細資訊 */}
          {text && (
            <div className="detailed-info">
              <h4>📋 詳細資訊</h4>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">平均每行字符數：</span>
                  <span className="info-value">
                    {stats.lines > 0 ? Math.round(stats.characters / stats.lines) : 0}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">平均每段落句子數：</span>
                  <span className="info-value">
                    {stats.paragraphs > 0 ? Math.round(stats.sentences / stats.paragraphs) : 0}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">平均每句子字符數：</span>
                  <span className="info-value">
                    {stats.sentences > 0 ? Math.round(stats.characters / stats.sentences) : 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 使用說明 */}
      <div className="text-footer">
        <h4>💡 使用說明</h4>
        <ul>
          <li>支援中文、英文等多種語言的文本統計</li>
          <li>可以直接輸入文本或上傳 .txt、.md、.csv、.json 文件</li>
          <li>統計結果會實時更新</li>
          <li>點擊「複製統計」可將結果複製到剪貼板</li>
          <li>段落以空行分隔，句子以標點符號分隔</li>
        </ul>
      </div>
    </div>
  )
}

export default TextProcessor