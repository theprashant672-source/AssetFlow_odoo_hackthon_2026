import Link from "next/link";
import AssetFlowLogo from "@/app/components/assetflow/AssetFlowLogo";
import { IconArrowUpRight, IconBell, IconChartBar, IconPackage, IconUsers, IconWrench } from "@/app/components/icons/Icons";

const highlights = [
  { label: "Asset visibility", value: "12,480", icon: IconPackage },
  { label: "Teams onboarded", value: "118", icon: IconUsers },
  { label: "Maintenance flow", value: "98.4%", icon: IconWrench },
  { label: "Executive insights", value: "Live", icon: IconChartBar },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[rgba(248,250,252,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <AssetFlowLogo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#platform" className="transition hover:text-[#5b3df5]">Platform</a>
            <a href="#roles" className="transition hover:text-[#5b3df5]">Roles</a>
            <a href="#security" className="transition hover:text-[#5b3df5]">Security</a>
            <a href="#contact" className="transition hover:text-[#5b3df5]">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="inline-flex rounded-full bg-[#5b3df5] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_28px_rgba(91,61,245,0.22)] transition hover:brightness-110">
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(91,61,245,0.18),_transparent_32%),radial-gradient(circle_at_85%_20%,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#eef2ff_0%,_#f8fafc_55%,_#f8fafc_100%)]" />
        <div className="mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#5b3df5]/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#5b3df5] shadow-sm backdrop-blur">
              Enterprise asset intelligence
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              One premium control room for every asset, team, and approval.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              AssetFlow helps organizations manage laptops, vehicles, furniture, meeting rooms, maintenance,
              bookings, and audit-ready operations with role-based access for Founder, Admin, Department Head,
              Asset Manager, and Employee.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl bg-[#5b3df5] px-5 py-3.5 text-sm font-bold text-white shadow-[0_18px_36px_rgba(91,61,245,0.25)] transition hover:brightness-110">
                Enter workspace
                <IconArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="glass-panel soft-shadow rounded-[1.5rem] p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-500">{item.label}</div>
                      <div className="rounded-xl bg-[#eef2ff] p-2 text-[#5b3df5]">
                        <Icon size={16} />
                      </div>
                    </div>
                    <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">{item.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <div className="glass-panel soft-shadow w-full max-w-xl rounded-[2.5rem] p-6 sm:p-8">
              <div className="rounded-[2rem] bg-[#0f172a] p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.45)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Role aware</div>
                    <div className="mt-2 text-3xl font-black">Founder, Admin, Head, Manager, Employee</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <AssetFlowLogo size={40} compact />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <MiniCard title="Public company page" desc="Accessible without login for brand trust and onboarding." />
                  <MiniCard title="Role-based routes" desc="Dashboard and menus change by login role automatically." />
                  <MiniCard title="Email / phone login" desc="Password or OTP flow can plug into backend later." />
                  <MiniCard title="Premium UI" desc="Soft shadows, glass panels, and clean enterprise spacing." />
                </div>

                <div id="security" className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/8 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <IconBell size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/45">Upcoming</div>
                      <p className="mt-1 text-sm leading-6 text-white/70">
                        Backend OTP and company onboarding API hooks will attach to this frontend without redesign.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <FeatureCard title="Asset control" description="Register, allocate, transfer, and audit every company asset." />
          <FeatureCard title="Bookings & maintenance" description="Meeting rooms, vehicles, projectors, and repair requests." />
          <FeatureCard title="Reports & analytics" description="Leadership-ready dashboards with role scoped visibility." />
        </div>
      </section>

      <section id="roles" className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-5">
          {[
            "Founder / Super Admin",
            "Admin",
            "Department Head",
            "Asset Manager",
            "Employee",
          ].map((role) => (
            <div key={role} className="rounded-[1.5rem] bg-slate-50 p-4 text-center">
              <div className="text-sm font-bold text-slate-900">{role}</div>
              <div className="mt-2 text-xs leading-6 text-slate-500">
                Role-specific menus, dashboard widgets, and permissions.
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-sm font-black tracking-[0.28em] text-slate-900">ASSETFLOW</div>
            <p className="mt-2 text-sm text-slate-500">Enterprise Asset & Resource Management System</p>
          </div>
          <div className="text-sm text-slate-500">
            Built for premium hackathon demos with a clean public company page and role-based access.
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-panel soft-shadow rounded-[1.8rem] p-6">
      <div className="text-lg font-black text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
      <div className="text-sm font-bold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  );
}
