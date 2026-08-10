import express from "express"
import { agent } from "../controllers/agent.controller.js"
import multer from "../config/multer.js"

export const router = express.Router()


router.post("/chat",multer.single("file"),agent)







