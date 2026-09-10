import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { getMongoDatabase } from "../lib/mongo";

const router = Router();
const sessionCookie = "sardaar_admin_session";

type AdminSession = { tokenHash: string; username: string; createdAt: Date; expiresAt: Date };

function hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}

function validPassword(password: string, stored: string) {
    const [salt, expected] = stored.split(":");
    if (!salt || !expected) return false;
    const actual = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

async function requireAdmin(req: Request, res: Response, next: () => void): Promise<void> {
    const token = req.cookies?.[sessionCookie];
    if (!token) { res.status(401).json({ message: "Admin authentication required." }); return; }
    const db = await getMongoDatabase();
    const session = await db.collection<AdminSession>("admin_sessions").findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
    if (!session) { res.status(401).json({ message: "Admin session expired." }); return; }
    next();
    return;
}

router.post("/admin/login", async (req, res): Promise<void> => {
    const username = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!username || !passwordHash) { res.status(503).json({ message: "Admin authentication is not configured." }); return; }
    if (req.body?.username !== username || typeof req.body?.password !== "string" || !validPassword(req.body.password, passwordHash)) {
        res.status(401).json({ message: "Invalid admin credentials." });
        return;
    }
    const token = randomBytes(32).toString("base64url");
    const db = await getMongoDatabase();
    await db.collection<AdminSession>("admin_sessions").insertOne({ tokenHash: hashToken(token), username, createdAt: new Date(), expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) });
    res.cookie(sessionCookie, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 8 * 60 * 60 * 1000, path: "/api" });
    res.json({ status: "authenticated" });
    return;
});

router.post("/admin/logout", async (req, res) => {
    const token = req.cookies?.[sessionCookie];
    if (token) (await getMongoDatabase()).collection<AdminSession>("admin_sessions").deleteOne({ tokenHash: hashToken(token) }).catch(() => undefined);
    res.clearCookie(sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api" });
    res.status(204).send();
});

router.get("/admin/summary", requireAdmin, async (_req, res) => {
    const db = await getMongoDatabase();
    const [inquiries, events, recentInquiries] = await Promise.all([
        db.collection("inquiries").countDocuments(),
        db.collection("analytics_events").countDocuments(),
        db.collection("inquiries").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(50).toArray(),
    ]);
    const eventCounts = await db.collection("analytics_events").aggregate([{ $group: { _id: "$name", count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray();
    res.json({ inquiries, events, eventCounts, recentInquiries });
});

export default router;
