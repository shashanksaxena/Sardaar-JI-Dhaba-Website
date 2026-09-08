import { Router, type IRouter } from "express";

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

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const to = process.env.INQUIRY_EMAIL || "sardaarjifoods@gmail.com";
    if (!apiKey || !from) {
        res.status(503).json({ message: "Email delivery is not configured. Please call the dhaba directly." });
        return;
    }

    const text = [
        `Name: ${req.body.name}`,
        `Email: ${req.body.email}`,
        req.body.phone ? `Phone: ${req.body.phone}` : null,
        req.body.city ? `City: ${req.body.city}` : null,
        "",
        req.body.message,
    ].filter(Boolean).join("\n");

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            from,
            to: [to],
            reply_to: req.body.email,
            subject: req.body.kind === "franchise" ? `Franchise enquiry from ${req.body.name}` : `Website enquiry from ${req.body.name}`,
            text,
        }),
    });

    if (!response.ok) {
        req.log.error({ status: response.status }, "Email provider rejected inquiry");
        res.status(502).json({ message: "The message could not be delivered. Please try again or call the dhaba." });
        return;
    }
    res.status(201).json({ status: "sent" });
});

export default router;