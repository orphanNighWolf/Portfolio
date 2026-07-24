import { v2 as cloudinary } from "cloudinary";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryClient = cloudinary;

/**
 * Uploads a local file or buffer to Cloudinary.
 * (Stub/wrapper utility implementation)
 */
export async function uploadImage(fileUrl: string, folder = "portfolio"): Promise<{ url: string; publicId: string }> {
  logger.info(`Cloudinary: Uploading image stub called for file: ${fileUrl} inside folder: ${folder}`);
  return {
    url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || "mock-cloud"}/image/upload/v12345678/${folder}/mock-file.jpg`,
    publicId: `${folder}/mock-file`,
  };
}

/**
 * Deletes an image from Cloudinary by public ID.
 * (Stub/wrapper utility implementation)
 */
export async function deleteImage(publicId: string): Promise<{ result: string }> {
  logger.info(`Cloudinary: Delete image stub called for publicId: ${publicId}`);
  return {
    result: "ok",
  };
}

/**
 * Uploads an image buffer directly to Cloudinary.
 * Fallbacks to a mock URL if API credentials are not configured.
 */
export async function uploadImageBuffer(fileBuffer: Buffer, folder = "portfolio"): Promise<{ url: string; publicId: string }> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME === "your_cloudinary_cloud_name" ||
    process.env.CLOUDINARY_CLOUD_NAME === "mock_cloudinary_cloud_name"
  ) {
    logger.info("Cloudinary credentials missing, returning mock upload URL");
    const mockId = `mock-${Date.now()}`;
    return {
      url: `https://res.cloudinary.com/mock-cloud/image/upload/v12345678/${folder}/${mockId}.jpg`,
      publicId: `${folder}/${mockId}`,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          logger.error({ err: error }, "Cloudinary Upload Stream Error");
          return reject(error);
        }
        if (!result) return reject(new Error("Upload result undefined"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}
