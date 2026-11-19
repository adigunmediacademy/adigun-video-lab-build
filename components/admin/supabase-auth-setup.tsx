'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'

type SetupResult = {
  siteUrl: string
  redirectUrls: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function SupabaseAuthSetup() {
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SetupResult | null>(null)

  async function applyConfiguration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!confirmed || loading || result) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/supabase-auth-config', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })

      let payload: unknown
      try {
        payload = await response.json()
      } catch {
        throw new Error('The setup service returned an unexpected response.')
      }

      if (!response.ok || !isRecord(payload) || payload.ok !== true) {
        const message = isRecord(payload) && typeof payload.error === 'string'
          ? payload.error.slice(0, 200)
          : 'The Auth configuration could not be applied.'
        throw new Error(message)
      }

      if (
        typeof payload.site_url !== 'string' ||
        !Array.isArray(payload.redirect_urls) ||
        !payload.redirect_urls.every((url) => typeof url === 'string')
      ) {
        throw new Error('The setup service returned an unexpected response.')
      }

      setResult({ siteUrl: payload.site_url, redirectUrls: payload.redirect_urls })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The Auth configuration could not be applied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl rounded-2xl border border-[#e7e7e7] bg-white p-5 sm:p-8" aria-busy={loading}>
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff3e8] text-[#e86f00]">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#e86f00]">Temporary system utility</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Supabase Auth configuration</h2>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">
            Update the Site URL and add the academy callback URLs while preserving existing redirect URLs. Other Auth settings will not be changed.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#e7e7e7] bg-[#f8f8f7] p-4 text-sm">
        <p className="font-semibold">The following settings will be applied</p>
        <dl className="mt-3 flex flex-col gap-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Site URL</dt>
            <dd className="mt-1 break-all font-medium">https://www.adigunvideolab.com</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Redirect URLs to add</dt>
            <dd className="mt-1 flex flex-col gap-1 break-all font-medium">
              <span>https://www.adigunvideolab.com/auth/callback</span>
              <span>https://adigunvideolab.com/auth/callback</span>
            </dd>
          </div>
        </dl>
      </div>

      {!result ? (
        <form onSubmit={applyConfiguration} className="mt-6 flex flex-col gap-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              disabled={loading}
              className="mt-1 size-4 accent-[#e86f00]"
            />
            <span>I have reviewed these settings and confirm that I want to apply them to Supabase Auth.</span>
          </label>
          <button
            type="submit"
            disabled={!confirmed || loading}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#151515] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
            {loading ? 'Applying configuration…' : 'Apply Supabase Auth Configuration'}
          </button>
        </form>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-[#6b7280]" role="status">Contacting Supabase and verifying the resulting settings…</p>
      ) : null}

      {error ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div><p className="font-semibold">Configuration was not confirmed</p><p className="mt-1">{error}</p></div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950" role="status" aria-live="polite">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 aria-hidden="true" className="size-5" />
            <h3>Supabase Auth configuration applied</h3>
          </div>
          <dl className="mt-4 flex flex-col gap-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-green-800">Resulting Site URL</dt>
              <dd className="mt-1 break-all">{result.siteUrl}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-green-800">Resulting redirect URLs</dt>
              <dd><ul className="mt-1 flex flex-col gap-1">{result.redirectUrls.map((url, index) => <li key={`${url}-${index}`} className="break-all">{url}</li>)}</ul></dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  )
}
