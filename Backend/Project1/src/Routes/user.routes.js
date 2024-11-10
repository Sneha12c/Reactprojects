import { Router } from "express";
import { loginuser, logoutuser, registeruser } from "../Controller/user.controller.js";
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

export default router;


