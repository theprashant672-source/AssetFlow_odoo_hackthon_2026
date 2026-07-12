"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AssetFlowLogo from "@/app/components/assetflow/AssetFlowLogo";
import { ROLE_LABELS, ROLE_HOME, type AssetFlowRole } from "@/app/lib/assetflow-roles";
import { apiLogin, apiSendOtp, apiVerifyOtp } from "@/app/lib/api";
import { IconEye, IconEyeOff, IconLock, IconMail, IconPhone, IconSparkles } from "@/app/components/icons/Icons";

const loginSchema = z.object({
  method: z.enum(["password", "otp"]),
  identifier: z.string().min(3, "Enter email or phone."),
  secret: z.string().min(4, "Enter a valid password or OTP."),
  role: z.enum(["founder", "admin", "head", "manager", "employee"]),
});

type LoginValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    email: "superadmin@oddo.com",
    role: "founder" as AssetFlowRole,
    title: "Founder",
    note: "Top access",
  },
  {
    email: "manager@oddo.com",
    role: "manager" as AssetFlowRole,
    title: "Manager",
    note: "Team control",
  },
  {
    email: "tl@oddo.com",
    role: "head" as AssetFlowRole,
    title: "TL",
    note: "Task lead",
  },
  {
    email: "itservice@oddo.com",
    role: "manager" as AssetFlowRole,
    title: "IT Service",
    note: "Support ops",
  },
  {
    email: "employee@oddo.com",
    role: "employee" as AssetFlowRole,
    title: "Employee",
    note: "Personal workspace",
  },
] as const;

const DEMO_PASSWORD = "ODDO@123";

const ROLE_SHORT_LABELS: Record<AssetFlowRole, string> = {
  founder: "Founder",
  admin: "Admin",
  head: "TL",
  manager: "Manager",
  employee: "Employee",
};

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; samesite=lax`;
}

// The demo backend does not ship auth routes; fall back to local demo auth
// when the API is missing or unreachable so the frontend stays fully usable.
function isBackendUnavailable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /route not found|request failed \(404\)|failed to fetch|network|unexpected response/i.test(message);
}

const LOCAL_OTP_CHALLENGE = "local-demo";

export default function LoginPage() {
  const router = useRouter();
  const [showSecret, setShowSecret] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpChallengeId, setOtpChallengeId] = useState("");
  const [otpPreview, setOtpPreview] = useState("");
  const [companyHint, setCompanyHint] = useState("ODDO Technologies Pvt. Ltd.");
  const [statusMessage, setStatusMessage] = useState("");
  const [demoHint, setDemoHint] = useState<typeof DEMO_ACCOUNTS[number] | null>(DEMO_ACCOUNTS[1]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      method: "password",
      identifier: "superadmin@oddo.com",
      secret: DEMO_PASSWORD,
      role: "founder",
    },
  });

  const method = useWatch({ control, name: "method" });
  const role = useWatch({ control, name: "role" });
  const identifier = useWatch({ control, name: "identifier" });
  const previewRole = (role ?? "admin") as AssetFlowRole;
  const resolvedAccount = useMemo(
    () => DEMO_ACCOUNTS.find((item) => item.email.toLowerCase() === (identifier ?? "").trim().toLowerCase()) ?? null,
    [identifier]
  );

  useEffect(() => {
    if (method === "otp") return;
    setOtpSent(false);
    setOtpChallengeId("");
    setOtpPreview("");
    setStatusMessage("");
  }, [method]);

  useEffect(() => {
    const detected = resolvedAccount;
    setDemoHint(detected);
    setValue("role", detected?.role ?? "founder", { shouldDirty: true, shouldValidate: true });
  }, [resolvedAccount, setValue]);

  const applySession = (selectedRole: AssetFlowRole) => {
    setCookie("assetflow_session", "demo-session");
    setCookie("assetflow_role", selectedRole);
    setCookie("assetflow_identity", identifier ?? "");
    setCookie("assetflow_auth_method", method);
    setCookie("assetflow_company", companyHint);
    router.push(ROLE_HOME[selectedRole]);
  };

  const sendOtp = async () => {
    setStatusMessage("");
    if (method !== "otp") {
      setStatusMessage("Switch to OTP mode to generate and preview an OTP.");
      return;
    }
    if (!identifier?.trim()) {
      setStatusMessage("Enter email or phone first.");
      setValue("secret", "");
      return;
    }

    try {
      const response = await apiSendOtp({ identifier, role });
      setOtpSent(true);
      setOtpChallengeId(response.challengeId);
      setOtpPreview(response.otp);
      setValue("secret", response.otp, { shouldValidate: true, shouldDirty: true });
      setStatusMessage(`OTP generated. It is shown below for setup and will expire at ${new Date(response.expiresAt).toLocaleTimeString()}.`);
    } catch (error) {
      if (isBackendUnavailable(error)) {
        const localOtp = String(Math.floor(100000 + Math.random() * 900000));
        setOtpSent(true);
        setOtpChallengeId(LOCAL_OTP_CHALLENGE);
        setOtpPreview(localOtp);
        setValue("secret", localOtp, { shouldValidate: true, shouldDirty: true });
        setStatusMessage("Demo OTP generated locally. It is shown below and prefilled.");
        return;
      }
      setOtpSent(false);
      setOtpChallengeId("");
      setOtpPreview("");
      setStatusMessage(error instanceof Error ? error.message : "OTP could not be generated.");
    }
  };

  const onSubmit = async (values: LoginValues) => {
    if (values.method === "otp") {
      if (!otpChallengeId) {
        setStatusMessage("Please send OTP first.");
        return;
      }

      if (otpChallengeId === LOCAL_OTP_CHALLENGE) {
        if (values.secret.trim() === otpPreview) {
          applySession(values.role);
        } else {
          setStatusMessage("Invalid OTP. Use the demo OTP shown below.");
        }
        return;
      }

      try {
        await apiVerifyOtp({
          identifier: values.identifier,
          role: values.role,
          challengeId: otpChallengeId,
          otp: values.secret,
        });
        applySession(values.role);
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "OTP verification failed.");
      }
      return;
    }

    try {
      await apiLogin(values.identifier, values.secret);
      applySession(values.role);
    } catch (error) {
      if (isBackendUnavailable(error)) {
        if (values.secret === DEMO_PASSWORD) {
          applySession(values.role);
          return;
        }
        setStatusMessage(`Demo mode: use password ${DEMO_PASSWORD}.`);
        return;
      }
      setStatusMessage(error instanceof Error ? error.message : "Login failed.");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7fb] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(154,82,141,0.16),_transparent_32%),radial-gradient(circle_at_85%_15%,_rgba(184,120,171,0.12),_transparent_28%),radial-gradient(circle_at_70%_85%,_rgba(154,82,141,0.08),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#f6ecf4_100%)]" />
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-6">
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/70 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#9A528D]/10 blur-3xl" />
          <div className="absolute bottom-4 right-6 h-52 w-52 rounded-full bg-[#9A528D]/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <AssetFlowLogo />
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#9A528D]/30 hover:text-[#9A528D]">
              Company setup
            </Link>
          </div>

          <div className="relative z-10 mt-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9A528D]/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A528D] shadow-sm">
              <IconSparkles size={14} />
              ODDO access control
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Secure access for every role in one polished workspace.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Login works with email and password, or OTP for temporary access. Use the demo emails below to see how the workspace routes by role.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Login style", value: "Email first" },
                { label: "Routing", value: "Auto role" },
                { label: "Access", value: "Password + OTP" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-medium text-slate-500">{item.label}</div>
                  <div className="mt-2 text-xl font-black tracking-tight text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <FeatureChip title="Roles" desc="Founder, Manager, TL, IT Service, Employee." />
              <FeatureChip title="Manager flow" desc="Manager decides employee access." />
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-white/85 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Demo accounts</div>
                  <div className="mt-1 text-sm text-slate-600">Click any card to autofill the email.</div>
                </div>
                <span className="rounded-full bg-[#f6ecf4] px-3 py-1 text-xs font-semibold text-[#9A528D]">Demo only</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => {
                      setValue("identifier", account.email, { shouldDirty: true, shouldValidate: true });
                      setValue("role", account.role, { shouldDirty: true, shouldValidate: true });
                      setDemoHint(account);
                      setStatusMessage("");
                    }}
                    className={`rounded-[1rem] border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      demoHint?.email === account.email ? "border-[#9A528D]/30 bg-[#9A528D]/6" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-bold text-slate-900">{account.title}</div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {account.title === "Manager" ? "control" : account.title === "TL" ? "lead" : account.title === "IT Service" ? "support" : "demo"}
                      </span>
                    </div>
                    <div className="mt-1 break-all text-sm text-slate-600">{account.email}</div>
                    <div className="mt-1 text-xs font-medium text-slate-500">{account.note}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden rounded-[2.4rem] border border-[#2b1629]/15 bg-[#221124] px-4 py-6 text-white shadow-[0_30px_100px_rgba(15,23,42,0.36)] sm:px-6 lg:px-8">
          <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-[#9A528D]/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#b878ab]/15 blur-3xl" />
          <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">Welcome back</div>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Sign in to ODDO</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">
                  Use the demo email and password below, or switch to OTP to preview the temporary code.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <AssetFlowLogo size={40} compact />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/6 p-1">
              <button
                type="button"
                onClick={() => setValue("method", "password")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  method === "password" ? "bg-white text-slate-900 shadow-sm" : "text-white/65"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setValue("method", "otp")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  method === "otp" ? "bg-white text-slate-900 shadow-sm" : "text-white/65"
                }`}
              >
                OTP
              </button>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-white/80">Email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <IconMail size={18} className="text-white/55" />
                  <input
                    {...register("identifier")}
                    type="email"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    placeholder="admin@oddo.com"
                  />
                </div>
                {errors.identifier && <span className="text-xs font-medium text-[#fca5a5]">{errors.identifier.message}</span>}
              </label>

              <input type="hidden" {...register("role")} />

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-white/80">{method === "otp" ? "OTP code" : "Password"}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <IconLock size={18} className="text-white/55" />
                  <input
                    {...register("secret")}
                    type={showSecret ? "text" : method === "otp" ? "text" : "password"}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                    placeholder={method === "otp" ? "Enter OTP" : `Use ${DEMO_PASSWORD} for demo`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret((current) => !current)}
                    className="rounded-full p-1 text-white/55 transition hover:bg-white/10 hover:text-white"
                  >
                    {showSecret ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
                {errors.secret && <span className="text-xs font-medium text-[#fca5a5]">{errors.secret.message}</span>}
              </label>

              <div className="flex items-center justify-between gap-3 text-sm text-white/65">
                <button
                  type="button"
                  onClick={sendOtp}
                  className="font-semibold text-white/80 transition hover:text-white"
                >
                  {method === "otp" ? "Send OTP" : "Need OTP preview?"}
                </button>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.25em]">
                  <IconPhone size={12} />
                  {otpSent ? "OTP ready" : "Email login"}
                </span>
              </div>

              <div className="rounded-[1.1rem] border border-white/10 bg-white/6 px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">Detected role</div>
                    <div className="mt-1 text-sm font-bold text-white">{ROLE_SHORT_LABELS[previewRole]}</div>
                  </div>
                  <div className="text-right text-xs text-white/55">
                    {demoHint ? (
                      <>
                        <div>{demoHint.email}</div>
                        <div>{demoHint.title}</div>
                      </>
                    ) : (
                      <div>Demo email required</div>
                    )}
                  </div>
                </div>
              </div>

              {method === "otp" && otpPreview && (
                <div className="rounded-2xl border border-emerald-300/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <div className="font-semibold">Temporary OTP response</div>
                  <div className="mt-1 text-emerald-800">
                    OTP: <span className="font-black tracking-[0.2em]">{otpPreview}</span>
                  </div>
                </div>
              )}

              {statusMessage && (
                <div className="rounded-2xl border border-odoo-300/40 bg-odoo-50 px-4 py-3 text-sm text-odoo-900">
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-[#9A528D] px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_36px_rgba(154,82,141,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Login to Dashboard"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureChip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-bold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}
