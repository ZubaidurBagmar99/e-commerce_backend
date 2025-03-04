const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
// app.use(cors())
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())

app.use(express.json({ limit: "10mb" })); // Increase payload limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api",router)

const PORT = 8000 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
        console.log("connect to DB");
        
    })
})

