import express from "express"
import dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT 

const app = express()

app.listen(port,()=>{
    console.log(`gateway started at port: ${port}`)
})