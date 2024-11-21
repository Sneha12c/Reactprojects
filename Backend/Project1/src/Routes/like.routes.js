import { Router } from "express";
import { verifyjwt } from "../Middleware/auth.middleware";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../Controller/like.controller";

const router= Router();

router.use(verifyjwt);

router.route("/:commentId").patch(toggleCommentLike);
router.route("/:tweetId").patch(toggleTweetLike);
router.route("/:videoId").patch(toggleVideoLike);
router.route("/like").get(getLikedVideos);

export default router