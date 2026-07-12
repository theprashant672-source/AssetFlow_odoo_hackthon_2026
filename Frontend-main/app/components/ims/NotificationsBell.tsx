"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getUnreadNotificationCount, listNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from "../../lib/imsApi";
import { IconBell, IconClipboardList, IconPackage, IconShoppingCart, IconWrench } from "../icons/Icons";

function relativeTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function iconForType(type: string) {
  if (type === "sale_recorded") return <IconShoppingCart size={18} />;
  if (type === "raw_material_received") return <IconWrench size={18} />;
  if (type === "manufactured_created") return <IconPackage size={18} />;
  return <IconClipboardList size={18} />;
}

function metaText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function metaDateTime(value: unknown) {
  if (!value) return "";
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

function notificationMetaRows(n: NotificationItem) {
  const meta = n.meta ?? {};
  return [
    ["Serial", metaText(meta.serialNumber)],
    ["Status", metaText(meta.status)],
    ["Closed by", metaText(meta.closedByName)],
    ["Started", metaDateTime(meta.serviceStartedAt)],
    ["Closed", metaDateTime(meta.closedAt)],
    ["Remark", metaText(meta.closeRemark)],
  ].filter(([, value]) => value);
}

export default function NotificationsBell() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = expanded ? 50 : 6;

  async function refreshUnread() {
    try {
      const count = await getUnreadNotificationCount();
      setUnread(count);
    } catch {
      // ignore (avoid noisy header UI)
    }
  }

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      const res = await listNotifications({ page: 1, limit });
      setItems(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUnread();
    const t = window.setInterval(refreshUnread, 30_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    loadNotifications();
    refreshUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, expanded]);

  useEffect(() => {
    if (!open) return;
    const onDown = (ev: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (ev.target instanceof Node && !el.contains(ev.target)) {
        setOpen(false);
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const unreadLabel = useMemo(() => {
    if (unread === 0) return "No new notifications";
    if (unread === 1) return "You have 1 new notification";
    return `You have ${unread} new notifications`;
  }, [unread]);

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleItemClick(n: NotificationItem) {
    if (!n.isRead) {
      try {
        await markNotificationRead(n.id);
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
        setUnread((c) => Math.max(0, c - 1));
      } catch {
        // ignore
      }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-gray-700"
      >
        <IconBell size={18} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[460px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-gray-900">Notifications</div>
              <div className="mt-0.5 text-xs text-gray-500">{unreadLabel}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-[11px] font-semibold text-amber-600 hover:text-amber-700"
              >
                {expanded ? "Close" : "View all"}
              </button>
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unread === 0}
                className={`text-[11px] font-semibold ${unread === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"}`}
              >
                Mark read
              </button>
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto">
            {loading && (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Loading notifications…</div>
            )}

            {!loading && error && (
              <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  <IconBell size={18} />
                </div>
                <div className="text-sm font-semibold text-gray-700">No notifications yet</div>
                <div className="mt-1 text-xs text-gray-400">New service updates will appear here.</div>
              </div>
            )}

            {!loading && !error && items.map((n) => (
              <button
                type="button"
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-amber-50/50 transition flex gap-3 ${
                  n.isRead ? "opacity-75" : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? "bg-gray-100 text-gray-500" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                  {iconForType(n.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-bold leading-5 text-gray-900">{n.title}</div>
                    <div className="text-[11px] text-gray-400 flex-shrink-0">{relativeTime(n.createdAt)}</div>
                  </div>
                  {n.body && <div className="mt-1 text-sm leading-5 text-gray-600">{n.body}</div>}
                  {notificationMetaRows(n).length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {notificationMetaRows(n).map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</div>
                          <div className="mt-0.5 line-clamp-2 text-xs font-semibold text-gray-700">{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!n.isRead && (
                    <div className="mt-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      New
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
