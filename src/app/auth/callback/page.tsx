// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseJs } from '@/lib/supabase-js-client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabaseJs.auth.getSession()
        if (error) throw error
        if (session) {
          await supabaseJs.auth.setSession(session)
        }
      } catch (error) {
        console.error('인증 처리 중 오류 발생:', error)
      } finally {
        router.replace('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return <div>로그인 처리 중…</div>
}
