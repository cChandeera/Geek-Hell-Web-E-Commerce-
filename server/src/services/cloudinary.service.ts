import { v2 as cloudinary } from 'cloudinary';
import { configureCloudinary } from '../config/cloudinary.config';

// Initialize Cloudinary configurations
configureCloudinary();

/**
 * Uploads a file buffer directly to Cloudinary using upload_stream.
 *
 * @param fileBuffer - The binary buffer of the file.
 * @param folder - Cloudinary folder name.
 * @returns Resolves to an object containing publicId, url, and optionally thumbnail.
 */
export const uploadBufferToCloudinary = (
  fileBuffer: Buffer,
  folder: string = 'products'
): Promise<{ publicId: string; url: string; thumbnail?: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed'));
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          thumbnail: cloudinary.url(result.public_id, {
            width: 150,
            height: 150,
            crop: 'thumb',
          }),
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary using its publicId.
 *
 * @param publicId - The Cloudinary public ID of the image to destroy.
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not_found') {
      throw new Error(`Cloudinary destroy returned: ${result.result}`);
    }
  } catch (error) {
    throw error;
  }
};
