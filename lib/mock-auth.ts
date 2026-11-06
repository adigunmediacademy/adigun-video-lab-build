'use client'

export type MockUser = {
  email: string
  password: string
  role: 'student' | 'admin'
  name?: string
}

const USERS_KEY = 'adigun-video-lab-mock-users'

const demoUsers: MockUser[] = [
  { email: 'student@adigunvideolab.com', password: 'Student123!', role: 'student', name: 'Demo Student' },
  { email: 'admin@adigunvideolab.com', password: 'Admin123!', role: 'admin', name: 'Lab Admin' },
]

function getStoredUsers() {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(window.sessionStorage.getItem(USERS_KEY) ?? '[]') as MockUser[]
  } catch {
    return []
  }
}

export function signInMock(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return [...demoUsers, ...getStoredUsers()].find(
    (user) => user.email === normalizedEmail && user.password === password,
  ) ?? null
}

export function signUpMock(user: MockUser) {
  const normalizedEmail = user.email.trim().toLowerCase()
  const users = getStoredUsers()
  const exists = [...demoUsers, ...users].some((item) => item.email === normalizedEmail)

  if (exists) return { ok: false as const, reason: 'exists' as const }

  const nextUser = { ...user, email: normalizedEmail }
  window.sessionStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]))
  return { ok: true as const, user: nextUser }
}

export function setMockSession(user: MockUser) {
  window.sessionStorage.setItem('adigun-video-lab-mock-session', JSON.stringify(user))
}
