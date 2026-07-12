"use client";

import { useEffect, useState } from "react";
import NovaAssetsLogo from "../brand/NovaAssetsLogo";
import { apiLogin, type AuthUser } from "../../lib/api";
import { IconAlertTriangle, IconEye, IconEyeOff, IconMail, IconPhone, IconQuote } from "../icons/Icons";

const REMEMBERED_EMAIL_KEY = "novaassets:rememberedEmail";

export default function LoginScreen({
  onLogin,
  onGoRegister,
}: {
  onLogin: (user: AuthUser) => void;
  onGoRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 900px)");
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  // Only the e-mail is remembered (in localStorage) for convenience — the session token itself
  // stays sessionStorage-only (tab-scoped) so "Remember Me" can't silently persist a login across
  // browser restarts on a shared machine.
  useEffect(() => {
    const remembered = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter both email and password."); return; }
    setLoading(true);
    try {
      const user = await apiLogin(email, password);
      if (rememberMe) window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      else window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      onLogin(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  const bullets = [
    { icon: <IconQuote size={15} />, text: "A secure, scalable, and user-centric tool to facilitate automation of products with ease." },
    { icon: <IconQuote size={15} />, text: "User registration is mandatory. Only whitelisted users may create an account." },
    { icon: <IconQuote size={15} />, text: "Distributors may contact the NovaAssets team to get onboarded." },
  ];

  return (
    <div
      style={{
        height: "100dvh",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        overflow: isMobile ? "auto" : "hidden",
      }}
    >
      {/* Left Panel */}
      {!isMobile && (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "48px 64px 40px",
        background: "linear-gradient(140deg, #123a8a 0%, #2e6fe0 48%, #22c1d6 100%)",
        position: "relative", overflowX: "hidden", overflowY: "auto"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 56 }}>
            <div style={{ flex: "0 0 auto" }}>
              <NovaAssetsLogo size={56} />
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: "#fcd34d", fontWeight: 800, fontSize: 32, letterSpacing: 6, lineHeight: 1 }}>NovaAssets</div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.6)", margin: "14px auto 10px", width: "90%" }} />
              <div style={{ color: "#fde68a", fontSize: 16, letterSpacing: 6 }}>Your Power Partner</div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.14)", borderRadius: 10,
            padding: "10px 22px", marginBottom: 30, width: "100%", boxSizing: "border-box", textAlign: "center",
          }}>
            <div style={{
              color: "#e2f56b", fontWeight: 800, fontSize: 22, letterSpacing: 0.5,
              textDecoration: "underline", textDecorationColor: "#e2f56b", textUnderlineOffset: 6,
            }}>
              Inventory Management System
            </div>
          </div>

          {bullets.map((b, i) => (
            <div key={i} style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, marginBottom: 16, lineHeight: 1.6, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ marginTop: 2, opacity: 0.9, flexShrink: 0 }}>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}

          <div style={{ marginTop: 40 }}>
            <div style={{ color: "#7dd3fc", fontSize: 14, fontWeight: 700, marginBottom: 10, textDecoration: "underline", textUnderlineOffset: 4 }}>Help/ Queries Contact Us</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <IconPhone size={14} /> +91 9311920642
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <IconMail size={14} /> info@avavbusiness.com
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Right Panel */}
      <div style={{
        width: isMobile ? "100%" : 480,
        flex: isMobile ? undefined : 1.15,
        display: "flex",
        height: isMobile ? "auto" : "100%",
        minHeight: isMobile ? "100dvh" : undefined,
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 20 : 40,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Product photo background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/hero.png)",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          zIndex: 0,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(15,23,42,0) 55%, rgba(15,23,42,0.4) 100%)",
          zIndex: 1,
        }} />

        {!isMobile && (
          <div style={{ position: "absolute", top: 28, right: 32, display: "flex", alignItems: "center", gap: 10, zIndex: 2, opacity: 0.92 }}>
            <NovaAssetsLogo size={34} />
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 3 }}>NovaAssets</span>
          </div>
        )}

        <div style={{
          width: "100%", maxWidth: 400, position: "relative", zIndex: 2,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 22,
          padding: isMobile ? "26px 20px" : "32px 30px",
          boxShadow: "0 45px 90px -15px rgba(6,10,30,0.6), 0 15px 35px rgba(6,10,30,0.3)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(226,232,240,0.9)", boxShadow: "0 10px 30px rgba(15,23,42,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <NovaAssetsLogo size={42} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#101d4d", letterSpacing: 0.4 }}>IMS Login</div>
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626",
              borderRadius: 14, padding: "10px 12px", fontSize: 13, marginBottom: 16
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <IconAlertTriangle size={16} /> {error}
              </span>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#101d4d", marginBottom: 6 }}>
              e-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="registered@email.com"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                boxSizing: "border-box",
                border: "1.5px solid #cbd5e1",
                background: "#fff",
                fontSize: 14,
                color: "#0f172a",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#1747c7"; e.target.style.boxShadow = "0 0 0 4px rgba(23,71,199,0.12)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ marginBottom: 14, position: "relative" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#101d4d", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "11px 44px 11px 14px",
                  borderRadius: 10,
                  boxSizing: "border-box",
                  border: "1.5px solid #cbd5e1",
                  background: "#fff",
                  fontSize: 14,
                  color: "#0f172a",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#1747c7"; e.target.style.boxShadow = "0 0 0 4px rgba(23,71,199,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: "#1747c7", cursor: "pointer" }}
              />
              Remember Me
            </label>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#64748b" : "linear-gradient(135deg, #16215c, #0c1440)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 0.4,
              boxShadow: "0 10px 30px rgba(12,20,64,0.35)",
              transition: "transform 0.05s, filter 0.15s",
            }}
            onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)"; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)"; }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#64748b" }}>
            Authorized user?{" "}
            <button
              type="button"
              onClick={onGoRegister}
              style={{
                background: "#fff",
                border: "1.5px solid #16215c",
                color: "#16215c",
                borderRadius: 999,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
