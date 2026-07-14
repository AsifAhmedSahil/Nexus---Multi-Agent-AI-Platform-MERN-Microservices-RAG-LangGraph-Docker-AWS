import express from "express"
import { agent } from "../controllers/agent.controller"

export const router = express.Router()


router.post("/chat",agent)







