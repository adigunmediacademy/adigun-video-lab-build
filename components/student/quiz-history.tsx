'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, ClipboardCheck, TrendingUp, XCircle } from 'lucide-react'
import { getMockAttempts, type MockQuizAttempt } from '@/lib/mock-results'

export function QuizHistory() {
  const [attempts, setAttempts] = useState<MockQuizAttempt[]>([])

  useEffect(() => {
    const refresh = () => setAttempts(getMockAttempts())
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [])

  const average = useMemo(() => attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length) : 0, [attempts])
  const passRate = useMemo(() => attempts.length ? Math.round((attempts.filter((attempt) => attempt.passed).length / attempts.length) * 100) : 0, [attempts])

  return <section className="mt-10">
    <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Quiz performance</h2><p className="mt-1 text-sm text-[#6b7280]">Track your progress across completed attempts.</p></div><TrendingUp className="size-5 text-[#e86f00]" /></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3"><Metric label="Quizzes taken" value={String(attempts.length)} /><Metric label="Average score" value={`${average}%`} /><Metric label="Pass rate" value={`${passRate}%`} /></div>
    {attempts.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-[#d8d8d4] bg-white p-6 text-sm text-[#6b7280]">Your completed quiz attempts will appear here after you submit a quiz.</div> : <div className="mt-4 flex flex-col gap-3">{attempts.map((attempt) => <Link key={attempt.id} href={`/student/quizzes/${attempt.quizId}`} className="flex items-center gap-4 rounded-2xl border border-[#e7e7e7] bg-white p-4 transition hover:border-[#cfcfcf]"><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${attempt.passed ? 'bg-[#eaf7ef]' : 'bg-[#fff0ed]'}`}>{attempt.passed ? <CheckCircle2 className="size-5 text-[#237a43]" /> : <XCircle className="size-5 text-[#b42318]" />}</div><div className="min-w-0 flex-1"><p className="truncate font-bold">{attempt.quizTitle}</p><p className="mt-1 text-xs text-[#6b7280]">{new Date(attempt.submittedAt).toLocaleDateString()} · {attempt.earnedMarks}/{attempt.totalMarks} marks</p></div><div className="text-right"><p className="font-bold">{attempt.percentage}%</p><p className={`text-xs font-semibold ${attempt.passed ? 'text-[#237a43]' : 'text-[#b42318]'}`}>{attempt.passed ? 'Passed' : 'Not passed'}</p></div><ArrowRight className="size-4 text-[#9ca3af]" /></Link>)}</div>}
  </section>
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-[#e7e7e7] bg-white p-4"><ClipboardCheck className="size-4 text-[#e86f00]" /><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-[#6b7280]">{label}</p></div> }
