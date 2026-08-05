
import express from "express"
import { createOrder, verifyPayment, stripeWebhook } from "../controllers/billing.controller.js"

const router = express.Router()

router.post("/create-order", createOrder)
router.get("/verify-payment", verifyPayment)
router.post("/webhook", stripeWebhook)

export default router
