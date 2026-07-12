"use client";

import { useEffect, useRef, useState } from "react";
import { apiUrl } from "@/app/lib/assetflowApi";

export type RealtimeEvent = {
  id: string;
  type: string;
  title: string;
  body?: string;
  entityType?: string;
  entityId?: string;
  severity?: "info" | "success" | "warning" | "critical";
  createdAt: string;
};

const TOAST_LIFETIME_MS = 6000;
const MAX_TOASTS = 4;

export function useRealtime() {
  const [toasts, setToasts] = useState<RealtimeEvent[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = (id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const timers = timersRef.current;
    const source = new EventSource(apiUrl("/api/notifications/stream"));

    source.addEventListener("connected", () => setConnected(true));
    source.onerror = () => setConnected(false);

    source.addEventListener("notification", (e) => {
      try {
        const event = JSON.parse((e as MessageEvent).data) as RealtimeEvent;
        setUnseenCount((c) => c + 1);
        setToasts((prev) => [event, ...prev].slice(0, MAX_TOASTS));
        const timer = setTimeout(() => {
          timers.delete(event.id);
          setToasts((prev) => prev.filter((t) => t.id !== event.id));
        }, TOAST_LIFETIME_MS);
        timers.set(event.id, timer);
      } catch (err) {
        console.error("Bad realtime payload", err);
      }
    });

    return () => {
      source.close();
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return { toasts, dismiss, unseenCount, clearUnseen: () => setUnseenCount(0), connected };
}
