import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import protect from "./middleware/auth.middleware.js"
import { getCurrentUser } from "./controllers/user.controllers.js"

dotenv.config()

const port = process.env.PORT 

const app = express()
app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true 
}))

app.use(cookieParser())



// app.use("/auth",proxy(process.env.AUTH_SERVICE))

app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE, {
    proxyResOptDecorator: (proxyResOpts) => {
      return proxyResOpts;
    }
  })
);

app.get("/api/me",protect,getCurrentUser)

app.listen(port,()=>{
    console.log(`gateway started at port: ${port}`)
})