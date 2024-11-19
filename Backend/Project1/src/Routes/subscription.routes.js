import { Router } from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../Controller/subscription.controller";
import { verifyjwt } from "../Middleware/auth.middleware";

const router = Router();

router.use(verifyjwt);

router.route("/u/:subscriberId").get(getSubscribedChannels);
router.route("/c/:channelId").get(getUserChannelSubscribers);
router.route("/c/:channelId").post(toggleSubscription);

export default router;
