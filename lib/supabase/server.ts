import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { secure: process.env.NODE_ENV === 'production' },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Components cannot always write cookies during rendering.
          }
        },
      },
    },
  )
}

export async function requireRole(role: 'admin' | 'student') {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  const dashboard = role === 'admin' ? '/admin' : '/student'
  const requestedPath = (await headers()).get('x-app-pathname')
  const returnPath = requestedPath &&
    (requestedPath === dashboard || requestedPath.startsWith(`${dashboard}/`))
    ? requestedPath
    : dashboard

  if (userError || !user) {
    redirect(`/auth/login?next=${encodeURIComponent(returnPath)}`)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, full_name, email')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'student')) {
    redirect('/auth/login?error=profile')
  }

  if (profile.role !== role) {
    redirect(profile.role === 'admin' ? '/admin' : '/student')
  }

  return { supabase, user, profile, isAdmin: profile.role === 'admin' }
}

export async function requireAdmin() {
  return requireRole('admin')
}

export async function requireStudent() {
  return requireRole('student')
}
