import mongoose from "mongoose";

const playlistSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    videos : [
         {
           type : mongoose.Schema.Types.ObjectId,
           ref : "Video"
         }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

}, {timeStamps : true});

export default playlistSchema;
