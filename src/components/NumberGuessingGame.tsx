import { useState, useEffect } from 'react'
import './NumberGuessingGame.css'

interface GameStats {
  gamesPlayed: number
  gamesWon: number
  bestScore: number
  totalGuesses: number
}

const NumberGuessingGame = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [guess, setGuess] = useState<string>('')
  const [attempts, setAttempts] = useState<number>(0)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [feedback, setFeedback] = useState<string>('')
  const [guessHistory, setGuessHistory] = useState<Array<{guess: number, feedback: string}>>([])
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [maxAttempts, setMaxAttempts] = useState<number>(10)
  const [range, setRange] = useState<{min: number, max: number}>({min: 1, max: 100})
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    totalGuesses: 0
  })

  // 難度設置
  const difficultySettings = {
    easy: { min: 1, max: 50, attempts: 15 },
    medium: { min: 1, max: 100, attempts: 10 },
    hard: { min: 1, max: 200, attempts: 8 }
  }

  // 初始化遊戲
  const initGame = () => {
    const settings = difficultySettings[difficulty]
    const newTarget = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min
    setTargetNumber(newTarget)
    setRange({min: settings.min, max: settings.max})
    setMaxAttempts(settings.attempts)
    setAttempts(0)
    setGameStatus('playing')
    setFeedback('')
    setGuess('')
    setGuessHistory([])
  }

  // 開始新遊戲
  const startNewGame = () => {
    initGame()
  }

  // 處理猜測
  const handleGuess = () => {
    const guessNumber = parseInt(guess)
    
    if (isNaN(guessNumber)) {
      setFeedback('請輸入有效的數字！')
      return
    }

    if (guessNumber < range.min || guessNumber > range.max) {
      setFeedback(`請輸入 ${range.min} 到 ${range.max} 之間的數字！`)
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    let newFeedback = ''
    if (guessNumber === targetNumber) {
      newFeedback = '🎉 恭喜！猜對了！'
      setGameStatus('won')
      setStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        bestScore: prev.bestScore === 0 ? newAttempts : Math.min(prev.bestScore, newAttempts),
        totalGuesses: prev.totalGuesses + newAttempts
      }))
    } else if (newAttempts >= maxAttempts) {
      newFeedback = `😞 遊戲結束！正確答案是 ${targetNumber}`
      setGameStatus('lost')
      setStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        totalGuesses: prev.totalGuesses + newAttempts
      }))
    } else {
      if (guessNumber < targetNumber) {
        newFeedback = '📈 太小了！試試更大的數字'
      } else {
        newFeedback = '📉 太大了！試試更小的數字'
      }
    }

    setFeedback(newFeedback)
    setGuessHistory(prev => [...prev, {guess: guessNumber, feedback: newFeedback}])
    setGuess('')
  }

  // 處理難度變更
  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty)
  }

  // 鍵盤事件處理
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameStatus === 'playing') {
      handleGuess()
    }
  }

  // 初始化遊戲
  useEffect(() => {
    initGame()
  }, [difficulty])

  // 獲取提示
  const getHint = () => {
    if (attempts === 0) return ''
    
    const lastGuess = guessHistory[guessHistory.length - 1]?.guess
    if (!lastGuess) return ''

    const difference = Math.abs(targetNumber - lastGuess)
    const rangeSize = range.max - range.min

    if (difference <= rangeSize * 0.05) {
      return '🔥 非常接近了！'
    } else if (difference <= rangeSize * 0.1) {
      return '🌡️ 很接近了！'
    } else if (difference <= rangeSize * 0.2) {
      return '👍 接近了！'
    } else {
      return '❄️ 還很遠...'
    }
  }

  return (
    <div className="number-guessing-game">
      <div className="tool-header">
        <h2>🎯 猜數字遊戲</h2>
        <p>我想了一個數字，你能猜出來嗎？</p>
      </div>

      <div className="game-controls">
        <div className="difficulty-selector">
          <h3>選擇難度：</h3>
          <div className="difficulty-buttons">
            {Object.keys(difficultySettings).map((level) => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(level as 'easy' | 'medium' | 'hard')}
                disabled={gameStatus === 'playing' && attempts > 0}
              >
                {level === 'easy' && '🟢 簡單 (1-50, 15次)'}
                {level === 'medium' && '🟡 中等 (1-100, 10次)'}
                {level === 'hard' && '🔴 困難 (1-200, 8次)'}
              </button>
            ))}
          </div>
        </div>

        <button className="new-game-btn" onClick={startNewGame}>
          🎮 開始新遊戲
        </button>
      </div>

      <div className="game-area">
        <div className="game-info">
          <div className="info-item">
            <span className="label">範圍：</span>
            <span className="value">{range.min} - {range.max}</span>
          </div>
          <div className="info-item">
            <span className="label">剩餘次數：</span>
            <span className="value">{maxAttempts - attempts}</span>
          </div>
          <div className="info-item">
            <span className="label">已猜次數：</span>
            <span className="value">{attempts}</span>
          </div>
        </div>

        {gameStatus === 'playing' && (
          <div className="guess-input">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`輸入 ${range.min} - ${range.max} 之間的數字`}
              min={range.min}
              max={range.max}
              disabled={gameStatus !== 'playing'}
            />
            <button 
              onClick={handleGuess}
              disabled={!guess || gameStatus !== 'playing'}
              className="guess-btn"
            >
              猜測
            </button>
          </div>
        )}

        <div className="feedback">
          {feedback && (
            <div className={`feedback-message ${gameStatus}`}>
              {feedback}
            </div>
          )}
          {gameStatus === 'playing' && getHint() && (
            <div className="hint">
              {getHint()}
            </div>
          )}
        </div>

        {guessHistory.length > 0 && (
          <div className="guess-history">
            <h3>猜測歷史：</h3>
            <div className="history-list">
              {guessHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <span className="guess-number">#{index + 1}: {item.guess}</span>
                  <span className="guess-feedback">{item.feedback}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="game-stats">
        <h3>遊戲統計：</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.gamesPlayed}</span>
            <span className="stat-label">總遊戲數</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.gamesWon}</span>
            <span className="stat-label">獲勝次數</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
            </span>
            <span className="stat-label">勝率</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.bestScore || '-'}</span>
            <span className="stat-label">最佳成績</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {stats.gamesWon > 0 ? Math.round(stats.totalGuesses / stats.gamesWon) : '-'}
            </span>
            <span className="stat-label">平均猜測次數</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberGuessingGame