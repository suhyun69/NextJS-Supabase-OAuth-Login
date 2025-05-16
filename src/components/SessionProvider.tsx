// ✅ src/components/SessionProvider.tsx
'use client'

import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Session } from '@supabase/supabase-js'

type Profile = {
  id: string
  user_id: string
  nickname: string
  avatar_url?: string
}

type ContextType = {
  session: Session | null
  profile: Profile | null
  error: string | null
}

const SessionContext = createContext<ContextType>({
  session: null,
  profile: null,
  error: null,
})

export function useSession() {
  return useContext(SessionContext)
}

export default function SessionProvider({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession: Session | null
}) {
  const supabase = createPagesBrowserClient()
  const [session, setSession] = useState<Session | null>(initialSession)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 1) auth 세션 복원 & 변경 구독
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  // 2) session이 바뀔 때만 프로필 조회
  useEffect(() => {
    if (session?.user.id) {
      fetch(
      `/api/profiles?email=${encodeURIComponent(session.user.email || '')}`
    )
        .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
        .then(({ profile }) => setProfile(profile))
        .catch(() => setProfile(null))
    } else {
      setProfile(null)
    }
  }, [session])

  // 3) Context에 세션, 프로필, 에러 제공
  return (
    <SessionContext.Provider value={{ session, profile, error }}>
      {children}
    </SessionContext.Provider>
  )
}
