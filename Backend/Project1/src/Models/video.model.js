import Mongoose from "mongoose";
import mongooseAggregation from "mongoose-aggregate-paginate-v2"; 

const videoSchema = Mongoose.Schema({
   video : {
     type : String,
     required : true,
     unique : true,
   },
   thumbnail : {
     type : String,
     required : true,
     unique : true,
   },
   title : {
     type : String,
     required : true,
   },
   description : {
    type : String,
    required : true,
   },
   views : {
    type : Number,
    required : true,
   },
   isPublished : {
    type : Boolean,
    required : true,
   },
   owner : {
    type : Mongoose.Schema.Types.ObjectId,
    ref: "User",
   },
}, {timestamps : true})

videoSchema.plugin(mongooseAggregation);

export const Video = mongoose.model("Video" , videoSchema);


