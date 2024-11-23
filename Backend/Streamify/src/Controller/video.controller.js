import {isValidObjectId, Mongoose} from "mongoose";
import {Video} from "../Models/video.model.js";
import {User} from "../Models/user.model.js";
import {Apierror } from "../Utils/Apierror.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/AsyncHandler.js"
import {deleteimagefromcloudinary, uploadOnCloudinary} from "../Utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "/^video/", sortBy= "createdAt", sortType = 1, userId = req.user._id } = req.query
    
    const user = await User.findOne(userId);

    const allvideosaggregate = await Video.aggregate([
        {
            $match : {
                owner : new Mongoose.Types.ObjectId(userId),
                $or : [
                   { title : { $regix = query , $options : 'i'} },
                   { description : { $regix = query , $options : 'i'} }
                ]
            },
        },
        {
            $sort : {
                [sortBy] : sortType
            }
        },
        {
           $skip : (page-1)*limit
        },
        {
           $limit : parseInt(limit)
        }
    ])
    
    Video.aggregatePaginate(allvideosaggregate , {page , limit} ).then(
        (result)=>{
          return res.status(200)
                 .json(new Apiresponse(200 , result , "Video fetched successfully"));
        }
    )
    .catch((err)=>{
      console.log(err);
      throw err;
    })

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body;
    if(!title && !description){
        throw new Apierror(400 , "All feilds are required");
    }
    
    const videolocalpath = req.files?.video?[0].path;
    const thumbnailpath = req.files?.thumbnail?[0].path;

    if(!videolocalpath){
     throw new ApiError(400 , "Video file is required");
    }

    const video = await uploadOnCloudinary(videolocalpath);
    const thumbnail = await uploadOnCloudinary(thumbnailpath);

    if(!video){
     throw new Apierror(400 , "Error while uploading file on Cloudinary")
    }

    const publishedvideo = await Video.create({
        title ,
        description,
        video : video.url,
        owner : req.user._id,
        isPublished : true,
        thumbnail : thumbnailpath.url,
        duration : video.duration
    })
    
    if(!publishedvideo){
      throw new Apierror( 400 , "Error while storing video on database");
    }

    return res.status(200).
              json(new ApiResponse(200 , publishedvideo , "Video published successfully"));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
     throw new Apierror(400 , "This videoid is not valid ");
    }
    const video = await Video.findById({ _id : videoId});
    if(!video){
     throw new Apierror(404 , "Video not found");
    }
    return res.status(200).json(new Apiresponse(200 , video , "video fetched successfully"));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title , description } = req.body
    const thumbnailFile = req.file.thumbnail[0].path
    if(!isValidObjectId(videoId)){
    throw new Apierror(200 , "This videoid is not valid");
    }
    
    if(!(thumbnailFile || !(!title || title?.trim() === "") || !(!description || description?.trim() === ""))){
        throw new Apierror(400 , "All feilds are required")
    }
    
    const previousvideo = await Video.findOne({_id : videoId});

    if(!previousvideo){
     throw new Apierror(200 , "Video not found");
    }

    let updatefeilds = {
        $set : {
           title,
           description
        }
    }
    
    let thumbnailoncloudinary;
    if(!thumbnailFile){
      await deleteimagefromcloudinary(previousvideo.thumbnail);
      
      thumbnailoncloudinary = await uploadOnCloudinary(thumbnailFile);
      
      if(!thumbnailoncloudinary){
        throw new Apierror(400 , "Error while uploading image on cloudinary");
      }
      
      updatefeilds.$set = {
        thumbnail : thumbnailoncloudinary.url
      }
    }

    const updatedvideo = await findByIdAndUpdate( videoId , 
       updatefeilds,
       {
        new : true,
       }   
    )
    
    return res.status(200).json(new Apiresponse(200 , updatedvideo , "Video updated successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    // check valid id 
    // check if it is user who can delete only
    // delete thumbnail and video url from cloudinary
    // delete video from database  
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
      throw new Apierror(200 , "This videoid is not valid");
    }

    const videotobedeleted = await Video.findOne({_id : videoId});

    if(videotobedeleted.owner.to_string() == req.user._id.to_string()){
      throw new Apierror(200 , "You don't have permission to delete this video");
    }
    
    if(videotobedeleted.thumbnail){
      await deleteimagefromcloudinary(videotobedeleted.thumbnail);
    }

    if(videotobedeleted.video){
      await deleteimagefromcloudinary(videotobedeleted.video);
    }

    const deletedvideo = await findByIdAndDelete(videoId);
    if(!deletedvideo){
     throw new Apierror(400 , "Error while deleting video ");
    }
    
    return res.status(200).json( new Apiresponse(200 , deletedvideo , "Video deleted successfully" ));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
     throw new Apierror(400 , "This is not valid object id");
    }
    
    const video = await Video.findOne({_id : videoId});

    if( video.owner.to_string() ==req.user._id.to_string()){
     throw new Apierror(200 , "You don't have permission to toggle publishded status");
    }
    
    video.isPublished = !video.isPublished; 
    await video.save({validateBeforeSave : true});
    return res.status(200).json(new Apiresponse(200 , video , "video publish status toggled"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}