import Link from 'next/link'
import { requireAdmin } from '@/lib/supabase/server'
import { AdminShell } from '../page'

const labels: Record<string, string> = { applications: 'Applications', students: 'Students', courses: 'Courses', lessons: 'Lessons', assignments: 'Assignments', 'ai-tools': 'AI Tools', templates: 'Templates', payments: 'Payments', settings: 'Settings' }

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) return <main className="flex min-h-screen items-center justify-center"><p>Admin access required.</p></main>
  const title = labels[section] || 'Admin'
  return <AdminShell active={title}><div className="rounded-2xl border border-[#e7e7e7] bg-white p-6 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-sm font-semibold text-[#e86f00]">Admin management</p><h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#6b7280]">Manage {title.toLowerCase()} using the Supabase-backed workspace.</p></div><button className="rounded-full bg-[#151515] px-4 py-2.5 text-sm font-semibold text-white">Add {title === 'AI Tools' ? 'tool' : title.slice(0, -1).toLowerCase()}</button></div><div className="mt-8 overflow-x-auto rounded-xl border border-[#e7e7e7]"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-[#f7f7f5] text-xs uppercase tracking-wider text-[#6b7280]"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3">Action</th></tr></thead><tbody><tr><td colSpan={4} className="px-4 py-12 text-center text-[#6b7280]">No records yet. Connect your Supabase tables to populate this view.</td></tr></tbody></table></div><p className="mt-5 text-xs text-[#9ca3af]">RLS policies should restrict student records to the signed-in student and reserve management actions for profiles with role = admin.</p></div></AdminShell>
}
