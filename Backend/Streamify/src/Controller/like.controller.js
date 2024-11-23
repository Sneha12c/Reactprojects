import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../Models/like.model.js"
import {Comment} from "../Models/comment.model.js"
import {Tweet} from "../Models/tweet.model.js"
import {Apierror} from "../Utils/Apierror.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/AsyncHandler.js"
import { Video } from "../Models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if(!isValidObjectId(videoId)){
     throw new Apierror(400 , "This is not valid ObjectId");
    }

    const video = await Video.findById(videoId);
    
    if(!video){
     throw new Apierror(404 , "Video doesn't exist");
    }

    const likedvideoornot = Like.findOne({  
               video : videoId,
               likedBy : req.user._id,
            }
    )
    
    if(likedvideoornot){
    const removelike = await Like.findOneAndDelete({video : videoId , likedBy : req.user._id });
    if(!removelike){
     throw new Apierror(400 , "Error while toggling like ")
    }
    return res.status(200).json(new Apiresponse(200 , removelike , "Like is removed successfully"));
    }
    else{
    const togglelike = await Like.create({video : videoId , likedBy : req.user._id});
    if(!togglelike){
    throw new Apierror(400 , "Error while toggling like ")
    }
    return res.status(200).json(new Apiresponse(200 , togglelike , "Like toggled successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new Apierror(400 , "This is not valid ObjectId")
    }
       const comment = await Comment.findById(commentId);
    
       if(!comment){
        throw new Apierror(404 , "Video doesn't exist");
       }
   
       const likedcommentornot = Like.findOne({  
                  comment : commentId,
                  likedBy : req.user._id,
               }
       )
       
       if(likedcommentornot){
       const removecommentlike = await Comment.findOneAndDelete({comment : commentId , likedBy : req.user._id });
       if(!removecommentlike){
        throw new Apierror(400 , "Error while toggling like on comment ")
       }
       return res.status(200).json(new Apiresponse(200 , removelike , "Like on comment is removed successfully"));
       }
       else{
       const togglelike = await Like.create({ comment : commentId , likedBy : req.user._id});
       if(!togglelike){
       throw new Apierror(400 , "Error while toggling like ")
       }
       return res.status(200).json(new Apiresponse(200 , togglelike , "Like toggled successfully"));
       }  
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
     throw new Apierror(400 , "This is not valid ObjectId")
    }
    const tweet = await Tweet.findById(tweetId);
    
    if(!tweet){
     throw new Apierror(404 , "Tweet doesn't exist");
    }

    const likedtweetornot = Like.findOne({  
               tweet : tweetId,
               likedBy : req.user._id,
            }
    )
    
    if(likedtweetornot){
    const removelikeontweet = await Like.findOneAndDelete({tweet : tweetId , likedBy : req.user._id });
    if(!removelikeontweet){
     throw new Apierror(400 , "Error while toggling like on tweet ")
    }
    return res.status(200).json(new Apiresponse(200 , removelike , "Like on tweet is toggled successfully"));
    }
    else{
    const togglelike = await Like.create({tweet : tweetId , likedBy : req.user._id});
    if(!togglelike){
    throw new Apierror(400 , "Error while toggling like on tweet ")
    }
    return res.status(200).json(new Apiresponse(200 , togglelike , "Like toggled successfully"));
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const likedvideos = await Like.aggregate([
        {
           $match : {
             likedBy : new mongoose.Types.ObjectId(userId)
           }
        },
        {
            $lookup : {
               from : "videos",
               localField : "video",
               foreignField : "_id",
               result : "videodetails",
            }
        },
        {
            $unwind : "$videodetails"
        },
        {
            project : {
             _id : 0,
             videodetails : 1,
            }
        }
    ])

    if(!likedvideos || likedvideos.length()===0){
     throw new Apierror(400 , "No liked videos found");
    }
    
    return res.status(200).json(new Apiresponse(200 , likedvideos , "Liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}