import mongoose from "mongoose";
import { DB_name } from "../constants.js";

const connectdb = async ()=>{
   try{
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`);
    console.log( `Mongo db connected ${connection.connection.host}`);
   }
   catch(err){
    console.log("Error is " , err);
    process.exit(1);
   }
}

export default connectdb;
