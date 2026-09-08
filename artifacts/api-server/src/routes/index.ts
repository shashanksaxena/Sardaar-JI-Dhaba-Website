import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiryRouter from "./inquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inquiryRouter);

export default router;
