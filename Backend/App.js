import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, // or 
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParser())
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

//routes import
import userRouter from './src/routes/users.js'
import videoRouter from './src/routes/videos.js'
import commentRouter from './src/routes/comments.js'
import authRouter from './src/routes/auth.js'
import tiwtte from './src/routes/tiwtte.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tiwttes", tiwtte)



export { app }  
