import * as fs from 'fs';
import * as path from 'path';
import { access } from 'fs/promises';
import { writeFile, unlink } from 'fs/promises';

export const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  }
};

export const checkIfFileExists = async (filePath: string) => {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      console.log(`Error in file check exists: ${filePath}`);
    }
  }
};

export const saveAttachment = (
  file: Express.Multer.File,
  directory: string,
): string => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const filePath = path.join(__dirname, directory, fileName);

  // Ensure the directory exists
  createFolderIfNotExists(path.join(__dirname, directory));

  writeFile(filePath, file.buffer)
    .then(() => {
      console.log(`File saved successfully at ${filePath}`);
    })
    .catch((error) => {
      console.error('Error saving file:', error);
    });

  return fileName;
};
export const deleteAttachment = async (
  fileName: string,
  directory: string,
): Promise<void> => {
  const filePath = path.join(__dirname, directory, fileName);

  const fileExists = await checkIfFileExists(filePath);

  if (!fileExists) {
    return;
  }

  unlink(filePath);
};
