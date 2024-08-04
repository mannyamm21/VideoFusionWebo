import { Router } from "express";
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, changeCurrentPassword, updateUser, updateUserAvatar, updateUserCoverImage, search, saveVideo, unsaveVideo, getSavedVideos, dislikeTiwtte, likeTiwtte } from '../controllers/user.js'
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/multer.middleware.js"
const router = Router();

// Update User
router.put("/:id", verifyToken, updateUser)

// Delete user
router.delete("/:id", verifyToken, deleteUser)

// Get a user
router.get("/find/:id", getUser)

// Subscribe a user
router.put("/sub/:id", verifyToken, subscribe)

// unSubscribe a user
router.put("/unsub/:id", verifyToken, unsubscribe)

// Like a Video
router.put("/like/:videoId", verifyToken, like)

// Dislike a Video
router.put("/dislike/:videoId", verifyToken, dislike)


// Like a Tiwtte
router.put("/liketiwtte/:postId", verifyToken, likeTiwtte)

// Dislike a Tiwtte
router.put("/disliketiwtte/:postId", verifyToken, dislikeTiwtte)

router.get("/search", search)

router.post("/changepassword/:id", verifyToken, changeCurrentPassword)
// Save video route
router.put('/savedVideos/:videoId', verifyToken, saveVideo);
router.put('/unsavedVideos/:videoId', verifyToken, unsaveVideo);

// Define route to get saved videos
router.get('/:id/savedVideos', getSavedVideos);

router.patch("/avatar/:id", verifyToken, upload.single("avatar"), updateUserAvatar)
router.patch("/coverImage/:id", verifyToken, upload.single("coverImage"), updateUserCoverImage)

export default router;