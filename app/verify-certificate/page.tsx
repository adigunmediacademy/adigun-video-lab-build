'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Search, ShieldCheck, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getMockCertificates, type MockCertificate } from '@/lib/mock-certificates'

function CertificateResult({ certificate }: { certificate: MockCertificate }) {
  const isRevoked = certificate.status === 'revoked'
  return (
    <article className={`mt-8 border bg-white p-6 shadow-sm sm:p-8 ${isRevoked ? 'border-red-200' : 'border-[#d8d8d4]'}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7e7e7] pb-6">
        <div className="flex items-center gap-3">
          {isRevoked ? <XCircle className="size-8 text-red-600" /> : <CheckCircle2 className="size-8 text-emerald-600" />}
          <div>
            <p className={`text-xs font-bold uppercase tracking-[.18em] ${isRevoked ? 'text-red-600' : 'text-emerald-600'}`}>{isRevoked ? 'Certificate revoked' : 'Certificate verified'}</p>
            <h2 className="mt-1 text-xl font-bold">{isRevoked ? 'This certificate is no longer valid' : 'This is a valid Adigun Creative Lab certificate'}</h2>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isRevoked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{isRevoked ? 'REVOKED' : 'ACTIVE'}</span>
      </div>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div><dt className="text-xs font-bold uppercase tracking-[.14em] text-[#8b8f98]">Student name</dt><dd className="mt-1 text-lg font-bold">{certificate.studentName}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[.14em] text-[#8b8f98]">Course completed</dt><dd className="mt-1 text-lg font-bold">{certificate.courseTitle}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[.14em] text-[#8b8f98]">Issue date</dt><dd className="mt-1 font-medium">{new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-[.14em] text-[#8b8f98]">Certificate ID</dt><dd className="mt-1 font-mono text-sm font-bold">{certificate.id}</dd></div>
      </dl>
    </article>
  )
}

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState('')
  const [searchedId, setSearchedId] = useState('')
  const certificate = useMemo(() => searchedId ? getMockCertificates().find((item) => item.id.toLowerCase() === searchedId.trim().toLowerCase()) ?? null : null, [searchedId])
  const hasSearched = Boolean(searchedId)

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#151515] sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="size-4" />Back to Adigun Creative Lab</Link>
        <div className="mt-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#dfff4f]"><ShieldCheck className="size-7" /></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-[#e86f00]">Public verification</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Verify a certificate</h1>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#6b7280]">Confirm that an Adigun Creative Lab certificate was issued to the named student and has not been revoked.</p>
        </div>
        <form className="mt-10 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); setSearchedId(certificateId) }}>
          <label className="sr-only" htmlFor="certificate-id">Certificate ID</label>
          <input id="certificate-id" value={certificateId} onChange={(event) => setCertificateId(event.target.value)} placeholder="Enter certificate ID, e.g. AVL-2026-EDIT-7K4M9Q" className="min-h-12 flex-1 rounded-full border border-[#d8d8d4] bg-white px-5 text-sm outline-none transition focus:border-[#e86f00] focus:ring-2 focus:ring-[#e86f00]/15" />
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#151515] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={!certificateId.trim()}><Search className="size-4" />Verify certificate</button>
        </form>
        {hasSearched && certificate && <CertificateResult certificate={certificate} />}
        {hasSearched && !certificate && <div role="alert" className="mt-8 border border-amber-200 bg-amber-50 p-6 text-center"><XCircle className="mx-auto size-8 text-amber-600" /><h2 className="mt-3 text-lg font-bold">Certificate not found</h2><p className="mt-2 text-sm leading-6 text-amber-900/70">Check the ID and try again. Certificate IDs are case-insensitive but must be entered completely.</p></div>}
        <p className="mt-8 text-center text-xs leading-5 text-[#8b8f98]">Verification data is currently a frontend demonstration and will connect to the certificate registry in a future release.</p>
      </div>
    </main>
  )
}
