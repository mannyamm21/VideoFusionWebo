import dotenv from 'dotenv'
import connectDB from "./src/DB/index.js";
import { app } from './App.js'

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.listen(5000 || process.env.PORT, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!", err);
    })