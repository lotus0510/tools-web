import { useState, useEffect } from 'react'
import './NewsReader.css'

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  source: {
    name: string
  }
  author?: string
}

interface NewsResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

const NewsReader = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('general')
  const [country, setCountry] = useState('tw')
  const [searchQuery, setSearchQuery] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [showLogs, setShowLogs] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState('')
  const [uiTheme, setUITheme] = useState('modern')
  const [viewMode, setViewMode] = useState('grid')

  // 新聞分類選項
  const categories = [
    { value: 'general', label: '綜合新聞' },
    { value: 'business', label: '商業財經' },
    { value: 'technology', label: '科技' },
    { value: 'sports', label: '體育' },
    { value: 'entertainment', label: '娛樂' },
    { value: 'health', label: '健康' },
    { value: 'science', label: '科學' }
  ]

  // 國家/地區選項
  const countries = [
    { value: 'tw', label: '台灣' },
    { value: 'us', label: '美國' },
    { value: 'gb', label: '英國' },
    { value: 'jp', label: '日本' },
    { value: 'kr', label: '韓國' },
    { value: 'cn', label: '中國' },
    { value: 'hk', label: '香港' }
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

  // Google RSS URL 生成器
  const generateGoogleNewsURL = (country: string, _category: string, query: string = '') => {
    const baseURL = 'https://news.google.com/rss'
    const languageMap: Record<string, string> = {
      'tw': 'zh-TW',
      'hk': 'zh-HK', 
      'cn': 'zh-CN',
      'us': 'en-US',
      'gb': 'en-GB',
      'jp': 'ja',
      'kr': 'ko'
    }
    
    const countryMap: Record<string, string> = {
      'tw': 'TW',
      'hk': 'HK',
      'cn': 'CN', 
      'us': 'US',
      'gb': 'GB',
      'jp': 'JP',
      'kr': 'KR'
    }
    
    const lang = languageMap[country] || 'zh-TW'
    const countryCode = countryMap[country] || 'TW'
    const params = new URLSearchParams({
      hl: lang,
      gl: countryCode,
      ceid: `${countryCode}:${lang.replace('-', '-')}`
    })
    
    if (query) {
      return `${baseURL}/search?q=${encodeURIComponent(query)}&${params}`
    } else {
      return `${baseURL}?${params}`
    }
  }

  // RSS 解析函數
  const parseRSSFeed = (xmlText: string): NewsArticle[] => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    const items = xmlDoc.querySelectorAll('item')
    
    return Array.from(items).map((item, index) => {
      const title = item.querySelector('title')?.textContent || ''
      const link = item.querySelector('link')?.textContent || ''
      const description = item.querySelector('description')?.textContent || ''
      const pubDate = item.querySelector('pubDate')?.textContent || ''
      const source = item.querySelector('source')?.textContent || 'Google News'
      
      // 從描述中提取圖片URL
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/)
      const imageUrl = imgMatch ? imgMatch[1] : null
      
      // 清理描述文字
      const cleanDescription = description.replace(/<[^>]*>/g, '').trim()
      
      return {
        id: `google-rss-${index}-${Date.now()}`,
        title: title.replace(/\s-\s.*$/, ''),
        description: cleanDescription.substring(0, 200) + (cleanDescription.length > 200 ? '...' : ''),
        url: link,
        urlToImage: imageUrl,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source: { name: source || 'Google News' },
        author: undefined
      }
    }).slice(0, 20) // 限制20篇文章
  }

  // 獲取新聞數據
  const fetchNews = async (isSearch = false) => {
    setLoading(true)
    setError('')
    setLoadingProgress('正在初始化...')
    
    try {
      // 設置總超時時間（30秒）
      const totalTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('總請求超時')), 30000)
      )
      
      setLoadingProgress('正在連接Google新聞...')
      // 優先嘗試 Google RSS
      await Promise.race([fetchGoogleRSS(isSearch), totalTimeout])
    } catch (googleError) {
      addLog(`Google RSS failed: ${googleError}`)
      try {
        setLoadingProgress('正在嘗試備用新聞源...')
        // 後備使用 NewsAPI
        await fetchNewsAPI(isSearch)
      } catch (newsApiError) {
        addLog(`NewsAPI also failed: ${newsApiError}`)
        setLoadingProgress('載入示例內容...')
        // 最終後備：顯示示例文章
        showFallbackArticles()
      }
    } finally {
      setLoadingProgress('')
    }
  }

  // 顯示後備文章的函數
  const showFallbackArticles = () => {
    addLog('Showing fallback articles due to all API failures')
    const fallbackArticles: NewsArticle[] = [
      {
        id: 'fallback-1',
        title: '網路連接問題',
        description: '目前無法連接到新聞服務，請檢查網路連接或稍後再試。這是示例內容。',
        url: '#',
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        source: { name: 'System' },
        author: 'System'
      },
      {
        id: 'fallback-2',
        title: '服務暫時不可用',
        description: '新聞服務暫時不可用，我們正在努力恢復服務。請稍後再試。',
        url: '#',
        urlToImage: null,
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: 'System' },
        author: 'System'
      }
    ]
    setArticles(fallbackArticles)
    setLoading(false)
  }

  // Google RSS 獲取函數
  const fetchGoogleRSS = async (isSearch = false) => {
    addLog(`Fetching from Google RSS - Category: ${category}, Country: ${country}${isSearch ? `, Query: ${searchQuery}` : ''}`)
    
    const query = isSearch && searchQuery.trim() ? searchQuery.trim() : ''
    const rssUrl = generateGoogleNewsURL(country, category, query)
    
    // CORS 代理列表（按速度排序）
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://cors-anywhere.herokuapp.com/'
    ]
    
    for (const proxy of corsProxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(rssUrl)
        addLog(`Trying proxy: ${proxy}`)
        setLoadingProgress(`正在嘗試代理服務 ${corsProxies.indexOf(proxy) + 1}/${corsProxies.length}...`)
        
        // 添加超時控制（縮短到5秒）
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超時
        
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const xmlText = await response.text()
        const articles = parseRSSFeed(xmlText)
        
        if (articles.length === 0) {
          throw new Error('No articles found in RSS feed')
        }
        
        setArticles(articles)
        addLog(`Successfully fetched ${articles.length} articles from Google RSS`)
        setLoading(false)
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          addLog(`Proxy ${proxy} timeout after 10 seconds`)
        } else {
          addLog(`Proxy ${proxy} failed: ${error}`)
        }
        continue
      }
    }
    
    throw new Error('All CORS proxies failed')
  }

  // NewsAPI 獲取函數（後備方案）
  const fetchNewsAPI = async (isSearch = false) => {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY
    if (!apiKey) {
      throw new Error('News API key not found and Google RSS failed.')
    }

    addLog(`Falling back to NewsAPI - Category: ${category}, Country: ${country}${isSearch ? `, Query: ${searchQuery}` : ''}`)
    
    try {
      let url: string
      const baseUrl = 'https://newsapi.org/v2'
      
      if (isSearch && searchQuery.trim()) {
        // 使用搜索端點，結合地區關鍵字
        let searchTerm = searchQuery.trim()
        
        // 為特定地區添加地區關鍵字以提高相關性
        if (country === 'tw') {
          searchTerm = `${searchQuery} 台灣`
        } else if (country === 'hk') {
          searchTerm = `${searchQuery} 香港`
        } else if (country === 'cn') {
          searchTerm = `${searchQuery} 中國`
        } else if (country === 'jp') {
          searchTerm = `${searchQuery} 日本`
        } else if (country === 'kr') {
          searchTerm = `${searchQuery} 韓國`
        }
        
        url = `${baseUrl}/everything?q=${encodeURIComponent(searchTerm)}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
      } else {
        // 對於台灣、香港等地區，使用everything端點搜索相關新聞
        if (country === 'tw' || country === 'hk' || country === 'cn') {
          const countryKeywords = {
            'tw': '台灣 OR Taiwan',
            'hk': '香港 OR Hong Kong', 
            'cn': '中國 OR China'
          }
          const keyword = countryKeywords[country as keyof typeof countryKeywords]
          url = `${baseUrl}/everything?q=${encodeURIComponent(keyword)}&language=zh&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
        } else {
          // 使用頭條新聞端點
          url = `${baseUrl}/top-headlines?country=${country}&category=${category}&pageSize=20&apiKey=${apiKey}`
        }
      }
      
      addLog(`Making API request to NewsAPI...`)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`)
      }
      
      const data: NewsResponse = await response.json()
      
      if (data.status !== 'ok') {
        throw new Error(`API returned error status: ${data.status}`)
      }
      
      // 為每篇文章添加唯一ID（如果沒有的話）並過濾掉無效文章
      const articlesWithId = data.articles
        .filter(article => article.title && article.title !== '[Removed]')
        .map((article, index) => ({
          ...article,
          id: article.url || `article-${index}-${Date.now()}`,
          urlToImage: article.urlToImage || null,
          description: article.description || '暫無描述'
        }))
      
      setArticles(articlesWithId)
      addLog(`Successfully fetched ${articlesWithId.length} articles`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '獲取新聞時發生未知錯誤'
      setError(`獲取新聞失敗: ${errorMessage}`)
      addLog(`Error: ${errorMessage}`)
      
      // 如果API失敗，顯示一些示例文章作為後備
      addLog('Falling back to sample articles due to API error')
      const fallbackArticles: NewsArticle[] = [
        {
          id: 'fallback-1',
          title: '科技巨頭發布最新AI技術突破',
          description: '人工智慧領域再次迎來重大突破，新技術將改變我們的生活方式。專家預測這項技術將在未來五年內廣泛應用。',
          url: 'https://newsapi.org/',
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          source: { name: 'TechNews' },
          author: '科技記者'
        },
        {
          id: 'fallback-2',
          title: '全球經濟市場最新動態分析',
          description: '專家分析當前經濟形勢，預測未來發展趨勢。市場波動中蘊含新的投資機會。',
          url: 'https://newsapi.org/',
          urlToImage: null,
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'FinanceDaily' },
          author: '財經分析師'
        },
        {
          id: 'fallback-3',
          title: '健康生活新趨勢：專家建議',
          description: '醫學專家分享最新健康生活建議，幫助民眾維持身心健康。簡單的生活習慣改變帶來顯著效果。',
          url: 'https://newsapi.org/',
          urlToImage: null,
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: 'HealthToday' },
          author: '健康專家'
        },
        {
          id: 'fallback-4',
          title: '環保科技創新解決方案',
          description: '新興環保技術為地球永續發展帶來希望。創新的綠色科技正在改變傳統產業模式。',
          url: 'https://newsapi.org/',
          urlToImage: null,
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          source: { name: 'EcoNews' },
          author: '環保記者'
        }
      ]
      setArticles(fallbackArticles)
    } finally {
      setLoading(false)
    }
  }

  // 搜尋新聞
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchNews(true)
    } else {
      fetchNews(false)
    }
  }

  // 處理 Enter 鍵搜尋
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 格式化時間
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return '剛剛'
    } else if (diffInHours < 24) {
      return `${diffInHours} 小時前`
    } else {
      return date.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // 開啟新聞連結
  const openNewsLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // 組件載入時獲取新聞
  useEffect(() => {
    fetchNews()
  }, [category, country])

  return (
    <div className="news-reader">
      <div className="tool-header">
        <h2>📰 熱門新聞查詢</h2>
        <p>瀏覽最新熱門新聞，掌握時事動態</p>
      </div>

      {/* 控制面板 */}
      <div className="news-controls">
        <div className="control-row">
          <div className="control-group">
            <label>分類：</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="control-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>地區：</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="control-select"
            >
              {countries.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-actions">
            <div className="control-group">
              <label>視圖：</label>
              <div className="view-mode-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="網格視圖"
                >
                  ⊞
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="列表視圖"
                >
                  ☰
                </button>
              </div>
            </div>
            <div className="control-group">
              <label>主題：</label>
              <select
                value={uiTheme}
                onChange={(e) => setUITheme(e.target.value)}
                className="control-select theme-select"
              >
                <option value="modern">現代風格</option>
                <option value="minimal">極簡風格</option>
                <option value="card">卡片風格</option>
                <option value="magazine">雜誌風格</option>
                <option value="newspaper">報紙風格</option>
              </select>
            </div>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className={`action-btn logs-btn ${showLogs ? 'active' : ''}`}
              title={showLogs ? "隱藏日誌" : "顯示日誌"}
            >
              📋
            </button>
            <button
              onClick={() => fetchNews()}
              disabled={loading}
              className="action-btn refresh-btn"
              title="重新整理"
            >
              {loading ? '⏳' : '🔄'}
            </button>
          </div>
        </div>

        <div className="search-row">
          <div className="search-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="搜尋新聞關鍵字..."
              className="search-input"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="search-btn"
            >
              {loading ? '⏳' : '🔍'}
            </button>
          </div>
        </div>
      </div>

      {/* 錯誤訊息 */}
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

      {/* 日誌面板 */}
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

      {/* 新聞列表 */}
      <div className="news-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>正在載入新聞...</p>
            {loadingProgress && (
              <div className="loading-progress">
                <p className="progress-text">{loadingProgress}</p>
                <div className="progress-tips">
                  <small>💡 提示：首次載入可能需要較長時間</small>
                </div>
              </div>
            )}
          </div>
        ) : articles.length === 0 ? (
          <div className="no-news">
            <div className="no-news-icon">📰</div>
            <h3>暫無新聞</h3>
            <p>請嘗試更換分類或搜尋關鍵字</p>
          </div>
        ) : (
          <div className={`news-container-inner view-${viewMode} theme-${uiTheme}`}>
            {articles.map((article) => (
              <div key={article.id} className={`news-card ${!article.urlToImage ? 'no-image-card' : ''} ${viewMode === 'list' ? 'list-card' : ''}`}>
                {viewMode === 'list' ? (
                  // 列表模式佈局
                  <>
                    {article.urlToImage && (
                      <div className="news-image list-image">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.classList.add('image-error')
                              parent.innerHTML = '<div class="image-error-placeholder"><span class="error-icon">🖼️</span><span class="error-text">圖片載入失敗</span></div>'
                            }
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="news-content list-content">
                      <div className="news-meta">
                        <div className="meta-left">
                          <span className="news-source">{article.source.name}</span>
                          <span className="meta-separator">•</span>
                          <span className="news-time">{formatTime(article.publishedAt)}</span>
                        </div>
                        <div className="category-badge">
                          {categories.find(cat => cat.value === category)?.label || '新聞'}
                        </div>
                      </div>
                      
                      <h3 className="news-title">{article.title}</h3>
                      <p className="news-description">{article.description}</p>
                      
                      <div className="news-footer">
                        {article.author && (
                          <div className="news-author">
                            <span className="author-icon">✍️</span>
                            {article.author}
                          </div>
                        )}
                        <button
                          className="read-more-btn"
                          onClick={() => openNewsLink(article.url)}
                        >
                          <span>閱讀全文</span>
                          <span className="btn-arrow">→</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // 網格模式佈局（原有佈局）
                  <>
                    {article.urlToImage ? (
                      <div className="news-image">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.classList.add('image-error')
                              parent.innerHTML = '<div class="image-error-placeholder"><span class="error-icon">🖼️</span><span class="error-text">圖片載入失敗</span></div>'
                            }
                          }}
                        />
                      </div>
                    ) : null}
                    
                    <div className="news-content">
                      <div className="news-meta">
                        <div className="meta-left">
                          <span className="news-source">{article.source.name}</span>
                          <span className="meta-separator">•</span>
                          <span className="news-time">{formatTime(article.publishedAt)}</span>
                        </div>
                        <div className="category-badge">
                          {categories.find(cat => cat.value === category)?.label || '新聞'}
                        </div>
                      </div>
                      
                      <h3 className="news-title">{article.title}</h3>
                      <p className="news-description">{article.description}</p>
                      
                      <div className="news-footer">
                        {article.author && (
                          <div className="news-author">
                            <span className="author-icon">✍️</span>
                            {article.author}
                          </div>
                        )}
                        <button
                          className="read-more-btn"
                          onClick={() => openNewsLink(article.url)}
                        >
                          <span>閱讀全文</span>
                          <span className="btn-arrow">→</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 提示訊息 */}
      <div className="news-notice">
        <p>💡 <strong>新功能：</strong>現在優先使用免費的Google RSS新聞源，提供更豐富的新聞內容！</p>
        <p>🔗 新聞來源：<a href="https://news.google.com/" target="_blank" rel="noopener noreferrer">Google News</a> (主要) + <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">NewsAPI</a> (後備)</p>
      </div>
    </div>
  )
}

export default NewsReader