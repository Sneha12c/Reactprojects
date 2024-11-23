import { Router } from "express";
import { getAllVideos, publishAVideo , getVideoById , deleteVideo ,
     updateVideo, togglePublishStatus } from "../Controller/video.controller";

const router = Router();

router.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },   
    ]),
    publishAVideo
);

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoid").patch(togglePublishStatus);

export default router;
