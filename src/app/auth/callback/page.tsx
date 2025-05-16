'use client'
import { useEffect } from 'react'

export default function AuthCallback() {
  useEffect(() => {
    window.location.href = '/'
  }, [])

  console.log('🟢 로그인 콜백 페이지')

  return <div>로그인 처리 중...</div>
}
