import mongoose from "mongoose";

const LikeSchema = mongoose.Schema({
    id : {
      type : String,
    },
    likedBy : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    },
    video : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Video",
    },
    comment : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Comment"
    },
    tweet : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Tweet"
    }
}, {timeStamps : true })

export default Like = mongoose.model("Like" , LikeSchema);
