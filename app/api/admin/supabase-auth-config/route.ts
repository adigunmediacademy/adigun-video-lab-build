import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const PROJECT_REF = 'fytswihtsidsqtlhgzoo'
const SITE_URL = 'https://www.adigunvideolab.com'
const REQUIRED_REDIRECT_URLS = [
  'https://www.adigunvideolab.com/auth/callback',
  'https://adigunvideolab.com/auth/callback',
]
const MANAGEMENT_API_URL = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`

function jsonError(status: number, error: string) {
  return NextResponse.json(
    { ok: false, error },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}

function parseUriAllowList(value: unknown): string[] | null {
  if (typeof value !== 'string') return null
  if (value.trim() === '') return []

  const entries = value.split(',').map((entry) => entry.trim())
  if (entries.some((entry) => entry.length === 0)) return null
  return entries
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getVercelPreviewOrigins() {
  const origins = new Set<string>()
  if (process.env.VERCEL_ENV !== 'preview') return origins

  for (const hostname of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (!hostname) continue

    try {
      const previewUrl = new URL(`https://${hostname}`)
      if (
        previewUrl.hostname !== hostname ||
        previewUrl.host !== hostname ||
        !previewUrl.hostname.endsWith('.vercel.app')
      ) {
        continue
      }
      origins.add(previewUrl.origin)
    } catch {
      continue
    }
  }

  return origins
}

function isAllowedOrigin(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = request.headers.get('origin')
  if (!origin || origin !== requestUrl.origin) return false

  const productionOrigins = new Set([
    'https://www.adigunvideolab.com',
    'https://adigunvideolab.com',
  ])
  if (productionOrigins.has(requestUrl.origin)) return true
  if (getVercelPreviewOrigins().has(requestUrl.origin)) return true

  return process.env.NODE_ENV !== 'production' &&
    (requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1')
}

async function getAuthConfig(token: string) {
  return fetch(MANAGEMENT_API_URL, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return jsonError(403, 'Request origin is not allowed.')
  }

  if (process.env.SUPABASE_AUTH_CONFIG_SETUP_ENABLED !== 'true') {
    return jsonError(404, 'Temporary setup utility is disabled.')
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return jsonError(401, 'Authentication required.')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || profile?.role !== 'admin') {
      return jsonError(403, 'Administrator access required.')
    }

    const token = process.env.SUPABASE_MANAGEMENT_API_TOKEN
    if (!token) {
      return jsonError(503, 'Management API is not configured.')
    }

    const currentResponse = await getAuthConfig(token)
    if (!currentResponse.ok) {
      return jsonError(502, 'Could not read the current Auth configuration.')
    }

    let currentConfig: unknown
    try {
      currentConfig = await currentResponse.json()
    } catch {
      return jsonError(502, 'The current Auth configuration could not be safely parsed.')
    }

    if (!isRecord(currentConfig)) {
      return jsonError(502, 'The current Auth configuration could not be safely parsed.')
    }

    const currentRedirectUrls = parseUriAllowList(currentConfig.uri_allow_list)
    if (!currentRedirectUrls) {
      return jsonError(502, 'Existing redirect URLs could not be safely preserved; no changes were made.')
    }

    const updatedRedirectUrls = [...currentRedirectUrls]
    for (const redirectUrl of REQUIRED_REDIRECT_URLS) {
      if (!updatedRedirectUrls.includes(redirectUrl)) updatedRedirectUrls.push(redirectUrl)
    }
    const uriAllowList = updatedRedirectUrls.join(',')
    const updateResponse = await fetch(MANAGEMENT_API_URL, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ site_url: SITE_URL, uri_allow_list: uriAllowList }),
      cache: 'no-store',
    })

    if (!updateResponse.ok) {
      return jsonError(502, 'The Auth configuration update was not confirmed.')
    }

    const verifiedResponse = await getAuthConfig(token)
    if (!verifiedResponse.ok) {
      return jsonError(502, 'The update was submitted, but its result could not be verified.')
    }

    let verifiedConfig: unknown
    try {
      verifiedConfig = await verifiedResponse.json()
    } catch {
      return jsonError(502, 'The update was submitted, but its result could not be safely verified.')
    }

    if (!isRecord(verifiedConfig)) {
      return jsonError(502, 'The update was submitted, but its result could not be safely verified.')
    }

    const resultingRedirectUrls = parseUriAllowList(verifiedConfig.uri_allow_list)
    if (
      verifiedConfig.site_url !== SITE_URL ||
      !resultingRedirectUrls ||
      !REQUIRED_REDIRECT_URLS.every((url) => resultingRedirectUrls.includes(url))
    ) {
      return jsonError(502, 'The update was submitted, but the requested settings were not verified.')
    }

    return NextResponse.json(
      { ok: true, site_url: SITE_URL, redirect_urls: resultingRedirectUrls },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return jsonError(500, 'The temporary Auth configuration operation failed.')
  }
}
