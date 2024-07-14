import { Router } from "express";
import { googleAuth, signIn, signUp, signOut } from '../controllers/auth.js'
import { upload } from "../middleware/multer.middleware.js"
const router = Router();

// Create a user
router.route("/sign-up").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), signUp)

// Sign - IN a user
router.post("/sign-in", signIn)

// Sign - Out a user
router.post("/sign-out", signOut)

// Log though google a user
router.post("/google", googleAuth)

export default router;