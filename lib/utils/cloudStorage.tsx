import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudStorage(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      file.arrayBuffer().then((buffer) => {
        const uint8Array = new Uint8Array(buffer);
        uploadStream.end(uint8Array);
      });
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
}

export async function deleteFromCloudStorage(url: string): Promise<void> {
  const publicId = url.split('/').pop()?.split('.')[0];

  if (!publicId) {
    throw new Error('Invalid URL');
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file from cloud storage');
  }
}