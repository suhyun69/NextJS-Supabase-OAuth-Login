import { cookies, headers } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SessionProvider from '@/components/SessionProvider'
import HomeContent from '@/components/HomeContent'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Home() {
  // const supabase = createServerComponentClient<undefined>({
  //   cookies,   // 함수 참조
  //   headers,   // 함수 참조
  // } as unknown as Parameters<typeof createServerComponentClient>[0])

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()

  // console.log('🟢 서버 컴포넌트에서 가져온 세션:', session)

  return (
    <SessionProvider initialSession={null}>
      <HomeContent />
    </SessionProvider>
  )
}
