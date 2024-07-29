const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { config,
  geocoding,
  geolocation,
  coordinates,
  data,
  staticMaps,}=require("@maptiler/client");


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png","jpg","jpeg"], // supports promises as well
      
    },
  });


  
// let maptilerClient.config.apiKey =process.env.MAP_API_KEY;
  
  module.exports={
    cloudinary,
    storage,

  };