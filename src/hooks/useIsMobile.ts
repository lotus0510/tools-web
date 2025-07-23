import { useState, useEffect } from 'react'

// 自定義 Hook 來檢測是否為手機端
export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    // 初始化時檢查窗口大小
    if (typeof window !== 'undefined') {
      return window.innerWidth <= breakpoint
    }
    return false
  })

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint)
    }

    // 初始檢查
    checkIsMobile()

    // 監聽窗口大小變化
    window.addEventListener('resize', checkIsMobile)

    // 清理事件監聽器
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [breakpoint])

  return isMobile
}