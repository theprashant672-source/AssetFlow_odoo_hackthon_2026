"use client";

import type { RealtimeEvent } from "@/hooks/use-realtime";

const SEVERITY_STYLES: Record<string, { border: string; icon: string }> = {
  success: { border: "border-l-emerald-500", icon: "✅" },
  warning: { border: "border-l-amber-500", icon: "⚠️" },
  critical: { border: "border-l-rose-500", icon: "🚨" },
  info: { border: "border-l-[#5b3df5]", icon: "🔔" },
};

export default function RealtimeToaster({
  toasts,
  onDismiss,
}: {
  toasts: RealtimeEvent[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const style = SEVERITY_STYLES[toast.severity ?? "info"] ?? SEVERITY_STYLES.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 border-l-4 ${style.border} bg-white p-4 shadow-lg animate-[slideIn_0.25s_ease-out]`}
            role="status"
          >
            <span className="text-lg leading-none">{style.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-900">{toast.title}</div>
              {toast.body && <div className="mt-0.5 truncate text-xs text-slate-500">{toast.body}</div>}
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Live · {new Date(toast.createdAt).toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-300 transition-colors hover:text-slate-600"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(24px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
