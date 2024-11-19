import { asyncHandler } from "../Utils/AsyncHandler.js";
import { Apierror } from "../Utils/Apierror.js";
import { User } from "../Models/user.model.js";
import {uploadonCloudinary , deleteimagefromcloudinary } from "../Utils/cloudinary.js";
import { Apiresponse } from "../Utils/Apiresponse.js";
import { Mongoose } from "mongoose";

const generateaccessandrefreshtoken = async(userId)=>{
    try{
      const user = await User.findById(userId);
      const accessToken = await user.generateaccesstoken();
      const refreshToken = await user.generaterefreshtoken();
      
      user.refreshToken = refreshToken;
      await user.save({validiteBeforeSave : false})
      return {accessToken , refreshToken}
    }
    catch(err){
     console.log(err);
    }
}

const registeruser = asyncHandler(async(req , res) =>{
    // take input as user details from frontend
    // validation - not empty
    // check if user already exist - email , password
    // check for images , avatar
    // upload it on cloudinary
    // create an object - create entry in db
    // remove password and refreshtoken from response 
    // check for user creation
    // return response
    const { username , email , fullname , password} = req.body;
    if([username , email , fullname , password].some((fields)=> 
     fields?.trim() === "" )){
        throw new Apierror(400 , "All feilds are required");
    }

    const useralreadyexist = await User.findOne({
      $or : [{username}, {email}]
    })
    
    if(useralreadyexist){
      throw new Apierror(409 , "User already exist");
    }
    // console.log("files" , req.files.avatar[0].path);
    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverImagelocalpath = req.files?.coverImage[0]?.path;
    
    let coverImagelocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImagelocalpath = req.files.coverImage[0].path;
    }

    if(!avatarlocalpath){
      throw new Apierror(400 , "Avatar is required");
    }
    const avatar = await uploadonCloudinary(avatarlocalpath);
    const coverImage = await uploadonCloudinary(coverImagelocalpath);
    // console.log(avatar);
    if(!avatar){
      throw new Apierror(400 , "Avatar feild is required")
    }

    const user = await User.create({
        fullname ,
        avatar : avatar.url ,
        coverImage : coverImage.url || "",
        email,
        username : username.toLowerCase(),
        password
    })
    
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createduser){
       throw new Apierror(500 , "Something went wrong while registering the user");
    }
    
    return res.status(200).json(
        new Apiresponse(201 , createduser , "User registered successfully")
    )

})

const loginuser = asyncHandler(async(req , res)=>{
    // request data from user
    // username or email
    // find the user
    // check password if user exist
    // access and refresh token generate
    // send in form of cookies
    const { email , username , password} = req.body;

    if(!username && !email){
      throw new Apierror(400 , "All feilds are required");
    }

    const user = await User.findOne({
       $or: [{username} , {email}]
    })

    if(!user){
      throw new Apierror(404 , "User doesn't exist");
    }

    const checkpassword = await user.isPasswordCorrect(password);
    
    if(!checkpassword){
     throw new Apierror(401 , "Invalid User Credential");
    }
    
    const {accessToken , refreshToken} = await generateaccessandrefreshtoken(user._id);
    const loggedinuser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) 
    const options = {
        httpOnly : true,
        secure : true
        // after this it can't be modified in frontend
    }

    return res.status(200)
           .cookie("accessToken" , accessToken , options )
           .cookie("refreshToken" , refreshToken , options )
           .json(
            new Apiresponse( 200 , 
            {
                user : loggedinuser , accessToken , refreshToken 
            },
             "User loogedin successfully ")
    );
})

const refreshaccesstoken = asyncHandler(async(req , res , next)=>{
    const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken ;
    
    if(!incomingrefreshtoken){
     throw new Apierror(404 , "unauthorised access request")
    }
    const decodedToken = jwt.verify(incomingrefreshtoken , process.env.REFRESH_TOKEN_SECRET );
    
    const user = await User.findById(decodedToken?._id);

    if(!user){
      throw new Apierror(401 , "Invalid refreshtoken");
    }

    if(incomingrefreshtoken !== user?.refreshToken){
     throw new Apierror(401 , "Refreshtoken is expired ")
    }

    const options = {
        httpOnly : true,
        secure : true,
    }

    const {accessToken , newrefreshToken } = await generateaccessandrefreshtoken(user._id);
    
    return res.status(200)
           .cookies("accessToken" , accessToken , options )
           .cookies("refreshToken" , newrefreshToken , options )
           .json(
            new Apiresponse(200 , {accessToken , refreshToken : newrefreshToken} , "Access Token refresh")
           )

})

const logoutuser = asyncHandler(async(req , res )=>{
    
    await User.findByIdAndUpdate( req.user._id , 
      {
        $unset : {
            refreshToken : 1,
        }
      },
      {
         new : true,
      }
    )

    const options = {
        httpOnly : true,
        secure : true  
    }

    return res.status(200)
           .clearCookie("accessToken" , options)
           .clearCookie("refreshToken" , options)
           .json( new Apiresponse( 200 , {} , "User logout successfully") );
})

const updatepassword = asyncHandler(async(req , res)=>{
    const {oldpassword , newpassword} = req.body;
    
    const user = await User.findById(req.user?._id);

    const checkpassword = await user.isPasswordCorrect(oldpassword);

    if(!checkpassword){
     throw new Apierror(400 , "Invalid Old Password");
    }
    
    user.password = newpassword;
    await user.save({validiteBeforeSave : false});

    return res.status(200)
           .json(new Apiresponse(200 , {} , "Password updated successfully"));
    
})

const getcurrentuser = asyncHandler(async(req , res)=>{
    return res.status(200).json(new Apiresponse(200 , req.user , "current user fetched successfully"))
})

const updateaccountdetails = asyncHandler(async(req , res)=>{
     const { fullname , email } = req.body;

     if(!fullname || !email){
        throw new Apierror(400 , "All fields are required ");
     }

     const user = await User.findByIdAndUpdate( req.body._id , 
         {
           $set : { 
            fullname , 
            email : email }
         },
         { new : true }
     ).select("-password")

     return res.status(200)
            .json( new Apiresponse(200 , user , "User account details updated successfully "));

})

const updateavatardetails = asyncHandler(async(req , res)=>{
   const localavatarpath = req.file?.path;
   if(!localavatarpath){
    throw new Apierror(400 , "Avatar file is missing " );
   }
   
   const avatar = uploadonCloudinary(localavatarpath);

   if(!avatar.url){
    throw new Apierror(401 , "Error while uploading file on cloudinary");
   }

   await deleteimagefromcloudinary(avatar.url);
   
   const user = await User.findByIdAndUpdate( req.user?._id ,
    {  
        $set : {avatar : avatar.url}
    }, 
    { new : true } ).select("-password");
   
   return res.status(200)
           .json(new Apiresponse(200 , user , "Avatar is updated successfully "));
})

const updatecoverImagedetails = asyncHandler(async(req , res)=>{
    const localcoverImagepath = req.file?.path;
    if(!localcoverImagepath){
     throw new Apierror(400 , "Coverimage file is missing" );
    }
 
    const coverImage = uploadonCloudinary(localcoverImagepath);
 
    if(!coverImage.url){
     throw new Apierror(401 , "Error while uploading file on cloudinary");
    }
    
    const user = await User.findByIdAndUpdate( req.user?._id ,
     {  
         $set : {coverImage : coverImage.url}
     } , 
     { new : true } ).select("-password");
    
    return res.status(200)
            .json(new Apiresponse(200 , user , "Coverimage is updated successfully "));
 
 })

const getuserchannelprofile = asyncHandler(async(req , res)=>{
     const username = req.params;

     if(!username){
        throw new Apierror(400 , "username is missing ")
     }

     const channel = await User.aggregate([
        {
            $match : {
                username : username?.toLowerCase()
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localFeild : "_id",
                foreignFeild : "channel",
                result : "subscribers"
            },
        },
        {
            $lookup : {
                from : "subscriptions",
                localFeild : "_id",
                foreignFeild : "subscriber",
                result : "subscribedTo"
            },
        },
        {
            $addFeilds : {
                subscriberscount : {
                  $size : "$subscribers"
                },
                channelsubscribedtocount : {
                  $size : "$subscribedTo"
                },
                issubscribedto : {
                    $cond : {
                      if : {$in : [ req.user?._id , "$subscriber.subscribers"]},
                      then : true,
                      else : false
                    }
                }
            }
        },
        {
            $project : {
                fullname : 1,
                username : 1,
                subscriberscount : 1,
                channelsubscribedtocount : 1,
                issubscribedto : 1,
                avatar : 1,
                coverImage : 1,
                email : 1
            }
        }
     ])

    if(!channel?.length){
     throw new Apierror(400 , "No user is present")
    }

    return res.status(200)
           .json(new Apiresponse( 200 , channel[0] , "User channel fetched successfully" ));

})

const getwatchhistory = asyncHandler(async(req , res)=>{
    const user = User.aggregate([
        {
            $match : {
              _id : new Mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : "videos",
                localFeild : "watchHistory",
                foreignFeild : "_id",
                as : "WatchHistory",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localFeild : "owner",
                            foreignFeild : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                      fullname : 1,
                                      username : 1,
                                      avatar : 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFeilds : {
                            owner : {
                               $first : "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
           .json(new Apiresponse(200 , user[0].WatchHistory , "Watch history fetched successfully"));
})

export {registeruser , loginuser , logoutuser , refreshaccesstoken , updatepassword , getcurrentuser , updateaccountdetails ,
     updateavatardetails , updatecoverImagedetails , getuserchannelprofile , getwatchhistory
};
