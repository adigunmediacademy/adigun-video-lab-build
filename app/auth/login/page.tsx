'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMessage(error.message.toLowerCase().includes('confirm') ? 'Please confirm your email before signing in.' : 'Invalid email or password.')
      return
    }
    window.location.assign('/student')
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to continue your learning journey."><form onSubmit={handleSubmit} className="flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-semibold">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="rounded-xl border border-[#deded9] px-4 py-3 font-normal outline-none focus:border-[#e86f00]" /></label><label className="flex flex-col gap-2 text-sm font-semibold">Password<input required minLength={6} type="password" value={password} onChange={event => setPassword(event.target.value)} className="rounded-xl border border-[#deded9] px-4 py-3 font-normal outline-none focus:border-[#e86f00]" /></label>{message && <p role="alert" className="text-sm text-[#b42318]">{message}</p>}<button disabled={loading} className="rounded-xl bg-[#151515] px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button><p className="text-center text-sm text-[#6b7280]">New to the lab? <Link href="/auth/sign-up" className="font-semibold text-[#e86f00]">Create an account</Link></p></form></AuthShell>
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5 py-10 text-[#151515]"><div className="w-full max-w-md rounded-3xl border border-[#e7e7e7] bg-white p-6 shadow-sm sm:p-8"><Link href="/" className="text-sm font-bold">Adigun <span className="text-[#e86f00]">Video Lab</span></Link><h1 className="mt-10 text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-[#6b7280]">{subtitle}</p><div className="mt-7">{children}</div></div></main> }
