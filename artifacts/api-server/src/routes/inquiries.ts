import { Router, type IRouter } from "express";
import { getMongoDatabase } from "../lib/mongo";

const router: IRouter = Router();

type Inquiry = {
    kind: "contact" | "franchise" | "consulting";
    name: string;
    email: string;
    phone?: string;
    city?: string;
    message: string;
    restaurantName?: string;
    service?: string;
    source?: string;
    consent?: boolean;
    investmentRange?: string;
    experience?: string;
};

function isInquiry(value: unknown): value is Inquiry {
    if (!value || typeof value !== "object") return false;
    const inquiry = value as Record<string, unknown>;
    const validBase = (inquiry.kind === "contact" || inquiry.kind === "franchise" || inquiry.kind === "consulting") &&
        typeof inquiry.name === "string" && inquiry.name.trim().length > 1 && inquiry.name.length <= 100 &&
        typeof inquiry.email === "string" && inquiry.email.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) &&
        typeof inquiry.message === "string" && inquiry.message.trim().length > 3 && inquiry.message.length <= 2000;
    if (!validBase) return false;
    if (inquiry.phone !== undefined && (typeof inquiry.phone !== "string" || inquiry.phone.length > 20)) return false;
    if (inquiry.city !== undefined && (typeof inquiry.city !== "string" || inquiry.city.length > 100)) return false;
    if (inquiry.kind === "consulting") {
        return typeof inquiry.phone === "string" && inquiry.phone.trim().length >= 7 &&
            typeof inquiry.restaurantName === "string" && inquiry.restaurantName.trim().length > 1 && inquiry.restaurantName.length <= 120 &&
            typeof inquiry.city === "string" && inquiry.city.trim().length > 1 &&
            typeof inquiry.service === "string" && inquiry.service.trim().length > 1 && inquiry.service.length <= 100 &&
            inquiry.consent === true;
    }
    if (inquiry.kind === "franchise") {
        return typeof inquiry.phone === "string" && inquiry.phone.trim().length >= 7 &&
            typeof inquiry.city === "string" && inquiry.city.trim().length > 1 &&
            typeof inquiry.investmentRange === "string" && inquiry.investmentRange.trim().length > 1 && inquiry.investmentRange.length <= 100 &&
            (inquiry.experience === undefined || (typeof inquiry.experience === "string" && inquiry.experience.length <= 120)) &&
            inquiry.consent === true;
    }
    return true;
}

router.post("/inquiries", async (req, res) => {
    if (!isInquiry(req.body)) {
        res.status(400).json({ message: "Please provide a valid name, email and message." });
        return;
    }

    try {
        await (await getMongoDatabase()).collection("inquiries").insertOne({ ...req.body, name: req.body.name.trim(), email: req.body.email.trim().toLowerCase(), message: req.body.message.trim(), createdAt: new Date() });
    } catch (error) {
        req.log.error({ error }, "Could not persist inquiry");
        res.status(503).json({ message: "The enquiry could not be saved. Please call the dhaba directly." });
        return;
    }

    res.status(201).json({ status: "saved" });
});

export default router;