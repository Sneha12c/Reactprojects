import {v2 as cloudinary} from "Cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

const uploadonCloudinary = async (localfilepath)=>{
    try{
     const response = await cloudinary.uploader.upload(localfilepath , {
        resource_type : "auto"
     })
    //  console.log(response.url);
     fs.unlinkSync(localfilepath);
     return response;
    }
    catch(err){
     fs.unlinkSync(localfilepath); // remove the locally saved file
    }
}

export default uploadonCloudinary;
