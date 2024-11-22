import { Buffer } from 'buffer';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// path: string
export const sendImageToCloudinary = (
  imageName: string,
  buffer: Buffer,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: imageName.trim() },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
      },
    );

    // Stream the buffer to Cloudinary
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Function to delete image from Cloudinary
export const deleteImageFromCloudinary = (imageName: string): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imageName.trim(), function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
