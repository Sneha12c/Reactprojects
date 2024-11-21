import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../Models/user.model.js"
import { Subscription } from "../Models/subscription.model.js"
import {Apierror} from "../Utils/Apierror.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/AsyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if(!isValidObjectId(channelId)){
     throw new Apierror(200 , "This is not valid objectid");
    }

    const hassubscribed = await Subscription.findOne({
        channel : channelId , 
        subscriber : req.user._id
    });
    
    if(!hassubscribed){
     const newSubscription = await Subscription.create({
        channel : channelId , 
        subscriber : req.user._id 
     })
     if(!newSubscription){
      throw new Apierror(200 , "Error while toggling");
     }
     return res.status(200).json(new Apiresponse(200 , newSubscription , "Subscription toggled successfully "));
    }
    else{
      const subscriptiontobedeleted = await Subscription.findOneAndDelete({
        channel : channelId , 
        subscriber : req.user._id 
      });
      if(!subscriptiontobedeleted){
        throw new Apierror(200 , "Error while toggling ");
      }
      return res.status(200).json(new Apiresponse(200 , subscriptiontobedeleted , "Subscription toggled successfully"));
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const getallsubscriber = await Subscription.aggregate(
      {
        $match : {
           channel : new mongoose.Types.ObjectId(channelId?.trim()),
        }
      },
      {
        $lookup : {
           from : "users",
           localfeild : "subscriber",
           foreignFeild : "_id",
           as : "subscriber", 
        }
      },
      {
        $project : {
          username : 1,
          fullname : 1,
          avatar : 1, 
        }
      }
    )
    return res.status(200).json(new Apiresponse(200 , getallsubscriber , "All list of subscriber fetched successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const getallsubscriberchannel = await Subscription.aggregate([
      {
        $match : {
           subscriber : subscriberId,
        }
      },
      {
        $lookup : {
           from : "users",
           localfeild : "channel",
           foreignFeild : "_id",
           result : "channel",
        }
      },
      {
        $project : {
            username : 1,
            fullname : 1,
            avatar : 1
        }
      }
    ])
    return res.status(200).json(new Apiresponse(200 , getallsubscriberchannel , "All list of channel subscribed by user fetched successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}