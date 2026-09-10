import { Router, type IRouter } from "express";
import { getMongoDatabase } from "../lib/mongo";

const router: IRouter = Router();

type Inquiry = {
    kind: "contact" | "franchise";
    name: string;
    email: string;
    phone?: string;
    city?: string;
    message: string;
};

function isInquiry(value: unknown): value is Inquiry {
    if (!value || typeof value !== "object") return false;
    const inquiry = value as Record<string, unknown>;
    return (inquiry.kind === "contact" || inquiry.kind === "franchise") &&
        typeof inquiry.name === "string" && inquiry.name.trim().length > 1 &&
        typeof inquiry.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) &&
        typeof inquiry.message === "string" && inquiry.message.trim().length > 3;
}

router.post("/inquiries", async (req, res) => {
    if (!isInquiry(req.body)) {
        res.status(400).json({ message: "Please provide a valid name, email and message." });
        return;
    }

    try {
        await (await getMongoDatabase()).collection("inquiries").insertOne({ ...req.body, createdAt: new Date() });
    } catch (error) {
        req.log.error({ error }, "Could not persist inquiry");
        res.status(503).json({ message: "The enquiry could not be saved. Please call the dhaba directly." });
        return;
    }

    res.status(201).json({ status: "saved" });
});

export default router;