import { Apierror } from "../Utils/Apierror.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const verifyjwt = asyncHandler(async(req , res , next)=>{
 try {
     const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer " , "");
     console.log(req.cookies);
     if(!token){
       throw new Apierror(401 , "Unauthorized request");
     }
     const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
     if(!user){
       throw new Apierror(401 , "Invalid access token");
     }
     req.user = user;
     next();
   
 } catch (error) {
   console.log("err" , error);
   throw new Apierror(401 , error?.message || "Invalid access token") 
 }
});
