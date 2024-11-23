import mongoose, { Schema } from "mongoose";
import mongooseAggregation from "mongoose-aggregate-paginate-v2";

const CommentSchema = mongoose.Schema({
   content : {
     type : String,
     required : true,
   },
   owner : {
     type : Schema.Types.ObjectId,
     ref : "User"
   },
   video : {
     type : Schema.Types.ObjectId,
     ref : "Video"
   }
} , {timeStamps : true})

CommentSchema.plugin(mongooseAggregation);

export default Comment = mongoose.model("Comment" , CommentSchema);
