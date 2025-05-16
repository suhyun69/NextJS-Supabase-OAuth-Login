'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase-client'
import type { Session } from '@supabase/supabase-js'

const SessionContext = createContext<Session | null>(null)

export function useSession() {
  return useContext(SessionContext)
}

export default function SessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const [session, setSession] = useState<Session | null>(initialSession)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🟢 초기 세션 (CSR):', session)
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 세션 변경됨:', session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}