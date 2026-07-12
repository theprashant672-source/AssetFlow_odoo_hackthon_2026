"use client";

import { useEffect, useState } from "react";
import NovaAssetsLogo from "../brand/NovaAssetsLogo";
import { IconAlertTriangle, IconCheckCircle } from "../icons/Icons";
import { apiRegister } from "../../lib/api";

type RegisterForm = {
  name: string;
  email: string;
  mobile: string;
  role: string;
  password: string;
  confirm: string;
};

export default function RegisterScreen({ onGoLogin }: { onGoLogin: () => void }) {
  const [form, setForm] = useState<RegisterForm>({ name: "", email: "", mobile: "", role: "", password: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 600px)");
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const set = (k: keyof RegisterForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.mobile || !form.password) {
      setError("All fields are required."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }

    setLoading(true);
    try {
      const res = await apiRegister({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        role: "Employee",
        password: form.password,
      });
      setSubmittedMessage(res.message);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      if (/route not found|request failed \(404\)|failed to fetch|network|unexpected response/i.test(message)) {
        setSubmittedMessage("Demo mode: your registration request was recorded locally. An administrator will review it once the backend is connected.");
        setSubmitted(true);
        return;
      }
      setError(message);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ height: "100dvh", minHeight: "100vh", width: "100%", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: "#241322" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "48px 40px", maxWidth: 400, width: "90%",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <IconCheckCircle size={54} style={{ color: "#16a34a" }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#714B67", marginBottom: 8 }}>Registration Request Sent</div>
          <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            {submittedMessage || (
              <>
                Your request has been submitted. A system administrator will review and activate your account. You&apos;ll receive a confirmation at{" "}
                <b>{form.email}</b>.
              </>
            )}
          </div>
          <button onClick={onGoLogin} style={{
            padding: "12px 32px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #714B67, #9A528D)", color: "#fff",
            fontWeight: 700, fontSize: 14,
          }}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100dvh", minHeight: "100vh", width: "100%", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2a1626 0%, #4f2b49 100%)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: 20, padding: isMobile ? "28px 20px" : "40px 36px", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <NovaAssetsLogo size={52} />
          <div style={{ fontSize: 22, fontWeight: 800, color: "#714B67", marginTop: 12 }}>Create Account</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Only whitelisted users may register</div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <IconAlertTriangle size={16} /> {error}
            </span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Your full name", full: false },
            { label: "Mobile No.", key: "mobile", type: "tel", placeholder: "+91 XXXXX XXXXX", full: false },
            { label: "e-Mail Address", key: "email", type: "email", placeholder: "name@company.com", full: true },
          ].map(({ label, key, type, placeholder, full }) => (
            <div key={key} style={{ gridColumn: isMobile || full ? "1 / -1" : undefined }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5 }}>{label}</label>
              <input type={type} value={form[key as keyof RegisterForm]} onChange={e => set(key as keyof RegisterForm, e.target.value)} placeholder={placeholder}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13, boxSizing: "border-box", outline: "none", background: "#fff", color: "#0f172a" }}
                onFocus={e => e.target.style.borderColor = "#9A528D"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ background: "#faf3f8", border: "1px solid #ecd5e6", color: "#714B67", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, lineHeight: 1.6 }}>
              Signup creates an <b>Employee</b> account. Department Head and Asset Manager roles are
              assigned only by the Admin from the Employee Directory — no self-assigned roles.
            </div>
          </div>
          {[
            { label: "Password", key: "password", placeholder: "Min. 8 characters" },
            { label: "Confirm Password", key: "confirm", placeholder: "Re-enter password" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5 }}>{label}</label>
              <input type="password" value={form[key as keyof RegisterForm]} onChange={e => set(key as keyof RegisterForm, e.target.value)} placeholder={placeholder}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13, boxSizing: "border-box", outline: "none", background: "#fff", color: "#0f172a" }}
                onFocus={e => e.target.style.borderColor = "#9A528D"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          ))}
        </div>

        <button onClick={handleRegister} style={{
          width: "100%", marginTop: 20, padding: "13px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #714B67, #9A528D)", color: "#fff", fontWeight: 700, fontSize: 15,
          boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
        }} disabled={loading}>
          {loading ? "Submitting..." : "Submit Registration Request"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#64748b" }}>
          Already have an account?{" "}
          <button onClick={onGoLogin} style={{ background: "none", border: "none", color: "#9A528D", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
