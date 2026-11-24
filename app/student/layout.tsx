import { requireRole } from '@/lib/supabase/server'

export default async function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole('student')
  return children
}
