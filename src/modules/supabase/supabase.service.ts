import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { StorageClient } from '@supabase/storage-js';

export type UploadFileOptions = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  instance: 'images' | 'files';
  userId: string;
};

@Injectable()
export class SupabaseService {
  private readonly supabase: StorageClient;

  constructor() {
    const SUPABASE_URL = `${process.env.SUPABASE_URL}/storage/v1`;
    const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

    this.supabase = new StorageClient(SUPABASE_URL, {
      apiKey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    });
  }

  async uploadToSupabase(options: UploadFileOptions): Promise<string | null> {
    const { buffer, fileName, mimeType, instance, userId } = options;

    // Generate a unique file name
    const generatedFileName = `${userId}/${Date.now()}-${uuid()}-${fileName}`;

    try {
      const { error, data } = await this.supabase
        .from(instance)
        .upload(generatedFileName, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading to Supabase: ${error.message}`);
        return null;
      }

      // Return the full public URL of the uploaded file
      return `${process.env.SUPABASE_URL}/storage/v1/object/public/${instance}/${data.path}`;
    } catch (err) {
      console.error(`Unexpected error during file upload: ${err.message}`);
      return null;
    }
  }
}
