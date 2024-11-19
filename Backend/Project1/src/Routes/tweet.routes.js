import { Router } from "express";
import { verifyjwt } from "../Middleware/auth.middleware";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../Controller/tweet.controller";

const router = Router();

router.use(verifyjwt);

router.route("/").post(createTweet)
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet)
router.route("/:userId").get(getUserTweets)

export default router;
