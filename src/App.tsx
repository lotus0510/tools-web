import { useState } from 'react'
import './App.css'
import { useIsMobile } from './hooks/useIsMobile'
import Base64Tool from './components/Base64Tool'
import IdentityGenerator from './components/IdentityGenerator'
import MorseCodeConverter from './components/MorseCodeConverter'
import NumberGuessingGame from './components/NumberGuessingGame'
import MemoryCardGame from './components/MemoryCardGame'
import SnakeGame from './components/SnakeGame'
import AIChatWindow from './components/AIChatWindow'
import NewsReader from './components/NewsReader'
import WeatherForecast from './components/WeatherForecast'
import TextProcessor from './components/TextProcessor'
import HttpTester from './components/HttpTester'

// 工具類型定義
interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: string
}

// 模擬工具數據
const tools: Tool[] = [
  { id: 'base64-encoder', name: 'Base64 編碼', description: 'Base64 編碼和解碼', icon: '🔐', category: '編碼工具' },
  { id: 'text-processor', name: '文本處理工具', description: '統計文本的行數、字數、字元數等資訊', icon: '📝', category: '編碼工具' },
  { id: 'morse-code-converter', name: '摩斯電碼轉換器', description: '文字與摩斯電碼互相轉換，支持音頻播放', icon: '📡', category: '編碼工具' },
  { id: 'http-tester', name: 'HTTP/API 測試工具', description: '簡易的 GET/POST 請求發送器，觀察響應', icon: '🌐', category: '開發工具' },
  { id: 'identity-generator', name: '隨機身份生成', description: '生成虛假身份信息用於測試', icon: '🎭', category: '生成器' },
  { id: 'number-guessing-game', name: '猜數字遊戲', description: '經典的猜數字遊戲，支持多種難度', icon: '🎯', category: '遊戲' },
  { id: 'memory-card-game', name: '記憶卡片遊戲', description: '翻牌配對記憶遊戲，訓練你的記憶力', icon: '🧠', category: '遊戲' },
  { id: 'snake-game', name: '貪吃蛇遊戲', description: '經典的貪吃蛇遊戲，支持鍵盤和觸控操作', icon: '🐍', category: '遊戲' },
  { id: 'ai-chat-window', name: 'AI 聊天助手', description: '與多種 AI 模型進行智能對話', icon: '🤖', category: 'AI 工具' },
  { id: 'news-reader', name: '熱門新聞查詢', description: '瀏覽最新熱門新聞，掌握時事動態', icon: '📰', category: '資訊工具' },
  { id: 'weather-forecast', name: '天氣預報', description: '即時天氣資訊與未來五日預報', icon: '🌤️', category: '資訊工具' },
]

function App() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const isMobile = useIsMobile(768)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile) // 手機端默認關閉側邊欄

  // 獲取工具分類
  const categories = Array.from(new Set(tools.map(tool => tool.category)))

  // 處理工具選擇（手機端自動關閉側邊欄）
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    if (isMobile) {
      console.log('手機端選擇工具，自動關閉側邊欄')
      setSidebarOpen(false)
    }
  }

  const renderToolContent = () => {
    if (!selectedTool) {
      return (
        <div className="welcome-content">
          <h2>歡迎使用實用工具集</h2>
          <p>選擇左側的工具開始使用</p>
          <div className="tool-grid">
            {tools.map(tool => (
              <div 
                key={tool.id} 
                className="tool-card"
                onClick={() => handleToolSelect(tool.id)}
              >
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    const tool = tools.find(t => t.id === selectedTool)
    
    // 根據選中的工具渲染對應的組件
    const renderSelectedTool = () => {
      switch (selectedTool) {
        case 'base64-encoder':
          return <Base64Tool />
        case 'text-processor':
          return <TextProcessor />
        case 'morse-code-converter':
          return <MorseCodeConverter />
        case 'http-tester':
          return <HttpTester />
        case 'identity-generator':
          return <IdentityGenerator />
        case 'number-guessing-game':
          return <NumberGuessingGame />
        case 'memory-card-game':
          return <MemoryCardGame />
        case 'snake-game':
          return <SnakeGame />
        case 'ai-chat-window':
          return <AIChatWindow />
        case 'news-reader':
          return <NewsReader />
        case 'weather-forecast':
          return <WeatherForecast />
        default:
          return (
            <div className="tool-content">
              <h2>{tool?.icon} {tool?.name}</h2>
              <p>{tool?.description}</p>
              <div className="tool-placeholder">
                <p>工具功能將在這裡實現</p>
                <p>工具 ID: {selectedTool}</p>
              </div>
            </div>
          )
      }
    }
    
    return renderSelectedTool()
  }

  return (
    <div className="app">
      {/* 頂部導航欄 */}
      <header className="header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => {
              console.log('切換側邊欄，當前狀態:', sidebarOpen)
              setSidebarOpen(!sidebarOpen)
            }}
          >
            ☰
          </button>
          <h1>實用工具集</h1>
        </div>
        <div className="header-right">
          {selectedTool && (
            <button 
              className="home-btn"
              onClick={() => {
                setSelectedTool(null)
                if (isMobile) {
                  console.log('手機端點擊首頁，自動關閉側邊欄')
                  setSidebarOpen(false)
                }
              }}
              title="回到首頁"
            >
              🏠 首頁
            </button>
          )}
          <button className="theme-toggle">🌙</button>
        </div>
      </header>

      <div className="main-container">
        {/* 手機端遮罩層，點擊關閉側邊欄 */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('遮罩層被點擊，關閉側邊欄')
              setSidebarOpen(false)
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('遮罩層觸控結束，關閉側邊欄')
              setSidebarOpen(false)
            }}
          />
        )}
        
        {/* 側邊欄 */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            {categories.map(category => (
              <div key={category} className="category-section">
                <h3 className="category-title">{category}</h3>
                <ul className="tool-list">
                  {tools
                    .filter(tool => tool.category === category)
                    .map(tool => (
                      <li 
                        key={tool.id}
                        className={`tool-item ${selectedTool === tool.id ? 'active' : ''}`}
                        onClick={() => handleToolSelect(tool.id)}
                      >
                        <span className="tool-icon">{tool.icon}</span>
                        <span className="tool-name">{tool.name}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* 主要內容區域 */}
        <main className="main-content">
          {renderToolContent()}
        </main>
      </div>
    </div>
  )
}

export default App
