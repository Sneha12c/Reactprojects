import { asyncHandler } from "../Utils/AsyncHandler.js";
import { Apierror } from "../Utils/Apierror.js";
import { User } from "../Models/user.model.js";
import uploadonCloudinary from "../Utils/cloudinary.js";
import { Apiresponse } from "../Utils/Apiresponse.js";

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
        $set : {
            refreshToken : undefined,
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

export {registeruser , loginuser , logoutuser};
