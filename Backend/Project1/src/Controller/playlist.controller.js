import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../Models/playlist.model.js"
import {Apierror} from "../Utils/Apierror.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/AsyncHandler.js"
import { User } from "../Models/user.model.js"
import { Video } from "../Models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    
    if(!name || !description || name?.trim()=="" || description?.trim()==""){
     throw new Apierror(400 , "All feilds are required");
    }

    const playlist = await Playlist.create({ name , description , owner : req.user._id });

    if(!playlist){
     throw new Apierror(400 , "Error while creating playlist");
    }

    return res.status(200).json(new Apiresponse(200 , playlist , "Playlist created successfully"));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!isValidObjectId(userId)){
     throw new Apierror(400 , "This is not valid ObjectId");
    }
    const user = await User.findById(userId);
    if(!user){
     throw new Apierror(400 , "User doesn't exist");
    }
    const playlist = await Playlist.aggregate([
        {
            $match : {
               owner : new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $lookup : {
               from : "videos",
               localField : "video",
               foreignField : "_id",
               result : "videos",
            }
        },
        {
            $addfeilds : {
              playlist : {
                $first : "$videos"
              }
            }
        }
    ])
    
    if(!playlist){
     throw new Apierror(400 , "Error while fetching playlist");
    }
    
    return res.status(200).json(new Apiresponse(200 , playlist , "Playlist fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
      throw new Apierror(404 , "This is not valid ObjectId");
    }
    
    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
      throw new Apierror(400 , "Error while fetching playlist");
    }
    
    return res.status(200).json(new Apiresponse(200 , playlist , "Playlist fetched successfully"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
      throw new Apierror(400 , "This is not valid ObjectId ");
    }

    const playlist = await Playlist.findById(playlistId);
    
    if(!playlist){
     throw new Apierror(400 , "Playlist not found");
    }
    
    const video = await Video.findById(videoId);

    if(!video){
     throw new Apierror(400 , "Video doesn't exist");
    }

    if(video.owner.to_String() !== req.user._id.to_String()){
      throw new Apierror(400 , "You don't have permission to add video");
    }

    playlist.videos.push(videoId);
    await playlist.save({validateBeforeSave : false});
    
    return res.status(200).json(new Apiresponse(200 , playlist , "Video added successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new Apierror(400 , "This is not valid ObjectId ");
      }
  
      const playlist = await Playlist.findById(playlistId);
      
      if(!playlist){
       throw new Apierror(400 , "Playlist not found");
      }
      
      if(!playlist.video.includes(videoId)){
       throw new Apierror(400 , "Video doesn't exist");
      }
      
      const updatedplaylist = Playlist.findByIdAndUpdate(playlistId , {
         $pull : {
           video : videoId
         }  
        }, 
       {
        new : true,
       })
      
      return res.status(200).json(new Apiresponse(200 , updatedplaylist , "Video removed successfully"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
     throw new Apierror(400 , "This is not valid ObjectID");
    }
    
    const playlist = await Playlist.findById(playlistId);
    
    if(!playlist){
     throw new Apierror(200 , "Playlist don't exist")
    }

    if( playlist.owner.to_String() !== req.user._id.to_String()){
     throw new Apierror(400 , "You don't have permission to delete playlist")
    }

    const deletedplaylist = await Playlist.findByIdAndDelete(playlistId);
    
    if(!deletedplaylist){
     throw new Apierror(400 , "Error while deleting playlist ");
    }

    return res.status(200).json(new Apiresponse(200 , playlist , "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!isValidObjectId(playlistId)){
      throw new Apierror(200 , "This is not valid objectid");
    }
    
    if(!name || !description || name.trim()==="" || description.trim() === ""){
       throw new Apierror(400 , "All feilds is required");
    }

    const playlist = await Playlist.findByIdAndUpdate( playlistId , 
        {
            $set : {
              name : 1,
              description : 1
            }
        },
        {
            new : true
        }
     )
    
    if(!playlist){
     throw new Apierror(400 , "Error in updating playlist");
    }
    
    return res.status(200).json(new Apiresponse(200 , playlist , "Playlist updated successfully"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}