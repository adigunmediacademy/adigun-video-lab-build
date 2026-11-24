'use client'

import Link from 'next/link'
import { Award, Download, Eye, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getMockCertificates, type MockCertificate } from '@/lib/mock-certificates'

export function Certificates() {
  const [certificates, setCertificates] = useState<MockCertificate[]>([])
  useEffect(() => setCertificates(getMockCertificates()), [])

  return <section className="mt-10">
    <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Certificates</h2><p className="mt-1 text-sm text-[#6b7280]">Your verified course completions.</p></div><Award className="size-5 text-[#e86f00]" /></div>
    {certificates.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-[#d8d8d4] bg-white p-6 text-sm text-[#6b7280]">Complete a course to unlock your first certificate.</div> : <div className="mt-4 grid gap-4 lg:grid-cols-2">{certificates.map((certificate) => <article key={certificate.id} className="rounded-2xl border border-[#e7e7e7] bg-white p-5"><div className="flex items-start justify-between gap-4"><div className="flex size-11 items-center justify-center rounded-xl bg-[#fff1dc]"><Award className="size-5 text-[#e86f00]" /></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${certificate.status === 'active' ? 'bg-[#eaf7ef] text-[#237a43]' : 'bg-[#fff0ed] text-[#b42318]'}`}>{certificate.status}</span></div><h3 className="mt-5 font-bold">{certificate.courseTitle}</h3><p className="mt-1 text-sm text-[#6b7280]">Issued {new Date(certificate.issuedAt).toLocaleDateString()} · ID {certificate.id}</p><div className="mt-5 flex flex-wrap gap-2"><Link href={`/student/certificates/${certificate.id}`} className="inline-flex items-center gap-2 rounded-full bg-[#151515] px-3.5 py-2 text-xs font-semibold text-white"><Eye className="size-3.5" />View certificate</Link><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-[#d8d8d4] px-3.5 py-2 text-xs font-semibold"><Printer className="size-3.5" />Print / PDF</button><a href={`/student/certificates/${certificate.id}?download=1`} className="inline-flex items-center gap-2 rounded-full border border-[#d8d8d4] px-3.5 py-2 text-xs font-semibold"><Download className="size-3.5" />Download</a></div></article>)}</div>}
  </section>
}
