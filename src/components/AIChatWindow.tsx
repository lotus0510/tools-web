import { useState, useRef, useEffect } from 'react'
import './AIChatWindow.css'

// 改進的 Markdown 解析器
const parseMarkdown = (text: string): string => {
  let result = text
  
  // 代碼塊（需要先處理，避免被其他規則影響）
  result = result.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  
  // 行內代碼
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // 標題（從大到小處理）
  result = result.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  result = result.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  result = result.replace(/^# (.*$)/gm, '<h1>$1</h1>')
  
  // 粗體
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 斜體（避免與粗體衝突）
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
  
  // 無序列表
  result = result.replace(/^[\-\*\+] (.+$)/gm, '<li>$1</li>')
  
  // 有序列表
  result = result.replace(/^\d+\. (.+$)/gm, '<li class="ordered">$1</li>')
  
  // 包裝列表項目
  result = result.replace(/(<li(?:\s+class="ordered")?>[^<]*<\/li>\s*)+/g, (match) => {
    if (match.includes('class="ordered"')) {
      return `<ol>${match.replace(/\s+class="ordered"/g, '')}</ol>`
    } else {
      return `<ul>${match}</ul>`
    }
  })
  
  // 鏈接
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // 分隔線
  result = result.replace(/^---+$/gm, '<hr>')
  
  // 引用
  result = result.replace(/^> (.+$)/gm, '<blockquote>$1</blockquote>')
  
  // 段落處理（雙換行變成段落）
  result = result.replace(/\n\n/g, '</p><p>')
  result = `<p>${result}</p>`
  
  // 單換行變成 <br>
  result = result.replace(/(?<!>)\n(?!<)/g, '<br>')
  
  // 清理空段落
  result = result.replace(/<p><\/p>/g, '')
  result = result.replace(/<p>\s*<\/p>/g, '')
  
  return result
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

interface ChatSettings {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
}

const AIChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>({
    apiKey: localStorage.getItem('openrouter_api_key') || import.meta.env.VITE_AI_API_KEY || '',
    model: 'deepseek/deepseek-chat-v3-0324:free',
    temperature: 0.7,
    maxTokens: 2000
  })
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [showLogs, setShowLogs] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 可用的模型列表（使用 OpenRouter 實際支援的模型 ID）
  const availableModels = [
    // 🆓 免費模型（推薦使用）
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: '🥇 DeepSeek V3 0324 (免費推薦)', provider: 'DeepSeek', isFree: true },
    { id: 'deepseek/deepseek-r1:free', name: '🥈 DeepSeek R1 (免費)', provider: 'DeepSeek', isFree: true },
    { id: 'moonshotai/kimi-k2:free', name: '🥉 MoonshotAI Kimi K2 (免費)', provider: 'MoonshotAI', isFree: true },
    
    // 💰 付費模型（需要自己的 API Key 和餘額）
    { id: 'anthropic/claude-4-sonnet', name: '🏆 Claude Sonnet 4 (付費 - 需要自己的 API Key)', provider: 'Anthropic', isFree: false },
    { id: 'google/gemini-2.0-flash-001', name: '⚡ Gemini 2.0 Flash (付費 - 需要自己的 API Key)', provider: 'Google', isFree: false },
    { id: 'nous/hermes-3-405b-instruct', name: '🧠 Nous Hermes 3 405B (付費 - 需要自己的 API Key)', provider: 'Nous Research', isFree: false }
  ]

  // 滾動到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 保存設置到本地存儲
  const saveSettings = () => {
    localStorage.setItem('openrouter_api_key', settings.apiKey)
    localStorage.setItem('openrouter_model', settings.model)
    localStorage.setItem('openrouter_temperature', settings.temperature.toString())
    localStorage.setItem('openrouter_max_tokens', settings.maxTokens.toString())
    setShowSettings(false)
    setError('')
  }

  // 加載設置
  useEffect(() => {
    const savedModel = localStorage.getItem('openrouter_model')
    const savedTemperature = localStorage.getItem('openrouter_temperature')
    const savedMaxTokens = localStorage.getItem('openrouter_max_tokens')
    
    setSettings(prev => ({
      ...prev,
      model: savedModel || 'deepseek/deepseek-chat-v3-0324:free',
      temperature: savedTemperature ? parseFloat(savedTemperature) : prev.temperature,
      maxTokens: savedMaxTokens ? parseInt(savedMaxTokens) : prev.maxTokens
    }))
    
    // 自動保存環境變數中的 API Key
    const envApiKey = import.meta.env.VITE_AI_API_KEY
    if (!localStorage.getItem('openrouter_api_key') && envApiKey) {
      localStorage.setItem('openrouter_api_key', envApiKey)
    }
  }, [])

  // 獲取系統信息
  const getSystemInfo = () => {
    const now = new Date()
    const timeZone = 'Asia/Taipei'
    
    return {
      currentTime: now.toLocaleString('zh-TW', { 
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
      }),
      timeZone,
      language: 'zh-TW',
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`
    }
  }

  // 構建系統提示
  const buildSystemPrompt = () => {
    const systemInfo = getSystemInfo()
    
    return `你是一個友善、專業的 AI 助手，正在「實用工具集」應用中為用戶提供服務。

## 🚨 重要：語言設定（必須遵守）
- 你必須只使用繁體中文（Traditional Chinese, zh-TW）回答所有問題
- 絕對不要使用英文回答，除非用戶特別要求
- 不要使用簡體中文
- 使用台灣常用的詞彙和表達方式
- 即使用戶用英文提問，你也要用繁體中文回答

## 基本設定
- 保持友善、專業且有幫助的語調
- 優先使用 Markdown 格式來讓回答更清晰易讀
- 當提供程式碼時，請包含繁體中文註釋說明
- 回答要詳細且實用
- 如果用戶的問題不完整，請用繁體中文詢問更多細節

## 當前系統資訊
- 當前時間：${systemInfo.currentTime}
- 時區：${systemInfo.timeZone}
- 用戶語言設定：${systemInfo.language}
- 作業系統平台：${systemInfo.platform}
- 螢幕解析度：${systemInfo.screenResolution}

## 應用背景
用戶正在使用「實用工具集」，這是一個包含多種實用工具的網頁應用，包括：

### 🛠️ 編碼工具
- **Base64 編碼解碼器**：可以將文字轉換為 Base64 格式，或將 Base64 解碼回原文
- **摩斯電碼轉換器**：支援文字與摩斯電碼互相轉換，還能播放摩斯電碼音效

### 🎭 生成器工具
- **隨機身份生成器**：可以生成虛假的身份資訊，用於測試或開發用途

### 🎮 遊戲娛樂
- **猜數字遊戲**：經典的數字猜測遊戲，有簡單、中等、困難三種難度
- **記憶卡片遊戲**：翻牌配對的記憶力訓練遊戲，可以鍛鍊大腦
- **貪吃蛇遊戲**：經典的貪吃蛇遊戲，支援鍵盤和觸控操作

### 🤖 AI 工具
- **AI 聊天助手**：就是你現在使用的功能，可以與多種 AI 模型對話

請根據用戶的需求提供幫助。記住，無論什麼情況都要用繁體中文回答！`
  }

  // 發送消息到 OpenRouter
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    
    // 先檢查是否選擇了付費模型（在檢查 API Key 之前）
    const selectedModel = availableModels.find(model => model.id === settings.model)
    if (selectedModel && !selectedModel.isFree) {
      const confirmMessage = `您選擇的是付費模型「${selectedModel.name}」。\n\n⚠️ 注意：\n• 付費模型需要您自己的 OpenRouter API Key\n• 需要您的帳戶有足夠餘額\n• 使用會產生費用\n\n建議使用免費模型進行測試。\n\n確定要繼續使用付費模型嗎？`
      
      if (!confirm(confirmMessage)) {
        addLog('User cancelled paid model usage')
        return
      }
      addLog(`User confirmed usage of paid model: ${selectedModel.name}`)
    }

    // 然後檢查 API Key
    if (!settings.apiKey) {
      if (selectedModel && !selectedModel.isFree) {
        setError('付費模型需要配置 OpenRouter API Key。請在設置中添加您的 API Key，或選擇免費模型。')
      } else {
        setError('請先在設置中配置 OpenRouter API Key')
      }
      setShowSettings(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInputMessage('')
    setIsLoading(true)
    setError('')

    addLog(`Sending message: "${inputMessage.trim().substring(0, 50)}${inputMessage.trim().length > 50 ? '...' : ''}"`)
    addLog(`Using model: ${settings.model}`)

    try {
      // 構建消息數組，包含系統提示
      const messagesForAPI = [
        {
          role: 'system' as const,
          content: buildSystemPrompt()
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: inputMessage.trim()
        }
      ]

      addLog(`API request contains ${messagesForAPI.length} messages`)
      addLog(`System prompt length: ${buildSystemPrompt().length} characters`)

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Tool',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          model: settings.model,
          messages: messagesForAPI,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          stream: false
        })
      })

      addLog(`API response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorData = await response.json()
        addLog(`API error: ${JSON.stringify(errorData)}`)
        throw new Error(errorData.error?.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      addLog(`API response successful, tokens used: ${data.usage?.total_tokens || 'unknown'}`)
      
      const responseContent = data.choices[0]?.message?.content || ''
      addLog(`Response content length: ${responseContent.length} characters`)
      
      if (!responseContent || responseContent.trim() === '') {
        addLog('⚠️ Warning: AI response is empty')
        addLog(`Full API response: ${JSON.stringify(data, null, 2)}`)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: responseContent || '抱歉，我無法生成回應。請檢查日誌了解詳情。',
        timestamp: new Date()
      }

      setMessages(prev => prev.slice(0, -1).concat(assistantMessage))
      addLog('Message processing completed')
    } catch (error) {
      console.error('API Error:', error)
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Failed to send message'}`)
      setError(error instanceof Error ? error.message : '發送消息失敗')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  // 處理鍵盤事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // 添加日誌
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-TW')
    setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`])
  }

  // 清空聊天記錄
  const clearChat = () => {
    setMessages([])
    setError('')
    addLog('Chat history cleared')
  }

  // 清空日誌
  const clearLogs = () => {
    setLogs([])
  }

  // 格式化時間
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="ai-chat-window">
      <div className="tool-header">
        <h2>🤖 AI 聊天助手</h2>
        <p>與 AI 進行智能對話，支持多種模型</p>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-info">
            <div className="model-selector-inline">
              <label>模型：</label>
              <select
                value={settings.model}
                onChange={(e) => {
                  const newSettings = { ...settings, model: e.target.value }
                  setSettings(newSettings)
                  localStorage.setItem('openrouter_model', e.target.value)
                }}
                className="model-select-inline"
              >
                <optgroup label="🆓 免費模型（推薦）">
                  {availableModels.filter(model => model.isFree).map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="💰 付費模型（需要自己的 API Key）">
                  {availableModels.filter(model => !model.isFree).map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <span className="message-count">{messages.length} 條消息</span>
          </div>
          <div className="chat-actions">
            <button 
              className={`action-btn logs-btn ${showLogs ? 'active' : ''}`}
              onClick={() => setShowLogs(!showLogs)}
              title={showLogs ? "隱藏日誌" : "顯示日誌"}
            >
              📋
            </button>
            <button 
              className="action-btn settings-btn"
              onClick={() => setShowSettings(true)}
              title="設置"
            >
              ⚙️
            </button>
            <button 
              className="action-btn clear-btn"
              onClick={clearChat}
              disabled={messages.length === 0}
              title="清空聊天"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">🤖</div>
              <h3>歡迎使用 AI 聊天助手</h3>
              <p>開始與 AI 對話吧！我可以幫助你：</p>
              <ul>
                <li>📚 回答問題和提供資訊</li>
                <li>✍️ 協助寫作和創作</li>
                <li>🔍 解決問題和分析</li>
                <li>🎓 學習和教育支援</li>
                <li>💻 程式設計協助</li>
                <li>🛠️ 介紹本應用的各種工具</li>
              </ul>
              <div className="example-prompts">
                <p><strong>試試這些問題：</strong></p>
                <div className="prompt-examples">
                  <button 
                    className="example-prompt"
                    onClick={() => setInputMessage('你好！請介紹一下你自己和這個實用工具集應用')}
                  >
                    👋 介紹你自己
                  </button>
                  <button 
                    className="example-prompt"
                    onClick={() => setInputMessage('幫我寫一個 JavaScript 函數來計算兩個數字的最大公約數')}
                  >
                    💻 程式設計幫助
                  </button>
                  <button 
                    className="example-prompt"
                    onClick={() => setInputMessage('這個實用工具集有哪些功能？')}
                  >
                    🛠️ 應用功能介紹
                  </button>
                </div>
              </div>
              {!settings.apiKey && (
                <div className="setup-notice">
                  <p>⚠️ 請先點擊設置按鈕配置 API Key</p>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.isLoading ? (
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : message.role === 'assistant' ? (
                      <div 
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ 
                          __html: parseMarkdown(message.content) 
                        }}
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button 
              className="error-close"
              onClick={() => setError('')}
            >
              ✕
            </button>
          </div>
        )}

        {showLogs && (
          <div className="logs-container">
            <div className="logs-header">
              <h4>調試日誌</h4>
              <div className="logs-actions">
                <button 
                  className="logs-clear-btn"
                  onClick={clearLogs}
                  disabled={logs.length === 0}
                >
                  清空日誌
                </button>
                <button 
                  className="logs-close-btn"
                  onClick={() => setShowLogs(false)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="logs-content">
              {logs.length === 0 ? (
                <div className="logs-empty">暫無日誌記錄</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="log-item">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入你的消息... (Enter 發送，Shift+Enter 換行)"
            className="message-input"
            rows={1}
            disabled={isLoading}
          />
          <button 
            className="send-button"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </div>

      {/* 設置彈窗 */}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-modal">
            <div className="settings-header">
              <h3>AI 聊天設置</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="settings-content">
              <div className="setting-group">
                <label>OpenRouter API Key *</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="sk-or-v1-..."
                  className="setting-input"
                />
                <small>
                  在 <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
                    OpenRouter
                  </a> 獲取你的 API Key
                </small>
              </div>

              <div className="setting-group">
                <label>AI 模型</label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                  className="setting-select"
                >
                  <optgroup label="🆓 免費模型（推薦使用）">
                    {availableModels.filter(model => model.isFree).map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="💰 付費模型（需要自己的 API Key 和餘額）">
                    {availableModels.filter(model => !model.isFree).map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="setting-group">
                <label>創造性 (Temperature): {settings.temperature}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="setting-range"
                />
                <small>0 = 更準確，1 = 更創造性</small>
              </div>

              <div className="setting-group">
                <label>最大回應長度</label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={settings.maxTokens}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  className="setting-input"
                />
                <small>建議 1000-2000 tokens</small>
              </div>
            </div>

            <div className="settings-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowSettings(false)}
              >
                取消
              </button>
              <button 
                className="save-btn"
                onClick={saveSettings}
                disabled={!settings.apiKey}
              >
                保存設置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIChatWindow