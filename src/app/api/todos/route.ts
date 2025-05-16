import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET: 현재 로그인한 사용자의 todo 목록 조회
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  // 먼저 프로필 ID 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { data: todos, error: todosError } = await supabase
    .from('todos')
    .select('id, title, completed, created_at')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false })

  if (todosError) {
    return NextResponse.json({ error: todosError.message }, { status: 500 })
  }

  return NextResponse.json({ todos }, { status: 200 })
}

// POST: 현재 로그인한 사용자 프로필에 todo 추가
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { title } = body
  if (typeof title !== 'string' || title.length === 0) {
    return NextResponse.json({ error: 'Invalid title' }, { status: 400 })
  }

  // 프로필 ID 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { data: newTodo, error: insertError } = await supabase
    .from('todos')
    .insert({
      profile_id: profile.id,
      title,
    })
    .select('id, title, completed, created_at')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ todo: newTodo }, { status: 201 })
}
