'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Clock3, FileText, PlayCircle, ClipboardCheck } from 'lucide-react'
import { QuizHistory } from '@/components/student/quiz-history'
import { Certificates } from '@/components/student/certificates'

const courses = [
  { title: 'Video Editing Foundations', meta: '6 lessons · 2h 40m', progress: 72, tone: 'bg-[#fff1dc]' },
  { title: 'Storytelling for Social Video', meta: '5 lessons · 1h 55m', progress: 28, tone: 'bg-[#e8f3ff]' },
]

export default function StudentDashboard() {
  return <main className="min-h-screen bg-[#f7f7f5] text-[#151515]">
    <header className="border-b border-[#e7e7e7] bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8"><Link href="/" className="font-bold tracking-tight">Adigun <span className="text-[#e86f00]">Video Lab</span></Link><div className="flex items-center gap-3"><span className="hidden text-sm text-[#6b7280] sm:inline">Welcome back, Ada</span><div className="flex size-9 items-center justify-center rounded-full bg-[#151515] text-sm font-bold text-white">A</div></div></div></header>
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-[#e86f00]">Student workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Keep building your story.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#6b7280]">Pick up where you left off, submit your next assignment, and keep your creative momentum going.</p></div><Link href="/program" className="inline-flex items-center gap-2 self-start rounded-full bg-[#151515] px-4 py-2.5 text-sm font-semibold text-white sm:self-auto">Browse program <ArrowRight className="size-4" /></Link></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3"><Stat icon={BookOpen} value="2" label="Courses enrolled" /><Stat icon={CheckCircle2} value="7" label="Lessons completed" /><Stat icon={Clock3} value="4h 35m" label="Learning time" /></div>
      <section className="mt-10"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Continue learning</h2><Link href="/student/courses" className="text-sm font-semibold text-[#e86f00]">View all</Link></div><div className="mt-4 grid gap-4 lg:grid-cols-2">{courses.map(course => <Link href="/student/courses/video-editing-foundations" key={course.title} className="group rounded-2xl border border-[#e7e7e7] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cfcfcf]"><div className={`flex h-28 items-center justify-center rounded-xl ${course.tone}`}><PlayCircle className="size-10 text-[#151515]" /></div><div className="mt-5 flex items-start justify-between gap-4"><div><h3 className="font-bold group-hover:text-[#e86f00]">{course.title}</h3><p className="mt-1 text-sm text-[#6b7280]">{course.meta}</p></div><span className="text-sm font-bold">{course.progress}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eeeeeb]"><div className="h-full rounded-full bg-[#e86f00]" style={{ width: `${course.progress}%` }} /></div></Link>)}</div></section>
      <section className="mt-10"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Ready to test your skills?</h2><span className="text-sm text-[#6b7280]">2 available</span></div><Link href="/student/quizzes/1" className="mt-4 flex items-center gap-4 rounded-2xl border border-[#e7e7e7] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cfcfcf]"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1dc]"><ClipboardCheck className="size-5 text-[#e86f00]" /></div><div className="min-w-0 flex-1"><h3 className="font-bold">Editing Fundamentals</h3><p className="mt-1 text-sm text-[#6b7280]">3 questions · 20 min · 70% to pass</p></div><ArrowRight className="size-4 text-[#9ca3af]" /></Link></section>
      <QuizHistory />
      <Certificates />
      <section className="mt-10"><h2 className="text-xl font-bold">Your next steps</h2><div className="mt-4 grid gap-3 md:grid-cols-2"><Action href="/student/assignments" icon={FileText} title="Submit an assignment" text="Your first social video brief is ready for review." /><Action href="/tools" icon={PlayCircle} title="Explore creator tools" text="Find the right tools to move your idea forward." /></div></section>
    </div>
  </main>
}

function Stat({ icon: Icon, value, label }: { icon: typeof BookOpen; value: string; label: string }) { return <div className="rounded-2xl border border-[#e7e7e7] bg-white p-5"><Icon className="size-5 text-[#e86f00]" /><p className="mt-4 text-2xl font-bold">{value}</p><p className="mt-1 text-sm text-[#6b7280]">{label}</p></div> }
function Action({ href, icon: Icon, title, text }: { href: string; icon: typeof FileText; title: string; text: string }) { return <Link href={href} className="flex items-start gap-4 rounded-2xl border border-[#e7e7e7] bg-white p-5 hover:border-[#cfcfcf]"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1dc]"><Icon className="size-5 text-[#e86f00]" /></div><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#6b7280]">{text}</p></div><ArrowRight className="ml-auto size-4 text-[#9ca3af]" /></Link> }
