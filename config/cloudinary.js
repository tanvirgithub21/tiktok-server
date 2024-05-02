import { v2 as cloudinary } from 'cloudinary';

export const connectCloudinary = () => {
try{
    // Configure Cloudinary with your Cloudinary credentials
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloud_api_key,
    api_secret: process.env.cloud_api_secret
  })

  console.log("setup Cloudinary config")
}catch{
    console.log("cloudinary config error")
}
}