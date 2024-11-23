import { Router } from "express";
import { verifyjwt } from "../Middleware/auth.middleware";
import { addVideoToPlaylist, 
    createPlaylist, 
    deletePlaylist, 
    getPlaylistById, 
    getUserPlaylists, 
    removeVideoFromPlaylist,
    updatePlaylist } 
from "../Controller/playlist.controller";

const router = Router();

router.use(verifyjwt);

router.route("/").post(createPlaylist)

router.route("/:playlistId").get(getPlaylistById)
        .patch(updatePlaylist)
        .delete(deletePlaylist)

router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router;
