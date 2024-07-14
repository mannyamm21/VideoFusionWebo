import { Router } from "express";
import { verifyToken } from '../middleware/verifyToken.js'
import { addVideo, addView, deleteVideo, getBytag, getByMultipleTags, getVideo, random, search, sub, trend, updateVideo, getByCategory } from "../controllers/video.js";
const router = Router();

// Add Video
router.post("/", verifyToken, addVideo)

// Update Video
router.put("/:id", verifyToken, updateVideo)

// Delete Video
router.delete("/:id", verifyToken, deleteVideo)

// Get Video
router.get("/find/:id", getVideo)

// Views of a  Video
router.put("/view/:id", addView)

// Trend Video
router.get("/trend", trend)

// Random Video
router.get("/random", random)

// Get Video
router.get("/sub", verifyToken, sub)

// Get Video By tags
router.get("/tag", getBytag)

router.get('/alltags', getByMultipleTags);

// Route to get videos by category
router.get('/category/:category', getByCategory);

// Get Video
router.get("/search", search)

export default router;