import { useState, useEffect } from 'react'
import './MemoryCardGame.css'

interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

interface GameStats {
  moves: number
  matches: number
  timeElapsed: number
  gamesPlayed: number
  bestTime: number
  bestMoves: number
}

const MemoryCardGame = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won'>('idle')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [stats, setStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    timeElapsed: 0,
    gamesPlayed: 0,
    bestTime: 0,
    bestMoves: 0
  })
  const [startTime, setStartTime] = useState<number>(0)

  // 遊戲配置
  const gameConfig = {
    easy: { pairs: 6, symbols: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'] },
    medium: { pairs: 8, symbols: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'] },
    hard: { pairs: 12, symbols: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸'] }
  }

  // 洗牌算法
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // 初始化遊戲
  const initializeGame = () => {
    const config = gameConfig[difficulty]
    const symbols = config.symbols.slice(0, config.pairs)
    
    // 創建卡片對
    const cardPairs = symbols.flatMap((symbol, index) => [
      { id: index * 2, symbol, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
    ])

    // 洗牌
    const shuffledCards = shuffleArray(cardPairs)
    setCards(shuffledCards)
    setFlippedCards([])
    setStats(prev => ({ ...prev, moves: 0, matches: 0, timeElapsed: 0 }))
    setGameStatus('idle')
  }

  // 開始遊戲
  const startGame = () => {
    setGameStatus('playing')
    setStartTime(Date.now())
  }

  // 翻牌
  const flipCard = (cardId: number) => {
    if (gameStatus !== 'playing') {
      startGame()
    }

    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    if (cards.find(card => card.id === cardId)?.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // 更新卡片狀態
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ))

    // 檢查匹配
    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstId)
      const secondCard = cards.find(card => card.id === secondId)

      setStats(prev => ({ ...prev, moves: prev.moves + 1 }))

      setTimeout(() => {
        if (firstCard?.symbol === secondCard?.symbol) {
          // 匹配成功
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ))
          setStats(prev => ({ ...prev, matches: prev.matches + 1 }))
        } else {
          // 匹配失敗，翻回去
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ))
        }
        setFlippedCards([])
      }, 1000)
    }
  }

  // 檢查遊戲是否完成
  useEffect(() => {
    if (gameStatus === 'playing' && cards.length > 0) {
      const allMatched = cards.every(card => card.isMatched)
      if (allMatched) {
        const endTime = Date.now()
        const timeElapsed = Math.floor((endTime - startTime) / 1000)
        
        setGameStatus('won')
        setStats(prev => ({
          ...prev,
          timeElapsed,
          gamesPlayed: prev.gamesPlayed + 1,
          bestTime: prev.bestTime === 0 ? timeElapsed : Math.min(prev.bestTime, timeElapsed),
          bestMoves: prev.bestMoves === 0 ? prev.moves : Math.min(prev.bestMoves, prev.moves)
        }))
      }
    }
  }, [cards, gameStatus, startTime])

  // 計算當前時間
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          timeElapsed: Math.floor((Date.now() - startTime) / 1000)
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStatus, startTime])

  // 重置遊戲
  const resetGame = () => {
    initializeGame()
  }

  // 改變難度
  const changeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty)
  }

  // 初始化
  useEffect(() => {
    initializeGame()
  }, [difficulty])

  // 格式化時間
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="memory-card-game">
      <div className="tool-header">
        <h2>🧠 記憶卡片遊戲</h2>
        <p>翻開卡片找到相同的圖案配對</p>
      </div>

      <div className="game-controls">
        <div className="difficulty-selector">
          <h3>選擇難度：</h3>
          <div className="difficulty-buttons">
            <button
              className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => changeDifficulty('easy')}
              disabled={gameStatus === 'playing'}
            >
              🟢 簡單 (6對)
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => changeDifficulty('medium')}
              disabled={gameStatus === 'playing'}
            >
              🟡 中等 (8對)
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => changeDifficulty('hard')}
              disabled={gameStatus === 'playing'}
            >
              🔴 困難 (12對)
            </button>
          </div>
        </div>

        <div className="game-actions">
          <button className="reset-btn" onClick={resetGame}>
            🔄 重新開始
          </button>
        </div>
      </div>

      <div className="game-info">
        <div className="info-item">
          <span className="label">移動次數：</span>
          <span className="value">{stats.moves}</span>
        </div>
        <div className="info-item">
          <span className="label">已配對：</span>
          <span className="value">{stats.matches} / {gameConfig[difficulty].pairs}</span>
        </div>
        <div className="info-item">
          <span className="label">時間：</span>
          <span className="value">{formatTime(stats.timeElapsed)}</span>
        </div>
        <div className="info-item">
          <span className="label">狀態：</span>
          <span className="value">
            {gameStatus === 'idle' && '點擊卡片開始'}
            {gameStatus === 'playing' && '遊戲中...'}
            {gameStatus === 'won' && '🎉 完成！'}
          </span>
        </div>
      </div>

      <div className={`card-grid ${difficulty}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => flipCard(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <span className="card-symbol">{card.symbol}</span>
              </div>
              <div className="card-back">
                <span className="card-pattern">❓</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gameStatus === 'won' && (
        <div className="victory-message">
          <h3>🎉 恭喜完成！</h3>
          <p>用時：{formatTime(stats.timeElapsed)} | 移動次數：{stats.moves}</p>
          <button className="play-again-btn" onClick={resetGame}>
            🎮 再玩一次
          </button>
        </div>
      )}

      <div className="game-stats">
        <h3>遊戲統計：</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.gamesPlayed}</span>
            <span className="stat-label">總遊戲數</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {stats.bestTime > 0 ? formatTime(stats.bestTime) : '-'}
            </span>
            <span className="stat-label">最佳時間</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.bestMoves || '-'}</span>
            <span className="stat-label">最少移動</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">完成率</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryCardGame