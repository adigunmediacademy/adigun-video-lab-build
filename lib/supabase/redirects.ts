export function getSafeInternalRedirect(
  next: string | null,
  origin: string,
  fallback = '/student',
) {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return fallback
  }

  try {
    const target = new URL(next, origin)
    if (target.origin !== origin) return fallback
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return fallback
  }
}
