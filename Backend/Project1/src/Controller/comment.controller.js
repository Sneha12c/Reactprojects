import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../Models/comment.model.js"
import {Apierror} from "../Utils/Apierror.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/AsyncHandler.js"
import { Video } from "../Models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    
    if(!isValidObjectId(videoId)){
     throw new Apierror(400 , "This is not valid ObjectId");
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new Apierror(404, "video not found");
    }

    const allcomments = Comment.aggregate([
      {
        $match : {
          video : videoId 
        }
      },
      {
        $lookup : {
           from : "users",
           localFeild : "owner",
           foreignFeild : "_id",
           result : "userdetails"
        }
      },
        {
            $unwind: "$userDetails" // Flatten the userDetails array
        },
        {
            $project: {
                _id: 0, 
                content: 1, 
                "userDetails.username": 1, 
                "userDetails.fullName": 1 
            }
        }
    ])
    
    Comment.aggregatePaginate(allcomments , {page , limit})
     .then((result)=>{
      return res.json(new Apiresponse(200 , result , "All comment are fetched successfully"));
     })
     .catch((err)=>{
        console.log(err);
     })
})

const addComment = asyncHandler(async (req, res) => {
   const {commentId} = req.params
   const {content} = req.body
   const userId = req.user._id
   
   if(!isValidObjectId(commentId)){
    throw new Apierror(400 , "This is not valid ObjectId");
   }

   if(!content || content.trim()===""){
    throw new Apierror(400 , "All feild is required");
   }

   const comment = await Comment.create({
      content,
      video : videoId,
      owner : userId
   })

   if(!comment){
    throw new Apierror(400 , "Error while creating comment");
   }
   
   return res.status(200).json(new Apiresponse(200 , comment , "Comment created successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
   const {content} = req.body
   const userId = req.user._id
   
   if(!isValidObjectId(videoId)){
    throw new Apierror(400 , "This is not valid ObjectId");
   }

   if(!content || content.trim()===""){
    throw new Apierror(400 , "All feild is required");
   }

   const comment = await Comment.findById(commentId);

   if(userId.to_String() !== comment.owner.to_String()){
    throw new Apierror(400 , "You don't have permission to update comment");
   }

   const updatedcomment = await Comment.findByIdAndUpdate( commentId,
    {
      content,
    },
    {
      new : true
    })

   if(!updatedcomment){
    throw new Apierror(400 , "Error while updating comment");
   }
   
   return res.status(200).json(new Apiresponse(200 , updatedcomment , "Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    
    if(!isValidObjectId(videoId)){
     throw new Apierror(400 , "This is not valid ObjectId");
    }
 
    const comment = await Comment.findById(commentId);
 
    if(userId.to_String() !== comment.owner.to_String()){
     throw new Apierror(400 , "You don't have permission to delete comment");
    }
 
    const deletedcomment = await Comment.findByIdAndDelete( commentId)
 
    if(!deletedcomment){
     throw new Apierror(400 , "Error while deleting comment");
    }
    
    return res.status(200).json(new Apiresponse(200 , deletedcomment , "Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}
