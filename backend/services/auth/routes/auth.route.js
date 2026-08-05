import express from "express"
import { login, logout, updateUserPayment, me } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/login",login)
router.get("/logout",logout)
router.post("/update-plan",updateUserPayment)
router.get("/me",me)

export default router

