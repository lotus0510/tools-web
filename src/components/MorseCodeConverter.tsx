import { useState } from 'react'
import './MorseCodeConverter.css'

// 摩斯電碼對照表
const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
}

// 反向對照表（摩斯電碼到文字）
const reverseMorseCodeMap: { [key: string]: string } = {}
Object.keys(morseCodeMap).forEach(key => {
  reverseMorseCodeMap[morseCodeMap[key]] = key
})

const MorseCodeConverter = () => {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'textToMorse' | 'morseToText'>('textToMorse')
  const [isPlaying, setIsPlaying] = useState(false)

  // 文字轉摩斯電碼
  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map(char => morseCodeMap[char] || char)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // 摩斯電碼轉文字
  const morseToText = (morse: string): string => {
    return morse
      .split(' ')
      .map(code => reverseMorseCodeMap[code] || code)
      .join('')
      .replace(/\//g, ' ')
  }

  // 處理輸入變化
  const handleInputChange = (value: string) => {
    setInputText(value)
    
    if (mode === 'textToMorse') {
      setOutputText(textToMorse(value))
    } else {
      setOutputText(morseToText(value))
    }
  }

  // 切換轉換模式
  const toggleMode = () => {
    const newMode = mode === 'textToMorse' ? 'morseToText' : 'textToMorse'
    setMode(newMode)
    
    // 交換輸入和輸出
    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
  }

  // 清空內容
  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  // 複製到剪貼板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // 這裡可以添加成功提示
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  // 播放摩斯電碼音頻（簡單實現）
  const playMorseCode = async () => {
    if (isPlaying) return
    
    setIsPlaying(true)
    const morseCode = mode === 'textToMorse' ? outputText : inputText
    
    // 創建音頻上下文
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const frequency = 600 // 音頻頻率
    const dotDuration = 100 // 點的持續時間（毫秒）
    const dashDuration = 300 // 劃的持續時間（毫秒）
    const pauseDuration = 100 // 間隔時間
    
    let currentTime = audioContext.currentTime
    
    for (const char of morseCode) {
      if (char === '.') {
        // 播放點
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, currentTime)
        gainNode.gain.setValueAtTime(0, currentTime + dotDuration / 1000)
        
        oscillator.start(currentTime)
        oscillator.stop(currentTime + dotDuration / 1000)
        
        currentTime += (dotDuration + pauseDuration) / 1000
      } else if (char === '-') {
        // 播放劃
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, currentTime)
        gainNode.gain.setValueAtTime(0, currentTime + dashDuration / 1000)
        
        oscillator.start(currentTime)
        oscillator.stop(currentTime + dashDuration / 1000)
        
        currentTime += (dashDuration + pauseDuration) / 1000
      } else if (char === ' ') {
        // 字母間隔
        currentTime += pauseDuration * 2 / 1000
      } else if (char === '/') {
        // 單詞間隔
        currentTime += pauseDuration * 4 / 1000
      }
    }
    
    // 播放完成後重置狀態
    setTimeout(() => {
      setIsPlaying(false)
    }, currentTime * 1000)
  }

  return (
    <div className="morse-code-converter">
      <div className="tool-header">
        <h2>📡 摩斯電碼轉換器</h2>
        <p>在文字和摩斯電碼之間進行轉換，支持音頻播放</p>
      </div>

      <div className="converter-controls">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'textToMorse' ? 'active' : ''}`}
            onClick={() => {
              if (mode !== 'textToMorse') toggleMode()
            }}
          >
            文字 → 摩斯電碼
          </button>
          <button 
            className="swap-btn"
            onClick={toggleMode}
            title="交換輸入輸出"
          >
            ⇄
          </button>
          <button 
            className={`mode-btn ${mode === 'morseToText' ? 'active' : ''}`}
            onClick={() => {
              if (mode !== 'morseToText') toggleMode()
            }}
          >
            摩斯電碼 → 文字
          </button>
        </div>

        <div className="action-buttons">
          <button className="clear-btn" onClick={clearAll}>
            🗑️ 清空
          </button>
          {outputText && (
            <button 
              className="play-btn" 
              onClick={playMorseCode}
              disabled={isPlaying}
            >
              {isPlaying ? '🔊 播放中...' : '🔊 播放摩斯電碼'}
            </button>
          )}
        </div>
      </div>

      <div className="converter-content">
        <div className="input-section">
          <div className="section-header">
            <h3>
              {mode === 'textToMorse' ? '輸入文字' : '輸入摩斯電碼'}
            </h3>
            <span className="char-count">
              {inputText.length} 字符
            </span>
          </div>
          <textarea
            className="input-textarea"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              mode === 'textToMorse' 
                ? '請輸入要轉換的文字...' 
                : '請輸入摩斯電碼（用空格分隔，/ 表示單詞間隔）...'
            }
            rows={8}
          />
        </div>

        <div className="output-section">
          <div className="section-header">
            <h3>
              {mode === 'textToMorse' ? '摩斯電碼輸出' : '文字輸出'}
            </h3>
            <button 
              className="copy-btn"
              onClick={() => copyToClipboard(outputText)}
              disabled={!outputText}
            >
              📋 複製
            </button>
          </div>
          <textarea
            className="output-textarea"
            value={outputText}
            readOnly
            placeholder="轉換結果將顯示在這裡..."
            rows={8}
          />
        </div>
      </div>

      <div className="morse-code-reference">
        <h3>摩斯電碼對照表</h3>
        <div className="reference-grid">
          {Object.entries(morseCodeMap)
            .filter(([key]) => key !== ' ')
            .slice(0, 26)
            .map(([letter, code]) => (
              <div key={letter} className="reference-item">
                <span className="letter">{letter}</span>
                <span className="code">{code}</span>
              </div>
            ))}
        </div>
        <div className="reference-numbers">
          <h4>數字</h4>
          <div className="reference-grid">
            {Object.entries(morseCodeMap)
              .filter(([key]) => /\d/.test(key))
              .map(([number, code]) => (
                <div key={number} className="reference-item">
                  <span className="letter">{number}</span>
                  <span className="code">{code}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="reference-note">
          <p><strong>說明：</strong></p>
          <ul>
            <li>點（.）：短音</li>
            <li>劃（-）：長音</li>
            <li>空格：字母間隔</li>
            <li>斜線（/）：單詞間隔</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MorseCodeConverter