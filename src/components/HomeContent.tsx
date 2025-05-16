'use client'

import { useState } from 'react'
import { useSession } from '@/components/SessionProvider'
import { supabase } from '@/lib/supabase-client'

export default function HomeContent() {
  const session = useSession()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    // 로그아웃 후 세션이 삭제되면 onAuthStateChange 로 UI가 자동 갱신됩니다.
    setLoading(false)
  }

  return (
    <div>
      <h1>홈</h1>
      {session ? (
        <>
          <p>✅ 로그인됨: {session.user.email}</p>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            {loading ? '처리 중…' : '로그아웃'}
          </button>
        </>
      ) : (
        <>
          <p>❌ 로그인 안됨</p>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
          >
            {loading ? '처리 중…' : '카카오 로그인'}
          </button>
        </>
      )}
    </div>
  )
}
