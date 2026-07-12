"use client";

import { IconLogout } from "../icons/Icons";

type User = {
  name?: string;
  email?: string;
  role?: string;
} | null;

export default function LogoutScreen({
  user,
  onConfirmLogout,
  onCancel,
}: {
  user: User;
  onConfirmLogout: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,22,41,0.85)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "44px 40px", maxWidth: 400, width: "90%",
        textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        animation: "fadeIn 0.2s ease"
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #fee2e2, #fecaca)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
          margin: "0 auto 20px"
        }}>
          <IconLogout size={34} style={{ color: "#dc2626" }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1e3a5f", marginBottom: 8 }}>Signing Out</div>
        <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
          You are signed in as <b>{user?.name}</b>
        </div>
        <div style={{
          background: "#f1f5f9", borderRadius: 10, padding: "8px 16px", display: "inline-block",
          fontSize: 12, color: "#475569", marginBottom: 28, fontFamily: "monospace"
        }}>
          {user?.email} · {user?.role}
        </div>
        <div style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
          Are you sure you want to log out?
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "11px 28px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff",
            color: "#475569", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>
            Cancel
          </button>
          <button onClick={onConfirmLogout} style={{
            padding: "11px 28px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #dc2626, #ef4444)", color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(220,38,38,0.3)"
          }}>
            Yes, Logout
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
