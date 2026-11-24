'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { getSafeInternalRedirect } from '@/lib/supabase/redirects'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'callback') {
      setMessage('We could not verify your sign-in link. Please sign in again.')
    }
    if (new URLSearchParams(window.location.search).get('error') === 'profile') {
      setMessage('We could not verify your account role. Please contact the lab administrator.')
    }
    if (new URLSearchParams(window.location.search).get('error') === 'signout') {
      setMessage('We could not end your session. Please try again.')
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error || !data.user) {
        if (error?.code === 'email_not_confirmed') {
          setMessage('Please confirm your email address. Check your inbox for the link.')
        } else if (error?.code === 'over_request_rate_limit' || error?.status === 429) {
          setMessage('Too many attempts. Please wait a moment and try again.')
        } else if (error?.code === 'invalid_credentials') {
          setMessage('Invalid email or password.')
        } else {
          setMessage('Unable to sign in right now. Please try again.')
        }
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profileError || !profile || (profile.role !== 'student' && profile.role !== 'admin')) {
        await supabase.auth.signOut()
        setMessage('We could not verify your account role. Please contact the lab administrator.')
        return
      }

      const dashboard = profile.role === 'admin' ? '/admin' : '/student'
      const requestedPath = new URLSearchParams(window.location.search).get('next')
      const safePath = getSafeInternalRedirect(requestedPath, window.location.origin, dashboard)
      const destination = safePath === dashboard || safePath.startsWith(`${dashboard}/`) ? safePath : dashboard
      window.location.assign(destination)
    } catch {
      setMessage('Unable to sign in right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to continue your learning journey."><form onSubmit={handleSubmit} className="flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-semibold">Email<input required autoComplete="email" type="email" value={email} onChange={event => setEmail(event.target.value)} className="rounded-xl border border-[#deded9] px-4 py-3 font-normal outline-none focus:border-[#e86f00]" /></label><label className="flex flex-col gap-2 text-sm font-semibold">Password<input required autoComplete="current-password" type="password" value={password} onChange={event => setPassword(event.target.value)} className="rounded-xl border border-[#deded9] px-4 py-3 font-normal outline-none focus:border-[#e86f00]" /></label>{message && <p role="alert" className="text-sm text-[#b42318]">{message}</p>}<button type="submit" disabled={loading} className="rounded-xl bg-[#151515] px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button><p className="text-center text-sm text-[#6b7280]">New to the lab? <Link href="/auth/sign-up" className="font-semibold text-[#e86f00]">Create an account</Link></p></form></AuthShell>
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5 py-10 text-[#151515]"><div className="w-full max-w-md rounded-3xl border border-[#e7e7e7] bg-white p-6 shadow-sm sm:p-8"><Link href="/" className="text-sm font-bold">Adigun <span className="text-[#e86f00]">Video Lab</span></Link><h1 className="mt-10 text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-[#6b7280]">{subtitle}</p><div className="mt-7">{children}</div></div></main> }
