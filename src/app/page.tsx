import { cookies, headers } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SessionProvider from '@/components/SessionProvider'
import HomeContent from '@/components/HomeContent'

export const dynamic = 'force-dynamic'

export default async function Home() {
  
  const cookieStore = await cookies()
  const headerStore = await headers()
  
  const supabase = createServerComponentClient<undefined>({
    cookies: () => cookieStore,
    headers: () => headerStore,
  } as unknown as Parameters<typeof createServerComponentClient>[0])

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('🟢 서버 컴포넌트에서 가져온 세션:', session)

  return (
    <SessionProvider initialSession={session}>
      <HomeContent />
    </SessionProvider>
  )
}
