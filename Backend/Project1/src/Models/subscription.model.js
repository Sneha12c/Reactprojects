import {Mongoose} from "mongoose";

const subscriptionSchema = new Schema({
   subscriber : {
      type : Mongoose.Schema.Types.ObjectId,
      ref : "User"
   },
   channel : {
      type : Mongoose.Schema.Types.ObjectId,
      ref : "User"
   }
} , {timeStamps : true });

export const subscription = Mongoose.model( "subscription" , subscriptionSchema);

