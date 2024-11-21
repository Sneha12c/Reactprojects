import { Router } from "express";
import { verifyjwt } from "../Middleware/auth.middleware";
import { addComment, deleteComment, getVideoComments, updateComment } from "../Controller/comment.controller";

const router = Router();

router.use(verifyjwt);

router.route("/c/:commentId").patch(updateComment).delete(deleteComment)
router.route("/:videoId").post(addComment).get(getVideoComments);

export default router
