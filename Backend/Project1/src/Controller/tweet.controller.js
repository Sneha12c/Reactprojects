import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../Models/tweet.model.js"
import {User} from "../Models/user.model.js"
import {Apierror} from "../Utils/Apierror.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/AsyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content } = req.body;
    
    if(!content || content?.trim()==="" ){
      throw new ApiError(400 , "Content feild is required");
    }
    
    const tweetcreated = await Tweet.create({
        content ,
        owner : req.user._id,
    })

    if(!tweetcreated){
     throw new Apierror(500 , "Error while creating tweet");
    }

    return res.status(200).json(new Apiresponse(200 , tweetcreated , "Tweet created successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!isValidObjectId(userId)){
     throw new Apierror(400 , "This is not valid Objectid");
    }

    const user = await User.findById(userId);
    
    if(!user){
      throw new Apierror(400 , "User doesn't exist");
    }

    const getalltweet = await Tweet.aggregate(
        {
            $match : {
                owner : userId
            }
        }
    )
    if(!getalltweet){
     throw new Apierror(500 , "Error while fetching tweets");
    }
    
    return res.status(200).json(new Apiresponse(200 , getalltweet , "All tweet fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {newContent} = req.body
     
    if(!isValidObjectId(tweetId)){
    throw new Apierror(400, "This is not valid ObjectId");
    }
    
    if(!newContent || newContent?.trim()===""){
      throw new Apierror(500 , "Content feild is required");
    }
    
    const currtweet = await Tweet.getById(tweetId);

    if(currtweet.owner.to_String() === req.user._id.to_String()){
     throw new Apierror(404 , "All ");
    }

    const updatedtweet = await Tweet.findByIdAndUpdate(tweetId , 
       {
        $set : {
          content : newContent
       }
       },
       {
        new : true
       }
    );

    if(!updateTweet){
      throw new Apierror(500 , "Error while updating successfuly");
    }
    
    return res.status(200).json(200 , updatedtweet , "Tweet updated successfully");
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
      throw new Apierror(400 , "This is not valid Objectid")
    }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new Apierror(404, "no tweet found!");
    }
    if(tweet.owner.to_String() === req.user._id.to_String()){
     throw new Apierror(400 , "You don't have permission to delete tweet");
    }

    const deletedtweet =await findByIdAndDelete(tweetId);
    
    if(!deletedtweet){
     throw new Apierror(404 , "Error while deleting tweet from database");
    }
    
    return res.status(200).json(new Apiresponse(200 , deletedtweet , "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}