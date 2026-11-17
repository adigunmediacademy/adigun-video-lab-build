'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageIsError(false)

    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.code === 'weak_password') {
          setMessage('Please choose a stronger password.')
        } else if (error.code === 'over_email_send_rate_limit' || error.status === 429) {
          setMessage('Too many attempts. Please wait a moment and try again.')
        } else if (error.code === 'email_address_invalid' || error.code === 'validation_failed') {
          setMessage('Please enter a valid email address and password.')
        } else {
          setMessage('Unable to create your account right now. Please try again.')
        }
        setMessageIsError(true)
        return
      }

      if (data.session) {
        window.location.assign('/student')
        return
      }

      setMessage('If this email can be registered, check your inbox for a confirmation link.')
    } catch {
      setMessage('Unable to create your account right now. Please try again.')
      setMessageIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5 py-10 text-[#151515]"><div className="w-full max-w-md rounded-3xl border border-[#e7e7e7] bg-white p-6 shadow-sm sm:p-8"><Link href="/" className="text-sm font-bold">Adigun <span className="text-[#e86f00]">Video Lab</span></Link><h1 className="mt-10 text-3xl font-bold tracking-tight">Create your account</h1><p className="mt-2 text-sm leading-6 text-[#6b7280]">Join the lab and start building your video skills.</p><form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-semibold">Email<input required autoComplete="email" type="email" value={email} onChange={event => setEmail(event.target.value)} className="rounded-xl border border-[#deded9] px-4 py-3 font-normal outline-none focus:border-[#e86f00]" /></label><label className="flex flex-col gap-2 text-sm font-semibold">Password<input required minLength={8} autoComplete="new-password" type="password" value={password} onChange={event => setPassword(event.target.value)} className="rounded-xl border border-[#deded9] px-4 py-3 font-normal outline-none focus:border-[#e86f00]" /></label>{message && <p role={messageIsError ? 'alert' : 'status'} className={`text-sm ${messageIsError ? 'text-[#b42318]' : 'text-[#6b7280]'}`}>{message}</p>}<button type="submit" disabled={loading} className="rounded-xl bg-[#151515] px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Creating account…' : 'Create account'}</button><p className="text-center text-sm text-[#6b7280]">Already registered? <Link href="/auth/login" className="font-semibold text-[#e86f00]">Sign in</Link></p></form></div></main>
}
