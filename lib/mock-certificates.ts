export type MockCertificate = {
  id: string
  studentName: string
  courseTitle: string
  courseSlug: string
  issuedAt: string
  status: 'active' | 'revoked'
  completionScore: number
}

const STORAGE_KEY = 'adigun-mock-certificates'

const seedCertificates: MockCertificate[] = [
  {
    id: 'AVL-2026-EDIT-7K4M9Q',
    studentName: 'Ada Adigun',
    courseTitle: 'Video Editing Foundations',
    courseSlug: 'video-editing-foundations',
    issuedAt: '2026-11-04T10:00:00.000Z',
    status: 'active',
    completionScore: 92,
  },
]

export function getMockCertificates() {
  if (typeof window === 'undefined') return seedCertificates
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as MockCertificate[]
  } catch {
    // Keep the seeded certificate available if storage is unavailable.
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCertificates))
  return seedCertificates
}

export function saveMockCertificate(certificate: Omit<MockCertificate, 'id'>) {
  if (typeof window === 'undefined') return null
  const next: MockCertificate = { ...certificate, id: createCertificateId(certificate.courseTitle) }
  const certificates = getMockCertificates()
  const existing = certificates.find((item) => item.courseSlug === certificate.courseSlug && item.studentName === certificate.studentName)
  if (existing) return existing
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...certificates]))
  return next
}

export function revokeMockCertificate(id: string) {
  if (typeof window === 'undefined') return
  const certificates = getMockCertificates().map((certificate) => certificate.id === id ? { ...certificate, status: 'revoked' as const } : certificate)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates))
}

export function createCertificateId(courseTitle: string) {
  const prefix = courseTitle.split(' ').map((word) => word[0]).join('').slice(0, 4).toUpperCase()
  return `AVL-${new Date().getFullYear()}-${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}
