import express, { type Request, type Response, type Router } from "express";

import { getCollections } from "../db/collections";
import { authenticate } from "../middleware/auth";
import { roleMatchSet } from "../rbac";
import type { JwtPayload, Notification } from "../types";
import { fail, ok } from "../utils/http";
import { addSseClient } from "../services/realtime";

const router: Router = express.Router();

// Server-Sent Events stream for live notifications. EventSource cannot send
// Authorization headers, so this endpoint is open; events carry no sensitive data.
router.get("/stream", (req: Request, res: Response) => {
  req.socket.setTimeout(0);
  addSseClient(res);
});

function parseBool(v: unknown): boolean {
  if (typeof v !== "string") return false;
  const s = v.trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

function visibleToUserFilter(user: JwtPayload): Record<string, unknown> {
  return {
    $or: [
      { audienceUserIds: user.userId },
      { audienceRoles: { $in: roleMatchSet(user.role) } },
      { $and: [{ audienceUserIds: { $exists: false } }, { audienceRoles: { $exists: false } }] },
    ],
  };
}

router.get("/", authenticate, async (req: Request, res: Response) => {
  const c = await getCollections();
  const user = (req as any).user as JwtPayload;
  const { page = "1", limit = "20", unreadOnly } = req.query as Record<string, string>;

  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  const filter: Record<string, unknown> = visibleToUserFilter(user);
  if (parseBool(unreadOnly)) {
    filter.readBy = { $ne: user.userId };
  }

  const total = await c.notifications.countDocuments(filter);
  const data = await c.notifications
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((p - 1) * l)
    .limit(l)
    .toArray();

  const view = data.map((n) => {
    const { readBy, ...rest } = n as unknown as Notification;
    return { ...rest, isRead: Array.isArray(readBy) ? readBy.includes(user.userId) : false };
  });

  return ok(res, { data: view, total, page: p, limit: l });
});

router.get("/unread-count", authenticate, async (req: Request, res: Response) => {
  const c = await getCollections();
  const user = (req as any).user as JwtPayload;
  const filter: Record<string, unknown> = { ...visibleToUserFilter(user), readBy: { $ne: user.userId } };
  const count = await c.notifications.countDocuments(filter);
  return ok(res, { count });
});

router.post("/:id/read", authenticate, async (req: Request, res: Response) => {
  const c = await getCollections();
  const user = (req as any).user as JwtPayload;
  const id = req.params.id;

  const filter: Record<string, unknown> = { id, ...visibleToUserFilter(user) };
  const updated = await c.notifications.updateOne(filter, { $addToSet: { readBy: user.userId } });
  if (!updated.matchedCount) return fail(res, "Notification not found", 404);
  return ok(res, { message: "marked as read" });
});

router.post("/read-all", authenticate, async (req: Request, res: Response) => {
  const c = await getCollections();
  const user = (req as any).user as JwtPayload;
  const filter: Record<string, unknown> = { ...visibleToUserFilter(user), readBy: { $ne: user.userId } };
  const result = await c.notifications.updateMany(filter, { $addToSet: { readBy: user.userId } });
  return ok(res, { updated: result.modifiedCount });
});

export default router;
