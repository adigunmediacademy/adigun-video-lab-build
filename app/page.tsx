'use client'

import Link from 'next/link'
import {
  ArrowRight,
  AudioLines,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  Clapperboard,
  Clapperboard as Film,
  Layers3,
  Lightbulb,
  Menu,
  Mic2,
  MonitorPlay,
  PenLine,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Video,
  WandSparkles,
  X,
} from 'lucide-react'
import { useState } from 'react'

const learnItems = [
  ['Storytelling', Lightbulb], ['Scriptwriting', PenLine], ['AI Visual Creation', WandSparkles],
  ['AI Video Generation', Video], ['AI Voice', Mic2], ['Video Editing', Film],
  ['Publishing', MonitorPlay], ['Audience Growth', TrendingUp], ['Monetization', BarChart3],
] as const
const pipeline = ['Idea', 'Story', 'Script', 'Visuals', 'Voice', 'Edit', 'Publish', 'Grow', 'Monetize']
const modules = ['AI Creator Foundation', 'Storytelling & Emotional Connection', 'Scriptwriting', 'AI Visual Creation', 'AI Video Generation', 'AI Voice & Sound', 'Video Editing', 'Publishing & Audience Growth', 'Monetization']
const tools = [
  ['ChatGPT', 'IDEATION', 'Develop ideas, outlines and scripts faster.', Bot],
  ['Google Flow', 'VIDEO GENERATION', 'Turn direction into cinematic visual sequences.', Sparkles],
  ['ElevenLabs', 'AI VOICE', 'Create expressive voiceovers that carry emotion.', AudioLines],
  ['CapCut', 'EDITING', 'Bring every scene, beat and sound together.', Clapperboard],
  ['Canva', 'DESIGN', 'Package your content for a consistent visual world.', Layers3],
] as const

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="sticky top-0 z-40 border-b border-[#e7e7e7]/80 bg-white/95 backdrop-blur-sm">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight" onClick={() => setOpen(false)}>
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adigun%20Video%20Lab%20Emblem-TMQFob4TY3lw2DvbhGInLwV0TZKhsE.png" alt="Adigun Video Lab" className="size-9 rounded-xl object-cover" />
        <span>Adigun <span className="text-[#e86f00]">Video Lab</span></span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b7280] md:flex">
        <Link className="transition-colors hover:text-[#151515]" href="/program">Program</Link>
        <Link className="transition-colors hover:text-[#151515]" href="/tools">AI Tools</Link>
        <Link className="transition-colors hover:text-[#151515]" href="/pricing">Pricing</Link>
      </nav>
      <div className="hidden items-center gap-3 md:flex"><Link className="px-3 py-2 text-sm font-medium" href="#footer">Login</Link><Link className="rounded-full bg-[#151515] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="/apply">Apply to Join <ArrowRight className="ml-1 inline size-4" /></Link></div>
      <button aria-label={open ? 'Close menu' : 'Open menu'} className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav className="flex flex-col gap-1 border-t border-[#e7e7e7] bg-white px-5 py-4 md:hidden"><Link className="py-3" href="/program" onClick={() => setOpen(false)}>Program</Link><Link className="py-3" href="/tools" onClick={() => setOpen(false)}>AI Tools</Link><Link className="py-3" href="/pricing" onClick={() => setOpen(false)}>Pricing</Link><Link className="mt-2 rounded-full bg-[#151515] px-5 py-3 text-center font-semibold text-white" href="/apply">Apply to Join</Link></nav>}
  </header>
}
function Footer() { return <footer id="footer" className="bg-[#151515] px-5 py-12 text-white lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:justify-between"><div><div className="flex items-center gap-2.5 font-semibold"><span className="flex size-8 items-center justify-center rounded-lg bg-[#dfff4f] text-[#151515]"><Play className="size-3 fill-current" /></span>Adigun Video Lab</div><p className="mt-4 max-w-xs text-sm text-white/55">Learn. Create. Publish. Monetize.</p></div><div className="grid grid-cols-2 gap-x-14 gap-y-4 text-sm text-white/65"><Link href="/program" className="hover:text-[#dfff4f]">Program</Link><Link href="/tools" className="hover:text-[#dfff4f]">AI Tools</Link><Link href="/pricing" className="hover:text-[#dfff4f]">Pricing</Link><Link href="/apply" className="hover:text-[#dfff4f]">Apply</Link><a href="mailto:hello@adigunvideolab.com" className="hover:text-[#dfff4f]">Contact</a></div></div><div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-5 text-xs text-white/35">© 2026 Adigun Video Lab. Built for the next generation of storytellers.</div></footer> }

export default function Page() { return <><Header /><main>
  <section className="overflow-hidden bg-[#f4ffd0] px-5 pb-16 pt-16 lg:px-8 lg:pb-28 lg:pt-24"><div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_.98fr]"><div><p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#e86f00]"><span className="size-2 rounded-full bg-[#ff8a00]" /> Practical AI video education</p><h1 className="max-w-3xl text-5xl font-bold leading-[.98] tracking-[-.055em] text-[#151515] sm:text-6xl lg:text-7xl">Create AI Videos That Tell Stories <span className="text-[#e86f00]">People Feel.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#6b7280]">Learn how to develop stories, write scripts, create AI visuals, generate voices, edit videos and build a content system designed for publishing and growth.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/apply" className="rounded-full bg-[#151515] px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5">Apply to Join <ArrowRight className="ml-2 inline size-4" /></Link><Link href="/program" className="rounded-full border border-[#151515]/20 px-6 py-3.5 font-semibold text-[#151515] hover:border-[#151515]">Explore the Program</Link></div><p className="mt-7 text-sm font-medium text-[#6b7280]">Learn. Create. Publish. Monetize.</p></div><div className="relative mx-auto w-full max-w-lg"><div className="relative aspect-[.92] overflow-hidden rounded-[2rem] bg-[#151515] p-5 shadow-2xl shadow-[#e86f00]/15"><div className="flex items-center justify-between text-xs text-white/50"><span>THE STORY ENGINE</span><span className="flex items-center gap-1 text-[#dfff4f]"><span className="size-1.5 rounded-full bg-[#dfff4f]" /> LIVE</span></div><div className="absolute inset-x-5 bottom-5 top-16 flex flex-col justify-between"><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#dfff4f] p-4 text-[#151515]"><Lightbulb className="size-6" /><p className="mt-12 text-sm font-bold">A feeling<br />worth sharing.</p></div><div className="rounded-2xl bg-[#ff8a00] p-4 text-[#151515]"><Video className="size-6" /><p className="mt-12 text-sm font-bold">A visual<br />that stays.</p></div></div><div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm"><div className="mb-3 flex items-center justify-between text-xs text-white/45"><span>PRODUCTION PIPELINE</span><span>09 / 09</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-[#dfff4f]" /></div><p className="mt-3 text-sm text-white/80">From first spark to published story.</p></div></div></div><div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-xl sm:block"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#f4ffd0]"><Target className="size-4 text-[#e86f00]" /></span><div><p className="text-xs text-[#6b7280]">Your next story</p><p className="text-sm font-bold">Starts with an idea.</p></div></div></div></div></div></section>
  <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="section-kicker">The full stack</p><h2 className="section-title">Everything you need to make content with meaning.</h2><p className="section-copy">Build a creative practice that combines story, technology and consistency — without getting lost in the tools.</p></div><div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-9 lg:gap-5">{learnItems.map(([label, Icon]) => <div key={label} className="group"><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#f4ffd0] text-[#e86f00] transition-colors group-hover:bg-[#dfff4f]"><Icon className="size-5" /></div><p className="text-sm font-semibold leading-5">{label}</p></div>)}</div></div></section>
  <section className="bg-[#151515] px-5 py-20 text-white lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div className="max-w-xl"><p className="section-kicker text-[#dfff4f]">A repeatable process</p><h2 className="section-title text-white">The production pipeline.</h2></div><p className="max-w-sm text-sm leading-6 text-white/55">Great videos are not accidents. Learn the sequence that turns a blank page into a story people want to watch.</p></div><div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-9">{pipeline.map((item, index) => <div key={item} className="bg-[#151515] p-5 lg:aspect-square"><p className="text-xs font-bold text-[#ff9a1f]">0{index + 1}</p><p className="mt-8 text-lg font-semibold lg:mt-16">{item}</p></div>)}</div></div></section>
  <section id="program" className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="section-kicker">The core program</p><h2 className="section-title">AI Video Production Accelerator</h2><p className="section-copy">A practical program designed to help beginners learn the complete AI-assisted video production workflow.</p><Link href="/program" className="mt-8 inline-flex items-center font-semibold text-[#e86f00]">See the program <ArrowRight className="ml-2 size-4" /></Link></div><div className="divide-y divide-[#e7e7e7] border-y border-[#e7e7e7]">{modules.map((m, i) => <div key={m} className="flex items-center gap-5 py-4"><span className="font-mono text-xs text-[#e86f00]">0{i + 1}</span><span className="font-medium">{m}</span><Check className="ml-auto size-4 text-[#e86f00]" /></div>)}</div></div></section>
  <section className="bg-[#f4ffd0] px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="section-kicker">Your creator toolkit</p><h2 className="section-title">AI toolbox preview.</h2></div><Link href="/tools" className="font-semibold text-[#e86f00]">Explore all tools <ArrowRight className="ml-2 inline size-4" /></Link></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{tools.map(([name, category, description, Icon]) => <div key={name} className="flex flex-col border border-[#151515]/10 bg-white p-5 transition-transform hover:-translate-y-1"><Icon className="size-6 text-[#e86f00]" /><p className="mt-10 text-lg font-bold">{name}</p><p className="mt-2 text-[10px] font-bold tracking-[.12em] text-[#e86f00]">{category}</p><p className="mt-3 text-sm leading-6 text-[#6b7280]">{description}</p><a className="mt-7 text-sm font-semibold" href="#footer">Open Tool <ArrowRight className="ml-1 inline size-3" /></a></div>)}</div></div></section>
  <section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="section-kicker">Simple by design</p><h2 className="section-title">How it works.</h2></div><div className="mt-12 grid gap-8 md:grid-cols-4">{[['01','Apply','Tell us what you want to create.'],['02','Learn','Follow the guided curriculum.'],['03','Create','Complete practical projects.'],['04','Publish','Turn your skills into real content.']].map(([num,title,copy]) => <div key={num} className="border-t-2 border-[#dfff4f] pt-5"><p className="font-mono text-sm text-[#e86f00]">{num}</p><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6b7280]">{copy}</p></div>)}</div></div></section>
  <section className="px-5 pb-20 lg:px-8 lg:pb-28"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 bg-[#dfff4f] p-8 sm:p-12 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-[.15em] text-[#e86f00]">Start your next chapter</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to tell better stories?</h2><p className="mt-3 max-w-lg text-[#151515]/65">Join a practical learning experience built for creators who want to turn ideas into impact.</p></div><Link href="/apply" className="shrink-0 rounded-full bg-[#151515] px-6 py-3.5 font-semibold text-white">Apply to Join <ArrowRight className="ml-2 inline size-4" /></Link></div></section>
</main><Footer /></> }

export const dynamic = 'force-static'
