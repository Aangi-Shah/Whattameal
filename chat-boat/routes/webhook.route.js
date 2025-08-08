import express from "express";
import { handleUserIntaraction, handleWebhookVerification } from "../controllers/webhook.controller.js";

const router = express.Router();

// ✅ Webhook Verification
router.get("/", handleWebhookVerification);

// ✅ Handle Incoming Messages
router.post("/", handleUserIntaraction);

export default router;
