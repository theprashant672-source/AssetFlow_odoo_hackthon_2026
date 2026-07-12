import Link from "next/link";
import AssetFlowLogo from "@/app/components/assetflow/AssetFlowLogo";
import {
  IconArrowUpRight,
  IconChartBar,
  IconCheckCircle,
  IconClipboardList,
  IconPackage,
  IconShield,
  IconUsers,
  IconWrench,
} from "@/app/components/icons/Icons";

const capabilities = [
  { icon: IconPackage, title: "Asset register", text: "A single source of truth for equipment, ownership, and location." },
  { icon: IconClipboardList, title: "Controlled allocation", text: "Clear handovers, return dates, and request approvals." },
  { icon: IconWrench, title: "Maintenance workflow", text: "Keep repairs visible from request through completion." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f7] text-slate-900">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[#2a1824]" />
        <div className="absolute -left-32 top-24 -z-10 h-96 w-96 rounded-full bg-[#b878ab]/30 blur-3xl" />
        <div className="absolute right-0 top-0 -z-10 h-[560px] w-[42vw] rounded-bl-[10rem] bg-[#3c2234]" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <AssetFlowLogo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/65 md:flex">
            <a href="#platform" className="transition hover:text-white">Platform</a>
            <a href="#workflow" className="transition hover:text-white">Workflow</a>
            <a href="#security" className="transition hover:text-white">Access</a>
          </nav>
          <Link href="/login" className="rounded-xl border border-white/20 bg-white px-4 py-2.5 text-sm font-bold text-[#7d4272] transition hover:bg-odoo-100">
            Sign in
          </Link>
        </header>

        <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
              Asset & resource operations
            </div>
            <h1 className="mt-6 max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl">
              Know where every asset is. Act before work slows down.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              AssetFlow gives teams one dependable workspace for assets, allocations, bookings, maintenance, and audit history.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#b878ab] px-5 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_rgba(184,120,171,0.35)] transition hover:bg-[#c98cbd]">
                Open workspace <IconArrowUpRight size={16} />
              </Link>
              <a href="#platform" className="rounded-xl px-4 py-3 text-sm font-bold text-white/80 transition hover:text-white">Explore platform</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
              {["Role-based access", "Full activity history", "Operational alerts"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2"><IconCheckCircle size={16} className="text-[#dca9cf]" />{item}</span>
              ))}
            </div>
          </div>

          <div className="relative lg:pt-4">
            <div className="rounded-[2rem] border border-white/15 bg-white/95 p-3 shadow-[0_32px_90px_rgba(18,8,15,0.38)] sm:p-4">
              <div className="rounded-[1.5rem] bg-[#f7f4f6] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Operations overview</div>
                    <div className="mt-1 text-lg font-black text-slate-900">Today&apos;s workspace</div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#341d2d]" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Available" value="248" tone="text-emerald-700" />
                  <MiniStat label="Allocated" value="391" tone="text-[#9A528D]" />
                  <MiniStat label="Attention" value="12" tone="text-amber-700" />
                </div>
                <div className="mt-4 rounded-2xl bg-[#341d2d] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Asset activity</div>
                      <div className="mt-1 text-lg font-bold">Requests requiring review</div>
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold">8 open</span>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {["Laptop return due today", "Two maintenance requests", "Meeting room booking conflict"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3 py-2.5">
                        <span className={`h-2 w-2 rounded-full ${index === 0 ? "bg-amber-400" : index === 1 ? "bg-[#dca9cf]" : "bg-emerald-400"}`} />
                        <span className="text-sm text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-slate-400"><span>Lifecycle status</span><IconChartBar size={16} /></div>
                    <div className="mt-4 flex h-16 items-end gap-2">
                      {[38, 65, 44, 82, 58, 92, 72].map((height, index) => <span key={index} style={{ height: `${height}%` }} className="flex-1 rounded-t-md bg-[#9A528D] opacity-[0.35] last:opacity-100" />)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-odoo-100 bg-odoo-50 p-4">
                    <IconUsers size={20} className="text-[#9A528D]" />
                    <div className="mt-5 text-2xl font-black text-slate-900">18</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">Active teams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="platform" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A528D]">One connected system</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Built around the work your operations team already does.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-600">Keep everyday tasks simple for employees and give administrators the context they need to make decisions quickly.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className={`rounded-2xl border p-6 ${index === 1 ? "border-[#9A528D] bg-[#341d2d] text-white" : "border-slate-200 bg-white"}`}>
              <div className={`inline-flex rounded-xl p-3 ${index === 1 ? "bg-white/10 text-white" : "bg-odoo-50 text-[#9A528D]"}`}><Icon size={20} /></div>
              <h3 className={`mt-6 text-xl font-black ${index === 1 ? "text-white" : "text-slate-900"}`}>{title}</h3>
              <p className={`mt-3 text-sm leading-6 ${index === 1 ? "text-white/65" : "text-slate-600"}`}>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-10">
          <div className="rounded-2xl bg-[#f6ecf4] p-7 sm:p-9">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A528D]">Simple workflow</div>
            <h2 className="mt-3 max-w-md text-3xl font-black tracking-tight text-slate-950">From request to record, every handoff stays visible.</h2>
            <div className="mt-8 grid gap-4">
              {["Register and classify assets", "Allocate, book, or send for maintenance", "Review status and close the loop"].map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-xl bg-white px-4 py-3.5 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#341d2d] text-xs font-black text-white">0{index + 1}</span>
                  <span className="font-bold text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div id="security" className="flex flex-col justify-center">
            <div className="inline-flex w-fit rounded-xl bg-[#341d2d] p-3 text-white"><IconShield size={22} /></div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950">The right information for the right role.</h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">Founder, admin, department head, manager, and employee views are designed around real responsibilities—not one oversized dashboard for everyone.</p>
            <Link href="/login" className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-bold text-[#9A528D]">Sign in to your workspace <IconArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div><AssetFlowLogo /><p className="mt-2 text-sm text-slate-500">Asset and resource operations, organized.</p></div>
        <Link href="/login" className="text-sm font-bold text-[#9A528D]">Go to sign in</Link>
      </footer>
    </main>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</div><div className={`mt-1 text-2xl font-black ${tone}`}>{value}</div></div>;
}
