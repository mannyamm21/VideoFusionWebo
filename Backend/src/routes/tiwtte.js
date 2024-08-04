import { Router } from "express";
import { addTiwtte, updateTiwtte, deleteTiwtte, getTiwtte, getAllTiwttes, updateTiwtteImage } from "../controllers/tiwtte.js";
import { verifyToken } from "../middleware/verifyToken.js"
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.post("/", verifyToken, upload.single("postImage"), addTiwtte);
router.put("/:id", verifyToken, updateTiwtte);
router.patch("/image/:id", verifyToken, upload.single("postImage"), updateTiwtteImage);
router.delete("/:id", verifyToken, deleteTiwtte);
router.get("/find/:id", getTiwtte);
router.get("/all", getAllTiwttes);

export default router;