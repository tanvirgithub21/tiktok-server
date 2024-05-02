import { v2 as cloudinary } from 'cloudinary';




export const cloudinaryVideoDelete = async (videoId) => {
    try{

        const result = await cloudinary.uploader.destroy(videoId, { resource_type: 'video' },)
        console.log(result)
        return result
    }catch(error){

        console.log(error)
        console.log("cloudinary video delete error")
        return error
    }
    
}