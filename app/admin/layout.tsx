import { requireRole } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole('admin')
  return children
}
