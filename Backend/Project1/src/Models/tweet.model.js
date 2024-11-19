import mongoose from "mongoose";

const tweetSchema = mongoose.Schema({
   content : {
     type : String,
     required : true,
   },
   owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
   }
}, {timeStamps : true});

export default Tweet = mongoose.model("tweet" , tweetSchema);
