import type { Metadata } from 'next'
import { AdminShell } from '@/app/admin/page'
import { SupabaseAuthSetup } from '@/components/admin/supabase-auth-setup'
import { requireAdmin } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Supabase Auth Setup | Adigun Video Lab Admin',
  robots: { index: false, follow: false },
}

export default async function SupabaseAuthSetupPage() {
  await requireAdmin()

  return (
    <AdminShell active="Settings">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold text-[#e86f00]">Admin workspace / System</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Auth setup</h1>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">A temporary admin-only utility for the academy Supabase project.</p>
        </div>
        <SupabaseAuthSetup />
      </div>
    </AdminShell>
  )
}
