import { Router } from "express";
import { getcurrentuser, loginuser, logoutuser, refreshaccesstoken, registeruser, updateavatardetails, 
 updateaccountdetails , updatecoverImagedetails, updatepassword, 
 getuserchannelprofile, getwatchhistory} from "../Controller/user.controller.js";
import {verifyjwt} from "../Middleware/auth.middleware.js";

const router = Router();
import {upload} from "../Middleware/multer.middleware.js";

router.route("/register").post(
    upload.fields([
        {
          name : "avatar",
          maxCount : 1
        },
        {
          name : "coverImage",
          maxCount :1
        }
    ])
    , registeruser)

router.route("/login").post(loginuser);

router.route("/logout").post( verifyjwt , logoutuser);
router.route("/refresh-token").post(refreshaccesstoken);
router.route("/change-password").post(verifyjwt , updatepassword );
router.route("/current-user").post( verifyjwt ,getcurrentuser);
router.route("/update-account").patch(verifyjwt , updateaccountdetails );
router.route("/update-avatar").patch( verifyjwt, upload.single("avatar") , updateavatardetails );
router.route("/update-coverImage").patch(verifyjwt , upload.single("coverImage") , updatecoverImagedetails);
router.route("/c/:username").get(verifyjwt , getuserchannelprofile);
router.route("/history").get(verifyjwt , getwatchhistory);

export default router;


