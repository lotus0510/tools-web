import { useState, useEffect, useCallback } from 'react'
import './SnakeGame.css'

interface Position {
  x: number
  y: number
}

interface GameStats {
  score: number
  highScore: number
  gamesPlayed: number
  totalFood: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver'

const SnakeGame = () => {
  const BOARD_SIZE = 20
  const INITIAL_SNAKE = [{ x: 10, y: 10 }]
  const INITIAL_FOOD = { x: 15, y: 15 }
  const INITIAL_DIRECTION: Direction = 'RIGHT'

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
  const [speed, setSpeed] = useState<number>(150)
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    gamesPlayed: parseInt(localStorage.getItem('snakeGamesPlayed') || '0'),
    totalFood: parseInt(localStorage.getItem('snakeTotalFood') || '0')
  })

  // 生成隨機食物位置
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // 檢查碰撞
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // 撞牆
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true
    }
    // 撞自己
    return body.some(segment => segment.x === head.x && segment.y === head.y)
  }, [])

  // 移動蛇
  const moveSnake = useCallback(() => {
    if (gameStatus !== 'playing') return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }

      // 根據方向移動頭部
      switch (direction) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      // 檢查碰撞
      if (checkCollision(head, newSnake)) {
        setGameStatus('gameOver')
        const newGamesPlayed = stats.gamesPlayed + 1
        const newHighScore = Math.max(stats.score, stats.highScore)
        
        setStats(prev => ({
          ...prev,
          gamesPlayed: newGamesPlayed,
          highScore: newHighScore
        }))

        // 保存到本地存儲
        localStorage.setItem('snakeHighScore', newHighScore.toString())
        localStorage.setItem('snakeGamesPlayed', newGamesPlayed.toString())
        localStorage.setItem('snakeTotalFood', stats.totalFood.toString())
        
        return currentSnake
      }

      newSnake.unshift(head)

      // 檢查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        const newScore = stats.score + 10
        const newTotalFood = stats.totalFood + 1
        
        setStats(prev => ({
          ...prev,
          score: newScore,
          totalFood: newTotalFood
        }))
        
        setFood(generateFood(newSnake))
        
        // 增加速度
        if (newScore % 50 === 0 && speed > 80) {
          setSpeed(prev => prev - 10)
        }
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameStatus, stats, speed, checkCollision, generateFood])

  // 遊戲循環
  useEffect(() => {
    if (gameStatus === 'playing') {
      const gameInterval = setInterval(moveSnake, speed)
      return () => clearInterval(gameInterval)
    }
  }, [moveSnake, speed, gameStatus])

  // 鍵盤控制
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameStatus === 'gameOver' || gameStatus === 'idle') return

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault()
        if (direction !== 'DOWN') setDirection('UP')
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault()
        if (direction !== 'UP') setDirection('DOWN')
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault()
        if (direction !== 'RIGHT') setDirection('LEFT')
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault()
        if (direction !== 'LEFT') setDirection('RIGHT')
        break
      case ' ':
        e.preventDefault()
        togglePause()
        break
    }
  }, [direction, gameStatus])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // 開始遊戲
  const startGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(generateFood(INITIAL_SNAKE))
    setDirection(INITIAL_DIRECTION)
    setGameStatus('playing')
    setSpeed(150)
    setStats(prev => ({ ...prev, score: 0 }))
  }

  // 暫停/繼續
  const togglePause = () => {
    if (gameStatus === 'playing') {
      setGameStatus('paused')
    } else if (gameStatus === 'paused') {
      setGameStatus('playing')
    }
  }

  // 重置遊戲
  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setGameStatus('idle')
    setSpeed(150)
    setStats(prev => ({ ...prev, score: 0 }))
  }

  // 方向按鈕控制
  const handleDirectionClick = (newDirection: Direction) => {
    if (gameStatus === 'idle') {
      startGame()
      return
    }
    
    if (gameStatus !== 'playing') return

    switch (newDirection) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP')
        break
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN')
        break
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT')
        break
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT')
        break
    }
  }

  return (
    <div className="snake-game">
      <div className="tool-header">
        <h2>🐍 貪吃蛇遊戲</h2>
        <p>使用方向鍵或 WASD 控制蛇的移動，空格鍵暫停</p>
      </div>

      <div className="game-info">
        <div className="info-item">
          <span className="label">分數：</span>
          <span className="value">{stats.score}</span>
        </div>
        <div className="info-item">
          <span className="label">最高分：</span>
          <span className="value">{stats.highScore}</span>
        </div>
        <div className="info-item">
          <span className="label">長度：</span>
          <span className="value">{snake.length}</span>
        </div>
        <div className="info-item">
          <span className="label">速度：</span>
          <span className="value">{Math.round((200 - speed) / 10)}</span>
        </div>
      </div>

      <div className="game-controls">
        <button 
          className="control-btn start-btn"
          onClick={startGame}
          disabled={gameStatus === 'playing'}
        >
          🎮 {gameStatus === 'idle' ? '開始遊戲' : '重新開始'}
        </button>
        
        {gameStatus === 'playing' || gameStatus === 'paused' ? (
          <button 
            className="control-btn pause-btn"
            onClick={togglePause}
          >
            {gameStatus === 'playing' ? '⏸️ 暫停' : '▶️ 繼續'}
          </button>
        ) : null}
        
        <button 
          className="control-btn reset-btn"
          onClick={resetGame}
        >
          🔄 重置
        </button>
      </div>

      <div className="game-container">
        <div className="game-board">
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE
            const y = Math.floor(index / BOARD_SIZE)
            
            const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y
            const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y)
            const isFood = food.x === x && food.y === y
            
            let cellClass = 'game-cell'
            if (isSnakeHead) cellClass += ' snake-head'
            else if (isSnakeBody) cellClass += ' snake-body'
            else if (isFood) cellClass += ' food'
            
            return (
              <div key={index} className={cellClass}>
                {isSnakeHead && '🐍'}
                {isFood && '🍎'}
              </div>
            )
          })}
          
          {gameStatus === 'paused' && (
            <div className="game-overlay">
              <div className="overlay-message">
                <h3>⏸️ 遊戲暫停</h3>
                <p>按空格鍵繼續</p>
              </div>
            </div>
          )}
          
          {gameStatus === 'gameOver' && (
            <div className="game-overlay">
              <div className="overlay-message game-over">
                <h3>💀 遊戲結束</h3>
                <p>最終分數: {stats.score}</p>
                {stats.score === stats.highScore && stats.score > 0 && (
                  <p className="new-record">🎉 新紀錄！</p>
                )}
                <button className="restart-btn" onClick={startGame}>
                  🎮 再玩一次
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mobile-controls">
          <div className="direction-pad">
            <button 
              className="direction-btn up"
              onClick={() => handleDirectionClick('UP')}
              disabled={gameStatus === 'gameOver'}
            >
              ⬆️
            </button>
            <div className="direction-row">
              <button 
                className="direction-btn left"
                onClick={() => handleDirectionClick('LEFT')}
                disabled={gameStatus === 'gameOver'}
              >
                ⬅️
              </button>
              <button 
                className="direction-btn right"
                onClick={() => handleDirectionClick('RIGHT')}
                disabled={gameStatus === 'gameOver'}
              >
                ➡️
              </button>
            </div>
            <button 
              className="direction-btn down"
              onClick={() => handleDirectionClick('DOWN')}
              disabled={gameStatus === 'gameOver'}
            >
              ⬇️
            </button>
          </div>
        </div>
      </div>

      <div className="game-stats">
        <h3>遊戲統計：</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.gamesPlayed}</span>
            <span className="stat-label">總遊戲數</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.highScore}</span>
            <span className="stat-label">歷史最高分</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalFood}</span>
            <span className="stat-label">總食物數</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {stats.gamesPlayed > 0 ? Math.round(stats.totalFood / stats.gamesPlayed) : 0}
            </span>
            <span className="stat-label">平均食物數</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <h4>遊戲說明：</h4>
        <ul>
          <li>🎯 控制蛇吃食物來獲得分數</li>
          <li>⌨️ 使用方向鍵或 WASD 鍵控制方向</li>
          <li>📱 在手機上可以點擊方向按鈕</li>
          <li>⏸️ 按空格鍵暫停/繼續遊戲</li>
          <li>💀 撞牆或撞到自己就會遊戲結束</li>
          <li>🚀 每吃 5 個食物速度會增加</li>
        </ul>
      </div>
    </div>
  )
}

export default SnakeGame