import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

router.post("/register", async (req, res) => {
  const { name, email, password, role, state, city } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const [user] = await db.insert(usersTable).values({
    name,
    email,
    password: hashPassword(password),
    role,
    state: state || null,
    city: city || null,
  }).returning();

  (req.session as any).userId = user.id;

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    state: user.state,
    city: user.city,
    rating: user.rating,
    reviewCount: user.reviewCount,
    createdAt: user.createdAt.toISOString(),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  (req.session as any).userId = user.id;

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    state: user.state,
    city: user.city,
    rating: user.rating,
    reviewCount: user.reviewCount,
    createdAt: user.createdAt.toISOString(),
  });
});

router.post("/guest", async (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "Missing name or role" });
  }

  const guestEmail = `guest_${Date.now()}@bebemart.local`;
  const [user] = await db.insert(usersTable).values({
    name,
    email: guestEmail,
    password: null,
    role,
  }).returning();

  (req.session as any).userId = user.id;

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    state: user.state,
    city: user.city,
    rating: user.rating,
    reviewCount: user.reviewCount,
    createdAt: user.createdAt.toISOString(),
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

export default router;
