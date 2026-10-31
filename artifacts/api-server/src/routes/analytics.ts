import { Router } from "express";
import { getMongoDatabase } from "../lib/mongo";

const router = Router();
const allowedEvents = new Set(["menu_click", "phone_click", "whatsapp_click", "directions_click", "order_click", "contact_submission", "page_view", "consulting_form_cta_click", "consulting_lead_submission", "franchise_cta_click", "franchise_form_submission"]);

router.post("/analytics/events", async (req, res): Promise<void> => {
    const { name, path, consent } = req.body ?? {};
    if (typeof name !== "string" || !allowedEvents.has(name) || typeof path !== "string" || path.length > 300 || consent !== true) { res.status(400).json({ message: "Invalid analytics event." }); return; }
    await (await getMongoDatabase()).collection("analytics_events").insertOne({ name, path: path.slice(0, 300), createdAt: new Date() });
    res.status(202).json({ status: "accepted" });
    return;
});

export default router;
