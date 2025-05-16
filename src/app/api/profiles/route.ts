// src/app/api/profiles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseJs } from '@/lib/supabase-js-client'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const email = url.searchParams.get('email')
  if (!email) {
    return NextResponse.json(
      { error: 'Missing email query parameter' },
      { status: 400 }
    )
  }

  // email 컬럼으로 프로필 조회
  const { data: profile, error } = await supabaseJs
    .from('profiles')
    .select('id, email, nickname')
    .eq('email', 'laztwo@hanmail.net')      // profiles에 email 컬럼이 있다고 가정
    .maybeSingle()

  if (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json({ profile }, { status: 200 })
}
