import express from "express"
import { agent } from "../controllers/agent.controller.js"

export const router = express.Router()


router.post("/chat",agent)







