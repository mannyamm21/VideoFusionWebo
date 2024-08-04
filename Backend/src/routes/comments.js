import { Router } from "express";
import { addComment, addTiwtteComment, deleteComment, deleteTiwtteComment, getComments, getTiwtteComments } from "../controllers/comment.js";
import { verifyToken } from "../middleware/verifyToken.js"
const router = Router();

router.post("/", verifyToken, addComment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/:videoId", getComments);

router.post("/tiwtte", verifyToken, addTiwtteComment);
router.delete("/tiwtte/:id", verifyToken, deleteTiwtteComment);
router.get("/tiwtte/:tiwtteId", getTiwtteComments);
export default router;