import type { Response } from "express";
import { randomUUID } from "crypto";

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

type SseClient = {
  id: string;
  res: Response;
};

const clients = new Map<string, SseClient>();

const HEARTBEAT_MS = 25_000;

let heartbeatTimer: NodeJS.Timeout | null = null;

function ensureHeartbeat() {
  if (heartbeatTimer || clients.size === 0) return;
  heartbeatTimer = setInterval(() => {
    if (clients.size === 0) {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      heartbeatTimer = null;
      return;
    }
    for (const client of clients.values()) {
      client.res.write(`: ping\n\n`);
    }
  }, HEARTBEAT_MS);
  heartbeatTimer.unref?.();
}

export function addSseClient(res: Response): string {
  const id = randomUUID();

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(`retry: 3000\n\n`);
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId: id })}\n\n`);

  clients.set(id, { id, res });
  ensureHeartbeat();

  res.on("close", () => {
    clients.delete(id);
  });

  return id;
}

export function broadcast(event: Omit<RealtimeEvent, "id" | "createdAt">): RealtimeEvent {
  const full: RealtimeEvent = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    severity: "info",
    ...event,
  };

  const payload = `event: notification\ndata: ${JSON.stringify(full)}\n\n`;
  for (const client of clients.values()) {
    try {
      client.res.write(payload);
    } catch {
      clients.delete(client.id);
    }
  }
  return full;
}

export function connectedClients(): number {
  return clients.size;
}
