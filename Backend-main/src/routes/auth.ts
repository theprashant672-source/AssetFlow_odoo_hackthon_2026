import express, { type Request, type Response, type Router } from "express";
import bcrypt from "bcryptjs";

import { getCollections, type Collections } from "../db/collections";
import { db as mockDb } from "../db/mockDb";
import { authenticate } from "../middleware/auth";
import { DEFAULT_ROLE_PERMISSIONS, normalizeRole } from "../rbac";
import type {
  JwtPayload,
  LoginRequest,
  OtpLoginSendRequest,
  OtpLoginSendResponse,
  OtpLoginVerifyRequest,
  Permission,
  RegisterRequest,
  RoleName,
  User,
} from "../types";
import { fail, ok } from "../utils/http";
import { generateId } from "../utils/id";
import { signToken } from "../utils/jwt";

const router: Router = express.Router();
const OTP_TTL_MS = 10 * 60 * 1000;

type OtpChallenge = {
  challengeId: string;
  identifier: string;
  role?: RoleName;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
};

const otpChallenges = new Map<string, OtpChallenge>();

async function tryGetCollections(): Promise<Collections | null> {
  try {
    return await getCollections();
  } catch {
    return null;
  }
}

function normalizeIdentifier(value: string) {
  const trimmed = value.trim().toLowerCase();
  return {
    lower: trimmed,
    compact: trimmed.replace(/[^\d+]/g, ""),
  };
}

function matchesIdentifier(user: User, identifier: string) {
  const lookup = normalizeIdentifier(identifier);
  const emailMatch = user.email.trim().toLowerCase() === lookup.lower;
  const mobileMatch = user.mobile.trim().replace(/[^\d+]/g, "") === lookup.compact;
  return emailMatch || mobileMatch;
}

function findDemoUser(identifier: string) {
  return mockDb.users.find((item) => matchesIdentifier(item, identifier));
}

async function findUserByIdentifier(identifier: string, c: Collections | null): Promise<User | null> {
  const demoUser = findDemoUser(identifier);
  const lookup = normalizeIdentifier(identifier);
  const now = new Date();

  if (!c) {
    if (!demoUser) return null;
    return { ...demoUser, email: demoUser.email.trim().toLowerCase(), updatedAt: now } as User;
  }

  const user =
    (await c.users.findOne({ email: lookup.lower })) ??
    (await c.users.findOne({ mobile: lookup.compact || identifier.trim() }));

  if (user) return user;

  if (!demoUser) return null;

  const canonicalRole = normalizeRole(demoUser.role);
  const nextUser = {
    ...demoUser,
    email: demoUser.email.trim().toLowerCase(),
    role: canonicalRole,
    updatedAt: now,
  } as User;
  await c.users.insertOne(nextUser);
  return nextUser;
}

function createOtpChallenge(identifier: string, role?: RoleName): OtpChallenge {
  const challenge: OtpChallenge = {
    challengeId: generateId(),
    identifier: identifier.trim(),
    role: role?.trim(),
    otp: String(Math.floor(100000 + Math.random() * 900000)),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
    createdAt: new Date(),
  };
  otpChallenges.set(challenge.challengeId, challenge);
  return challenge;
}

function getOtpChallenge(challengeId: string) {
  const challenge = otpChallenges.get(challengeId);
  if (!challenge) return null;
  if (challenge.expiresAt.getTime() < Date.now()) {
    otpChallenges.delete(challengeId);
    return null;
  }
  return challenge;
}

async function permissionsForRole(role: RoleName, c?: Collections | null): Promise<Permission[]> {
  if (!c) {
    return (DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS] ?? []) as Permission[];
  }

  const doc = await c.roles.findOne({ name: role }, { projection: { permissions: 1 } });
  if (!doc) {
    return (DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS] ?? []) as Permission[];
  }
  return Array.from(new Set([...(doc.permissions ?? [])])) as Permission[];
}

async function resolveLoginUser(identifier: string, password: string, c: Collections | null): Promise<User | null> {
  const user = await findUserByIdentifier(identifier, c);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return user;
}

function canonicalizeLoginRole(user: User) {
  return user.email?.toLowerCase() === "accountsdept@avavbusiness.com" ? "Accounts" : normalizeRole(user.role);
}

function toSafeAuthPayload(user: User, role: RoleName, permissions: Permission[]) {
  return {
    token: signToken({ userId: user.id, email: user.email, role }),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
      permissions,
      mobile: user.mobile,
      assignedStates: (user as any).assignedStates ?? [],
    },
  };
}

/**
 * POST /api/auth/login
 * Body: { email | identifier, password }
 */
router.post("/login", async (req: Request, res: Response) => {
  const { email, identifier, password } = req.body as LoginRequest;
  const loginIdentifier = (identifier ?? email ?? "").trim();

  if (!loginIdentifier || !password) {
    return fail(res, "Email/phone and password are required");
  }

  const c = await tryGetCollections();
  const user = await resolveLoginUser(loginIdentifier, password, c);
  if (!user || !user.isActive) {
    return fail(res, "Invalid credentials", 401);
  }

  const role = canonicalizeLoginRole(user);
  if (c && role !== user.role) {
    await c.users.updateOne({ id: user.id }, { $set: { role, updatedAt: new Date() } });
  }

  const permissions = await permissionsForRole(role, c);
  return ok(res, toSafeAuthPayload(user, role, permissions));
});

// Helpful guard for accidental GET hits.
router.all("/login", (req: Request, res: Response) => {
  res.setHeader("Allow", "POST, OPTIONS");
  return fail(res, `Method ${req.method} not allowed. Use POST /api/auth/login.`, 405);
});

/**
 * POST /api/auth/otp/send
 * Body: { identifier, role? }
 * Returns the OTP in the response for temporary setup/demo use.
 */
router.post("/otp/send", async (req: Request, res: Response) => {
  const { identifier, role } = req.body as OtpLoginSendRequest;

  if (!identifier?.trim()) {
    return fail(res, "Email or phone is required");
  }

  const challenge = createOtpChallenge(identifier.trim(), role);
  const payload: OtpLoginSendResponse = {
    challengeId: challenge.challengeId,
    identifier: challenge.identifier,
    role: challenge.role,
    otp: challenge.otp,
    expiresAt: challenge.expiresAt.toISOString(),
    message: "OTP generated successfully.",
  };

  return ok(res, payload);
});

/**
 * POST /api/auth/otp/verify
 * Body: { identifier, role?, challengeId, otp }
 */
router.post("/otp/verify", async (req: Request, res: Response) => {
  const { identifier, role, challengeId, otp } = req.body as OtpLoginVerifyRequest;

  if (!identifier?.trim() || !challengeId?.trim() || !otp?.trim()) {
    return fail(res, "Identifier, challengeId, and OTP are required");
  }

  const challenge = getOtpChallenge(challengeId.trim());
  if (!challenge) {
    return fail(res, "OTP expired or invalid. Please send a new OTP.", 410);
  }

  if (challenge.identifier.trim().toLowerCase() !== identifier.trim().toLowerCase()) {
    return fail(res, "OTP does not match this account", 400);
  }

  if ((challenge.role ?? "").trim().toLowerCase() !== (role ?? "").trim().toLowerCase()) {
    return fail(res, "OTP was generated for a different role", 400);
  }

  if (challenge.otp !== otp.trim()) {
    return fail(res, "Invalid OTP", 401);
  }

  otpChallenges.delete(challengeId.trim());

  const c = await tryGetCollections();
  const existingUser = await findUserByIdentifier(identifier.trim(), c);
  const fallbackRole = role?.trim() || "Admin";
  const user: User =
    existingUser ??
    ({
      id: `otp-${generateId()}`,
      email: identifier.trim().toLowerCase(),
      passwordHash: "",
      name: identifier.trim(),
      mobile: identifier.trim(),
      role: fallbackRole,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);

  const canonicalRole = role?.trim() || canonicalizeLoginRole(user);
  if (c && existingUser && canonicalRole !== existingUser.role) {
    await c.users.updateOne({ id: existingUser.id }, { $set: { role: canonicalRole, updatedAt: new Date() } });
  }

  const permissions = await permissionsForRole(canonicalRole, c);
  return ok(res, toSafeAuthPayload(user, canonicalRole, permissions));
});

/**
 * POST /api/auth/register
 * Body: { name, email, mobile, role, password }
 */
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, mobile, role, password } = req.body as RegisterRequest;

  if (!name || !email || !mobile || !role || !password) {
    return fail(res, "All fields are required");
  }
  if (password.length < 8) {
    return fail(res, "Password must be at least 8 characters");
  }

  const c = await getCollections();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRole = normalizeRole(role);
  const allowedRoles: RoleName[] = [
    "Admin",
    "Inventory",
    "Sales",
    "Dispatch",
    "Accounts",
    "Distributor",
    "L1 Engineer",
    "L2 Technical Team",
    "L3 Advanced OEM Support",
    "Warehouse Team",
    "Accounts Team",
    "Dealer",
  ];
  if (!allowedRoles.includes(normalizedRole)) {
    return fail(res, "Invalid role");
  }

  const alreadyExists = await c.users.findOne({ email: normalizedEmail }, { projection: { id: 1 } });
  if (alreadyExists) return fail(res, "An account with this email already exists");

  const pending = await c.pendingRegistrations.findOne({ email: normalizedEmail }, { projection: { id: 1 } });
  if (pending) return fail(res, "A registration request for this email is already pending");

  await c.pendingRegistrations.insertOne({
    id: generateId(),
    name,
    email: normalizedEmail,
    mobile,
    role: normalizedRole,
    password,
    submittedAt: new Date(),
  });

  return ok(res, { message: "Registration request submitted. Awaiting admin approval." }, 201);
});

/**
 * GET /api/auth/me
 */
router.get("/me", authenticate, async (req: Request, res: Response) => {
  const { userId } = (req as any).user as JwtPayload;
  const c = await tryGetCollections();
  const user = c ? await c.users.findOne({ id: userId }) : mockDb.users.find((item) => item.id === userId);
  if (!user) return fail(res, "User not found", 404);
  const role = canonicalizeLoginRole(user);
  if (c && role !== user.role) {
    await c.users.updateOne({ id: user.id }, { $set: { role, updatedAt: new Date() } });
  }
  const permissions = await permissionsForRole(role, c);
  const { passwordHash: _, ...safeUser } = user as any;
  return ok(res, { ...safeUser, role, permissions, assignedStates: safeUser.assignedStates ?? [] });
});

export default router;
