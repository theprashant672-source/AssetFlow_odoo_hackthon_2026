"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AssetFlowLogo from "@/app/components/assetflow/AssetFlowLogo";
import { IconEye, IconEyeOff, IconLock, IconMail, IconShield, IconSparkles } from "@/app/components/icons/Icons";

const ADMIN_EMAIL = "superadmin@oddo.com";
const ADMIN_PASSWORD = "ODDO@123";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; samesite=lax`;
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already signed in as admin? Go straight to the admin dashboard.
  useEffect(() => {
    const hasSession = document.cookie.includes("assetflow_session=");
    const isAdmin = /assetflow_role=(admin|founder)/.test(document.cookie);
    if (hasSession && isAdmin) router.replace("/admin/dashboard");
  }, [router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("This portal is for the Admin account only. Use the credentials shown on the left.");
      return;
    }
    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password. Use the admin password shown on the left card.");
      return;
    }
    setSubmitting(true);
    setCookie("assetflow_session", "demo-session");
    setCookie("assetflow_role", "admin");
    setCookie("assetflow_identity", ADMIN_EMAIL);
    setCookie("assetflow_auth_method", "password");
    setCookie("assetflow_company", "ODDO Technologies Pvt. Ltd.");
    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7fb] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(154,82,141,0.16),_transparent_32%),radial-gradient(circle_at_85%_15%,_rgba(184,120,171,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#f6ecf4_100%)]" />

      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
        {/* Left: branding + credentials */}
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/70 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#9A528D]/10 blur-3xl" />
          <div className="absolute bottom-4 right-6 h-52 w-52 rounded-full bg-[#b878ab]/15 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <AssetFlowLogo />
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#9A528D]/30 hover:text-[#9A528D]"
            >
              Employee login
            </Link>
          </div>

          <div className="relative z-10 mt-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9A528D]/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A528D] shadow-sm">
              <IconShield size={14} />
              Admin portal
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Control the whole organization from one place.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              The Admin sets up departments and asset categories, manages the employee directory,
              promotes Department Heads and Asset Managers, runs audit cycles, and sees
              organization-wide analytics.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Organization", value: "Full setup" },
                { label: "Roles", value: "Promote here" },
                { label: "Analytics", value: "Org-wide" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-medium text-slate-500">{item.label}</div>
                  <div className="mt-2 text-xl font-black tracking-tight text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Admin credentials — intentionally visible for the demo */}
            <div className="mt-6 rounded-[1.6rem] border-2 border-[#9A528D]/25 bg-white/90 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Admin demo credentials
                </div>
                <span className="rounded-full bg-[#f6ecf4] px-3 py-1 text-xs font-semibold text-[#9A528D]">
                  Demo only
                </span>
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => { setEmail(ADMIN_EMAIL); setError(""); }}
                  className="rounded-[1.1rem] border border-slate-200 bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[#9A528D]/30 hover:shadow-md"
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Email</div>
                  <div className="mt-1 break-all text-sm font-bold text-slate-900">{ADMIN_EMAIL}</div>
                </button>
                <button
                  type="button"
                  onClick={() => { setPassword(ADMIN_PASSWORD); setError(""); }}
                  className="rounded-[1.1rem] border border-slate-200 bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[#9A528D]/30 hover:shadow-md"
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Password</div>
                  <div className="mt-1 font-mono text-sm font-black tracking-[0.12em] text-[#9A528D]">{ADMIN_PASSWORD}</div>
                </button>
              </div>
              <p className="mt-2.5 text-xs text-slate-500">Click a card to autofill the form.</p>
            </div>
          </div>
        </section>

        {/* Right: login card */}
        <section className="relative flex items-center justify-center overflow-hidden rounded-[2.4rem] border border-[#2b1629]/15 bg-[#221124] px-4 py-6 text-white shadow-[0_30px_100px_rgba(15,23,42,0.36)] sm:px-6 lg:px-8">
          <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-[#9A528D]/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#b878ab]/15 blur-3xl" />

          <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">Restricted access</div>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Admin sign in</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">
                  Sign in with the admin credentials to open Organization Setup, audits and org-wide reports.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <AssetFlowLogo size={40} compact />
              </div>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={submit}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-white/80">Admin email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <IconMail size={18} className="text-white/55" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    placeholder={ADMIN_EMAIL}
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-white/80">Password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <IconLock size={18} className="text-white/55" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    placeholder={`Use ${ADMIN_PASSWORD}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="rounded-full p-1 text-white/55 transition hover:bg-white/10 hover:text-white"
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-white/10 bg-white/6 px-3.5 py-2.5 text-xs text-white/60">
                <span className="inline-flex items-center gap-2">
                  <IconSparkles size={14} />
                  Password: <span className="font-mono font-black tracking-[0.12em] text-white">{ADMIN_PASSWORD}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPassword(ADMIN_PASSWORD)}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold text-white/80 transition hover:bg-white/20"
                >
                  Autofill
                </button>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-300/40 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-[#9A528D] px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_36px_rgba(154,82,141,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Opening admin workspace..." : "Login as Admin"}
              </button>

              <p className="text-center text-xs text-white/45">
                Not an admin? <Link href="/login" className="font-semibold text-white/75 underline transition hover:text-white">Use the employee login</Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
