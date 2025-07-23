import { useState, useEffect } from 'react'
import './WeatherForecast.css'

interface WeatherData {
  id: string
  city: string
  country: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  rainProbability: number
  icon: string
  timestamp: string
}

interface ForecastData {
  date: string
  temperature: {
    min: number
    max: number
  }
  description: string
  rainProbability: number
  icon: string
}

interface HourlyForecastData {
  time: string
  temperature: number
  description: string
  rainProbability: number
  icon: string
}

// Geocoding API 函數
const getCoordinatesFromGeocoding = async (cityName: string, apiKey: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
    const response = await fetch(geocodingUrl)
    
    if (!response.ok) {
      throw new Error(`Geocoding API 請求失敗: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data || data.length === 0) {
      throw new Error(`找不到城市 "${cityName}" 的座標資料`)
    }
    
    return {
      lat: data[0].lat,
      lon: data[0].lon
    }
  } catch (error) {
    console.error('Geocoding API 錯誤:', error)
    return null
  }
}

const WeatherForecast = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [city, setCity] = useState('台北')
  const [customCity, setCustomCity] = useState('')
  const [searchMode, setSearchMode] = useState<'preset' | 'custom'>('preset')
  const [logs, setLogs] = useState<string[]>([])
  const [showLogs, setShowLogs] = useState(false)
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily')

  // 常用城市選項
  const cities = [
    { value: '台北', label: '台北市' },
    { value: '新北', label: '新北市' },
    { value: '桃園', label: '桃園市' },
    { value: '台中', label: '台中市' },
    { value: '台南', label: '台南市' },
    { value: '高雄', label: '高雄市' },
    { value: '基隆', label: '基隆市' },
    { value: '新竹', label: '新竹市' }
  ]

  // 添加日誌
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-TW')
    setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`])
  }

  // 清空日誌
  const clearLogs = () => {
    setLogs([])
  }

  // 城市座標映射（OpenWeatherMap 需要經緯度）
  const cityCoordinates: Record<string, { lat: number; lon: number }> = {
    '台北': { lat: 25.0330, lon: 121.5654 },
    '新北': { lat: 25.0173, lon: 121.4467 },
    '桃園': { lat: 24.9937, lon: 121.3009 },
    '台中': { lat: 24.1477, lon: 120.6736 },
    '台南': { lat: 22.9999, lon: 120.2269 },
    '高雄': { lat: 22.6273, lon: 120.3014 },
    '基隆': { lat: 25.1276, lon: 121.7392 },
    '新竹': { lat: 24.8138, lon: 120.9675 }
  }

  // 天氣圖標映射
  const getWeatherIcon = (iconCode: string): string => {
    const iconMap: Record<string, string> = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    }
    return iconMap[iconCode] || '🌤️'
  }

  // 獲取天氣數據
  const fetchWeather = async () => {
    setLoading(true)
    setError('')
    
    const searchCity = searchMode === 'custom' ? customCity : city
    addLog(`開始獲取 ${searchCity} 的天氣資料...`)
    
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
      
      addLog(`🔍 檢查 API Key 狀態: ${apiKey ? '已設定' : '未設定'}`)
      
      if (!apiKey || apiKey.trim() === '') {
        const errorMsg = '❌ 未設定 OpenWeatherMap API Key，無法獲取天氣資料'
        addLog(errorMsg)
        setError('請在 .env 文件中設定有效的 VITE_OPENWEATHER_API_KEY')
        return
      }

      // 統一使用 Geocoding API 獲取經緯度
      let coordinates: { lat: number; lon: number } | null = null
      let searchCityName = ''
      
      if (searchMode === 'preset') {
        // 預設城市先嘗試使用預設座標，如果沒有則使用 Geocoding API
        const presetCoordinates = cityCoordinates[city]
        if (presetCoordinates) {
          coordinates = presetCoordinates
          addLog(`📍 使用預設座標: ${coordinates.lat}, ${coordinates.lon}`)
        } else {
          addLog(`🔍 預設城市 ${city} 沒有座標，使用 Geocoding API 查詢...`)
          coordinates = await getCoordinatesFromGeocoding(city, apiKey)
          if (coordinates) {
            addLog(`✅ Geocoding API 成功獲取座標: ${coordinates.lat}, ${coordinates.lon}`)
          }
        }
        searchCityName = city
      } else {
        // 自定義城市使用 Geocoding API
        if (!customCity.trim()) {
          throw new Error('請輸入城市名稱')
        }
        addLog(`🔍 使用 Geocoding API 查詢城市: ${customCity}`)
        coordinates = await getCoordinatesFromGeocoding(customCity, apiKey)
        if (coordinates) {
          addLog(`✅ Geocoding API 成功獲取座標: ${coordinates.lat}, ${coordinates.lon}`)
        }
        searchCityName = customCity
      }

      if (!coordinates) {
        throw new Error(`無法獲取城市 "${searchCityName}" 的座標資料`)
      }

      // 使用座標調用免費的天氣 API
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric&lang=zh_tw`
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric&lang=zh_tw`
      
      addLog(`🌤️ 使用免費 API 獲取天氣資料: ${coordinates.lat}, ${coordinates.lon}`)

      // 獲取當前天氣
      
      // 獲取當前天氣
      addLog('🔄 正在獲取當前天氣...')
      const currentResponse = await fetch(currentWeatherUrl)
      
      if (!currentResponse.ok) {
        throw new Error(`API 請求失敗: ${currentResponse.status}`)
      }
      
      const currentData = await currentResponse.json()
      addLog(`✅ 成功獲取當前天氣資料`)

      // 獲取預報數據
      addLog('🔄 正在獲取預報資料...')
      const forecastResponse = await fetch(forecastUrl)
      
      if (!forecastResponse.ok) {
        throw new Error(`預報 API 請求失敗: ${forecastResponse.status}`)
      }
      
      const forecastData = await forecastResponse.json()
      addLog(`✅ 成功獲取預報資料`)

      // 處理當前天氣數據
      const currentWeather: WeatherData = {
        id: currentData.id.toString(),
        city: searchCityName,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s 轉 km/h
        rainProbability: currentData.rain ? Math.round((currentData.rain['1h'] || 0) * 10) : 0, // 估算降雨機率
        icon: getWeatherIcon(currentData.weather[0].icon),
        timestamp: new Date().toISOString()
      }

      // 處理五日預報數據
      const dailyForecasts: ForecastData[] = []
      const processedDates = new Set<string>()
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000)
        const dateStr = date.toLocaleDateString('zh-TW')
        
        // 跳過今天，只取未來5天，且每天只取一次
        if (date.getDate() !== new Date().getDate() && !processedDates.has(dateStr) && dailyForecasts.length < 5) {
          processedDates.add(dateStr)
          dailyForecasts.push({
            date: dateStr,
            temperature: {
              min: Math.round(item.main.temp_min),
              max: Math.round(item.main.temp_max)
            },
            description: item.weather[0].description,
            rainProbability: Math.round((item.pop || 0) * 100),
            icon: getWeatherIcon(item.weather[0].icon)
          })
        }
      }

      // 處理每3小時預報數據（未來24小時）
      const hourlyForecasts: HourlyForecastData[] = []
      const now = new Date()
      
      for (const item of forecastData.list.slice(0, 8)) { // 取前8個時段（24小時）
        const date = new Date(item.dt * 1000)
        
        // 只取未來的時間
        if (date > now) {
          hourlyForecasts.push({
            time: date.toLocaleTimeString('zh-TW', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            temperature: Math.round(item.main.temp),
            description: item.weather[0].description,
            rainProbability: Math.round((item.pop || 0) * 100),
            icon: getWeatherIcon(item.weather[0].icon)
          })
        }
      }

      setCurrentWeather(currentWeather)
      setForecast(dailyForecasts)
      setHourlyForecast(hourlyForecasts)
      addLog(`✅ 成功獲取 ${searchCityName} 的即時天氣資料（包含每3小時預報）`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤'
      addLog(`❌ API 獲取失敗: ${errorMessage}`)
      setError(`天氣資料獲取失敗: ${errorMessage}`)
      // 不再自動使用示例數據，直接顯示錯誤
    } finally {
      setLoading(false)
    }
  }


  // 格式化溫度
  const formatTemperature = (temp: number) => `${temp}°C`

  // 組件掛載時獲取默認城市天氣
  useEffect(() => {
    fetchWeather()
  }, [])

  return (
    <div className="weather-forecast">
      {/* 標題區域 */}
      <div className="tool-header">
        <h2>🌤️ 天氣預報</h2>
        <p>即時天氣資訊與未來五日預報</p>
      </div>

      {/* 控制面板 */}
      <div className="weather-controls">
        <div className="control-row">
          <div className="control-group">
            <label>搜尋模式：</label>
            <div className="search-mode-toggle">
              <button
                className={`mode-btn small ${searchMode === 'preset' ? 'active' : ''}`}
                onClick={() => setSearchMode('preset')}
              >
                📍 預設城市
              </button>
              <button
                className={`mode-btn small ${searchMode === 'custom' ? 'active' : ''}`}
                onClick={() => setSearchMode('custom')}
              >
                🔍 自定義搜尋
              </button>
            </div>
          </div>
        </div>
        
        <div className="control-row">
          {searchMode === 'preset' ? (
            <div className="control-group">
              <label htmlFor="city-select">選擇城市：</label>
              <select
                id="city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="control-select"
              >
                {cities.map(cityOption => (
                  <option key={cityOption.value} value={cityOption.value}>
                    {cityOption.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="control-group">
              <label htmlFor="custom-city">輸入城市名稱：</label>
              <input
                id="custom-city"
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="例如：Tokyo, London, New York"
                className="control-input"
                onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
              />
            </div>
          )}
          
          <div className="control-actions">
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="fetch-btn"
            >
              {loading ? '🔄 載入中...' : '🔄 更新天氣'}
            </button>
            
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="toggle-logs-btn"
            >
              {showLogs ? '隱藏日誌' : '顯示日誌'}
            </button>
          </div>
        </div>
        
        {/* 預報模式切換 */}
        <div className="control-row">
          <div className="view-mode-toggle">
            <button
              className={`mode-btn ${viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => setViewMode('daily')}
            >
              📅 五日預報
            </button>
            <button
              className={`mode-btn ${viewMode === 'hourly' ? 'active' : ''}`}
              onClick={() => setViewMode('hourly')}
            >
              ⏰ 每3小時預報
            </button>
          </div>
        </div>
      </div>

      {/* 錯誤提示 */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      {/* 日誌面板 */}
      {showLogs && (
        <div className="logs-panel">
          <div className="logs-header">
            <h3>📋 執行日誌</h3>
            <button onClick={clearLogs} className="clear-logs-btn">清空</button>
          </div>
          <div className="logs-content">
            {logs.length === 0 ? (
              <p className="no-logs">暫無日誌記錄</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="log-entry">{log}</div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 當前天氣 */}
      {currentWeather && (
        <div className="current-weather">
          <h3>📍 {currentWeather.city} 當前天氣</h3>
          <div className="weather-card current">
            <div className="weather-icon">{currentWeather.icon}</div>
            <div className="weather-info">
              <div className="temperature">{formatTemperature(currentWeather.temperature)}</div>
              <div className="description">{currentWeather.description}</div>
              <div className="details">
                <span>💧 濕度: {currentWeather.humidity}%</span>
                <span>💨 風速: {currentWeather.windSpeed} km/h</span>
                <span>🌧️ 降雨機率: {currentWeather.rainProbability}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 五日預報 */}
      {viewMode === 'daily' && forecast.length > 0 && (
        <div className="forecast-section">
          <h3>📅 未來五日預報</h3>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <div className="forecast-date">{day.date}</div>
                <div className="forecast-icon">{day.icon}</div>
                <div className="forecast-temp">
                  <span className="temp-max">{formatTemperature(day.temperature.max)}</span>
                  <span className="temp-min">{formatTemperature(day.temperature.min)}</span>
                </div>
                <div className="forecast-desc">{day.description}</div>
                <div className="forecast-rain">🌧️ {day.rainProbability}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 每小時預報 */}
      {viewMode === 'hourly' && hourlyForecast.length > 0 && (
        <div className="forecast-section">
          <h3>⏰ 未來24小時預報（每3小時）</h3>
          <div className="hourly-forecast-container">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="hourly-forecast-card">
                <div className="hourly-time">{hour.time}</div>
                <div className="hourly-icon">{hour.icon}</div>
                <div className="hourly-temp">{formatTemperature(hour.temperature)}</div>
                <div className="hourly-desc">{hour.description}</div>
                <div className="hourly-rain">🌧️ {hour.rainProbability}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 載入狀態 */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">🔄</div>
          <p>正在獲取天氣資料...</p>
        </div>
      )}

      {/* 頁腳資訊 */}
      <div className="weather-footer">
        <p>🔗 天氣資料來源：<a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a> (免費版)</p>
        <p>⏰ 最後更新：{currentWeather ? new Date(currentWeather.timestamp).toLocaleString('zh-TW') : '未更新'}</p>
        <p>💡 提示：需要設定 VITE_OPENWEATHER_API_KEY 環境變數才能獲取即時資料</p>
      </div>
    </div>
  )
}

export default WeatherForecast