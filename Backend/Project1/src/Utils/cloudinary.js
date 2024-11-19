import {v2 as cloudinary} from "Cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

const deleteimagefromcloudinary = async(localfilepath)=>{
    try{
     const response = await cloudinary.uploader.destroy(localfilepath , {
        resource_type : "auto"
     });
     return response;
    }
    catch(err){
     console.log(err);
    }
}

const uploadvideooncloudinary = async(localvideopath)=>{
    try{
     const response = await cloudinary.uploader.upload_large(
        localvideopath , 
        {resource_type : "video" ,chunk_size: 6000000 }, 
     ) 
     fs.unlinkSync(localvideopath);
     return response;
    }
    catch(err){
    fs.unlinkSync(localvideopath);
     console.log(err);
    }
}

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

export {uploadonCloudinary , deleteimagefromcloudinary};
