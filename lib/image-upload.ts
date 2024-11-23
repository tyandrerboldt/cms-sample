import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const getUploadDir = () => {
  const uploadDir = process.env.UPLOAD_DIR;
  if (!uploadDir) {
    throw new Error('UPLOAD_DIR environment variable is not set');
  }
  return uploadDir;
};

export async function saveImage(file: File, folder: string = 'packages'): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueFilename = `${uuidv4()}-${file.name}`;
    
    // Get base upload directory from env
    const baseUploadDir = getUploadDir();
    
    // Create full directory path
    const uploadDir = join(baseUploadDir, folder);
    const fullPath = join(baseUploadDir, folder, uniqueFilename);

    // Create the full URL path that will be stored in the database
    const storagePath = join(baseUploadDir, folder, uniqueFilename).replace(/\\/g, '/');

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save the file
    await writeFile(fullPath, buffer);
    
    // Return the complete path for storage in database
    return storagePath;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    // Since the full path is now stored in the database, we can use it directly
    await unlink(imageUrl);
  } catch (error) {
    // Ignore errors if file doesn't exist
    if ((error as any).code !== 'ENOENT') {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}