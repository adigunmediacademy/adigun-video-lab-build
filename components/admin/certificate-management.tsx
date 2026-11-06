'use client'

import { Search, ShieldCheck, ShieldOff } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getMockCertificates, revokeMockCertificate, type MockCertificate } from '@/lib/mock-certificates'

export function CertificateManagement() {
  const [certificates, setCertificates] = useState<MockCertificate[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'revoked'>('all')
  useEffect(() => setCertificates(getMockCertificates()), [])
  const filtered = useMemo(() => certificates.filter((certificate) => {
    const matchesQuery = `${certificate.studentName} ${certificate.courseTitle} ${certificate.id}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'all' || certificate.status === status)
  }), [certificates, query, status])

  function revoke(id: string) {
    revokeMockCertificate(id)
    setCertificates(getMockCertificates())
  }

  return <div className="rounded-2xl border border-[#e7e7e7] bg-white p-5 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-sm font-semibold text-[#e86f00]">Admin management</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Certificates</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#6b7280]">Review issued credentials, search by student or ID, and revoke certificates when needed.</p></div><div className="rounded-xl bg-[#fff1dc] p-3"><ShieldCheck className="size-5 text-[#e86f00]" /></div></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><span className="sr-only">Search certificates</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student, course or certificate ID" className="w-full rounded-xl border border-[#d8d8d4] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#e86f00]" /></label><select aria-label="Filter certificate status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-xl border border-[#d8d8d4] px-3 py-3 text-sm outline-none focus:border-[#e86f00]"><option value="all">All statuses</option><option value="active">Active</option><option value="revoked">Revoked</option></select></div><div className="mt-6 overflow-x-auto rounded-xl border border-[#e7e7e7]"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#f7f7f5] text-xs uppercase tracking-wider text-[#6b7280]"><tr><th className="px-4 py-3">Certificate</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Issued</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{filtered.map((certificate) => <tr key={certificate.id} className="border-t border-[#eeeeeb]"><td className="px-4 py-4 font-mono text-xs">{certificate.id}</td><td className="px-4 py-4 font-semibold">{certificate.studentName}</td><td className="px-4 py-4">{certificate.courseTitle}</td><td className="px-4 py-4 text-[#6b7280]">{new Date(certificate.issuedAt).toLocaleDateString()}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${certificate.status === 'active' ? 'bg-[#eaf7ef] text-[#237a43]' : 'bg-[#fff0ed] text-[#b42318]'}`}>{certificate.status}</span></td><td className="px-4 py-4">{certificate.status === 'active' ? <button type="button" onClick={() => revoke(certificate.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b42318] hover:underline"><ShieldOff className="size-3.5" />Revoke</button> : <span className="text-xs text-[#9ca3af]">No actions</span>}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-[#6b7280]">No certificates match your search.</td></tr>}</tbody></table></div></div>
}
