import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    username : {
      type : String,
      required : true,
      unique : true,
      lowercase : true,
      trim : true,
      index : true,
    },
    email : {
      type : String,
      required : true,
      unique : true,
      lowercase : true,
      trim : true,
    },
    fullname : {
      type : String,
      required : true,
      trim : true,
      index : true,
    },
    avatar : {
      type : String, // Cloudinary url
      required : true,
    },
    coverimage : {
      type : String // Cloudinary url
    },
    watchHistory : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video",
        }
    ],
    password : {
       type : String,
       required : [true , "Password is required"]
    },
    refreshToken : {
       type : String,  
    }
}, {timeStamps : true})

userSchema.pre("save" , async function (next){
  if(!this.isModified("password")){
    return next();
  }
  this.password = await bcrypt.hash(this.password , 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateaccesstoken = function(){
 return jwt.sign(
    {
    _id : this._id,
    email : this.email,
    username : this.username,
    fullname : this.fullname
    },
 process.env.ACCESS_TOKEN_SECRET,
 {
  expiresIn : process.env.ACCESS_TOKEN_EXPIRY 
 }
 )}

 userSchema.methods.generaterefreshtoken = function(){
    return jwt.sign(
       {
       _id : this._id,
       },
    process.env.REFRESH_TOKEN_SECRET,
    {
     expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
    }
    )
 }


export const User = mongoose.model("User" , userSchema);
