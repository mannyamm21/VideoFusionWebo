import { Router } from "express";
import { googleAuth, signIn, signUp, signOut, refreshAccessToken, forgotPassword, resetPassword } from '../controllers/auth.js'
import { upload } from "../middleware/multer.middleware.js"
import { verifyToken } from "../middleware/verifyToken.js";

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

router.post("/refresh-token", refreshAccessToken)

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;