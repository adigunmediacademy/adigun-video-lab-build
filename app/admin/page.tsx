import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Clock3, Users, WalletCards } from 'lucide-react'
import { requireAdmin } from '@/lib/supabase/server'

const stats = [
  ['Total Students', '0', Users],
  ['Pending Applications', '0', Clock3],
  ['Active Students', '0', CheckCircle2],
  ['Successful Payments', '₦0', WalletCards],
] as const

export default async function AdminDashboard() {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) return <Unauthorized />
  return <AdminShell active="Dashboard"><div className="flex flex-col gap-8">
    <div><p className="text-sm font-semibold text-[#e86f00]">Admin workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Good morning.</h1><p className="mt-2 text-sm text-[#6b7280]">A simple view of what is happening across Adigun Video Lab.</p></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-[#e7e7e7] bg-white p-4"><Icon className="size-5 text-[#e86f00]" /><p className="mt-5 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-[#6b7280]">{label}</p></div>)}</div>
    <section className="rounded-2xl border border-[#e7e7e7] bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">Recent activity</h2><p className="mt-1 text-sm text-[#6b7280]">New applications, payments and submissions will appear here.</p></div><ArrowUpRight className="size-5 text-[#9ca3af]" /></div><div className="mt-8 rounded-xl bg-[#f8f8f8] p-6 text-center text-sm text-[#6b7280]">No activity yet.</div></section>
  </div></AdminShell>
}

function Unauthorized() { return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5"><div className="max-w-sm rounded-2xl border border-[#e7e7e7] bg-white p-8 text-center"><h1 className="text-xl font-bold">Admin access required</h1><p className="mt-3 text-sm leading-6 text-[#6b7280]">Sign in with an administrator account to continue.</p><Link href="/" className="mt-6 inline-block rounded-full bg-[#151515] px-5 py-3 text-sm font-semibold text-white">Return home</Link></div></main> }

export function AdminShell({ active, children }: { active: string; children: React.ReactNode }) { const items = ['Dashboard','Applications','Students','Courses','Lessons','Assignments','AI Tools','Templates','Payments','Settings']; return <div className="min-h-screen bg-[#f7f7f5] text-[#151515]"><header className="border-b border-[#e7e7e7] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><Link href="/" className="font-bold tracking-tight">Adigun <span className="text-[#e86f00]">Video Lab</span></Link><Link href="/" className="text-sm text-[#6b7280]">View site</Link></div></header><div className="mx-auto grid max-w-7xl gap-8 px-5 py-6 lg:grid-cols-[210px_1fr] lg:px-8"><nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">{items.map(item => <Link key={item} href={item === 'Dashboard' ? '/admin' : `/admin/${item.toLowerCase().replace(' ', '-')}`} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${active === item ? 'bg-[#151515] text-white' : 'text-[#6b7280] hover:bg-white hover:text-[#151515]'}`}>{item}</Link>)}</nav><main>{children}</main></div></div> }
