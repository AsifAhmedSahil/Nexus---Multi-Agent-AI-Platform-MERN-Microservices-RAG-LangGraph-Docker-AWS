import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./route/billing.route.js"

dotenv.config()

const port = process.env.PORT

const app = express()

app.use("/webhook", express.raw({ type: "application/json" }))

app.use(express.json())

app.use("/", router)

app.get("/", (req, res) => {
  res.json({ message: "hello from Billing" })
})

app.listen(port, () => {
  console.log(`billing started at port: ${port}`)
  connectDB()
})
