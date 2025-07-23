import { useState } from 'react'
import './HttpTester.css'

interface RequestHistory {
  id: string
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  timestamp: string
  response?: {
    status: number
    statusText: string
    headers: Record<string, string>
    data: any
    responseTime: number
  }
  error?: string
}

const HttpTester = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json",\n  "User-Agent": "HttpTester/1.0"\n}')
  const [body, setBody] = useState('{\n  "key": "value"\n}')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<RequestHistory[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RequestHistory | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // 發送 HTTP 請求
  const sendRequest = async () => {
    if (!url.trim()) {
      alert('請輸入有效的 URL')
      return
    }

    setLoading(true)
    const startTime = Date.now()

    try {
      // 解析 headers
      let parsedHeaders: Record<string, string> = {}
      try {
        parsedHeaders = JSON.parse(headers)
      } catch (e) {
        console.warn('Headers 格式錯誤，使用預設值')
        parsedHeaders = { 'Content-Type': 'application/json' }
      }

      // 構建請求選項
      const requestOptions: RequestInit = {
        method,
        headers: parsedHeaders,
        mode: 'cors',
      }

      // 如果是 POST/PUT/PATCH 且有 body，添加請求體
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        requestOptions.body = body
      }

      // 發送請求
      const response = await fetch(url, requestOptions)
      const endTime = Date.now()
      const responseTime = endTime - startTime

      // 獲取響應數據
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let responseData: any
      const contentType = response.headers.get('content-type')
      
      try {
        if (contentType?.includes('application/json')) {
          responseData = await response.json()
        } else {
          responseData = await response.text()
        }
      } catch (e) {
        responseData = 'Unable to parse response'
      }

      // 創建請求記錄
      const requestRecord: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        headers: parsedHeaders,
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined,
        timestamp: new Date().toLocaleString('zh-TW'),
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data: responseData,
          responseTime
        }
      }

      setHistory(prev => [requestRecord, ...prev.slice(0, 19)]) // 保留最近 20 條記錄
      setSelectedRequest(requestRecord)

    } catch (error) {
      const requestRecord: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        headers: JSON.parse(headers),
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined,
        timestamp: new Date().toLocaleString('zh-TW'),
        error: error instanceof Error ? error.message : '請求失敗'
      }

      setHistory(prev => [requestRecord, ...prev.slice(0, 19)])
      setSelectedRequest(requestRecord)
    } finally {
      setLoading(false)
    }
  }

  // 清空歷史記錄
  const clearHistory = () => {
    setHistory([])
    setSelectedRequest(null)
  }

  // 複製請求為 cURL
  const copyAsCurl = () => {
    if (!selectedRequest) return

    let curl = `curl -X ${selectedRequest.method} "${selectedRequest.url}"`
    
    // 添加 headers
    Object.entries(selectedRequest.headers).forEach(([key, value]) => {
      curl += ` \\\n  -H "${key}: ${value}"`
    })

    // 添加 body
    if (selectedRequest.body) {
      curl += ` \\\n  -d '${selectedRequest.body}'`
    }

    navigator.clipboard.writeText(curl).then(() => {
      alert('cURL 命令已複製到剪貼板！')
    }).catch(() => {
      alert('複製失敗，請手動複製')
    })
  }

  // 格式化 JSON
  const formatJson = (jsonString: string, setter: (value: string) => void) => {
    try {
      const parsed = JSON.parse(jsonString)
      const formatted = JSON.stringify(parsed, null, 2)
      setter(formatted)
    } catch (e) {
      alert('JSON 格式錯誤，無法格式化')
    }
  }

  // 預設 URL 示例
  const setExampleUrl = (type: 'json' | 'api' | 'test') => {
    switch (type) {
      case 'json':
        setUrl('https://jsonplaceholder.typicode.com/posts/1')
        setMethod('GET')
        break
      case 'api':
        setUrl('https://httpbin.org/get')
        setMethod('GET')
        break
      case 'test':
        setUrl('https://httpbin.org/post')
        setMethod('POST')
        break
    }
  }

  return (
    <div className="http-tester">
      {/* 標題區域 */}
      <div className="tool-header">
        <h2>🌐 HTTP/API 測試工具</h2>
        <p>簡易的 HTTP 請求發送器，支援 GET/POST/PUT/DELETE/PATCH 請求</p>
      </div>

      {/* 請求配置區域 */}
      <div className="request-config">
        <h3>📤 請求配置</h3>
        
        {/* URL 和方法 */}
        <div className="url-method-row">
          <select 
            className="method-select"
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          
          <input
            type="text"
            className="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="輸入請求 URL，例如：https://api.example.com/data"
          />
          
          <button 
            className="btn btn-primary send-btn"
            onClick={sendRequest}
            disabled={loading || !url.trim()}
          >
            {loading ? '🔄 發送中...' : '🚀 發送請求'}
          </button>
        </div>

        {/* 快速示例 */}
        <div className="quick-examples">
          <span>快速示例：</span>
          <button className="example-btn" onClick={() => setExampleUrl('json')}>
            📄 JSON 測試
          </button>
          <button className="example-btn" onClick={() => setExampleUrl('api')}>
            🔧 API 測試
          </button>
          <button className="example-btn" onClick={() => setExampleUrl('test')}>
            📮 POST 測試
          </button>
        </div>

        {/* Headers 配置 */}
        <div className="config-section">
          <div className="section-header">
            <h4>📋 請求頭 (Headers)</h4>
            <button 
              className="format-btn"
              onClick={() => formatJson(headers, setHeaders)}
            >
              🎨 格式化
            </button>
          </div>
          <textarea
            className="config-textarea"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            rows={4}
            placeholder="JSON 格式的請求頭"
          />
        </div>

        {/* Body 配置（僅 POST/PUT/PATCH 顯示） */}
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div className="config-section">
            <div className="section-header">
              <h4>📝 請求體 (Body)</h4>
              <button 
                className="format-btn"
                onClick={() => formatJson(body, setBody)}
              >
                🎨 格式化
              </button>
            </div>
            <textarea
              className="config-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="JSON 格式的請求體"
            />
          </div>
        )}
      </div>

      {/* 響應和歷史記錄區域 */}
      <div className="response-history-container">
        {/* 響應區域 */}
        <div className="response-section">
          <div className="section-header">
            <h3>📥 響應結果</h3>
            {selectedRequest && (
              <div className="response-actions">
                <button className="btn btn-secondary" onClick={copyAsCurl}>
                  📋 複製 cURL
                </button>
              </div>
            )}
          </div>

          {selectedRequest ? (
            <div className="response-content">
              {/* 響應狀態 */}
              <div className="response-status">
                {selectedRequest.response ? (
                  <div className={`status-badge ${selectedRequest.response.status < 400 ? 'success' : 'error'}`}>
                    {selectedRequest.response.status} {selectedRequest.response.statusText}
                    <span className="response-time">
                      {selectedRequest.response.responseTime}ms
                    </span>
                  </div>
                ) : (
                  <div className="status-badge error">
                    ❌ 請求失敗
                  </div>
                )}
              </div>

              {/* 響應頭 */}
              {selectedRequest.response && (
                <div className="response-headers">
                  <h4>📋 響應頭</h4>
                  <pre className="headers-display">
                    {JSON.stringify(selectedRequest.response.headers, null, 2)}
                  </pre>
                </div>
              )}

              {/* 響應數據 */}
              <div className="response-data">
                <h4>📄 響應數據</h4>
                <pre className="data-display">
                  {selectedRequest.response 
                    ? typeof selectedRequest.response.data === 'string' 
                      ? selectedRequest.response.data
                      : JSON.stringify(selectedRequest.response.data, null, 2)
                    : selectedRequest.error
                  }
                </pre>
              </div>
            </div>
          ) : (
            <div className="no-response">
              <p>🚀 發送請求以查看響應結果</p>
            </div>
          )}
        </div>

        {/* 歷史記錄區域 */}
        <div className="history-section">
          <div className="section-header">
            <h3>📚 請求歷史</h3>
            <div className="history-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? '🔽 收起' : '🔼 展開'}
              </button>
              {history.length > 0 && (
                <button className="btn btn-danger" onClick={clearHistory}>
                  🗑️ 清空
                </button>
              )}
            </div>
          </div>

          {showHistory && (
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">暫無請求歷史</p>
              ) : (
                history.map((request) => (
                  <div 
                    key={request.id}
                    className={`history-item ${selectedRequest?.id === request.id ? 'active' : ''}`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="history-method">{request.method}</div>
                    <div className="history-url">{request.url}</div>
                    <div className="history-status">
                      {request.response ? (
                        <span className={request.response.status < 400 ? 'success' : 'error'}>
                          {request.response.status}
                        </span>
                      ) : (
                        <span className="error">ERR</span>
                      )}
                    </div>
                    <div className="history-time">{request.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 使用說明 */}
      <div className="http-footer">
        <h4>💡 使用說明</h4>
        <ul>
          <li>支援 GET、POST、PUT、DELETE、PATCH 等 HTTP 方法</li>
          <li>可自定義請求頭和請求體（JSON 格式）</li>
          <li>自動解析 JSON 響應，顯示格式化結果</li>
          <li>保存最近 20 條請求歷史記錄</li>
          <li>支援複製請求為 cURL 命令</li>
          <li>⚠️ 注意：受瀏覽器 CORS 政策限制，某些 API 可能無法直接訪問</li>
        </ul>
      </div>
    </div>
  )
}

export default HttpTester