
//todo Adding the cloudinary;

import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import {CloudinaryStorage} from "multer-storage-cloudinary"
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPI,
  api_secret: process.env.CLOUDSECRET,
});

// const storage = new CloudinaryStorage ({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'SEB Storage',
//       resource_type: "auto",
//       allowed_formats: ["png", "jpg", "jpeg","pdf"],
//       //  transformation: [{ width: 800, height: 800, crop: "limit" }]
//     },
// })

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.mimetype === 'application/pdf') {
      return {
        folder: 'SEB Storage/Notices',  // optional: separate folder for clarity
        resource_type: 'raw',
        allowed_formats: ['pdf']
      };
    }
    return {
      folder: 'SEB Storage/Posters',    // separate folder for images
      resource_type: 'image',
      allowed_formats: ['png','jpg','jpeg']
    };
  },
});



export  {cloudinary, storage};