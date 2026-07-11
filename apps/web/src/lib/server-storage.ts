import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Storage helper for server-side file operations
 */
export class StorageService {
  private supabase: any;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | Uint8Array,
    contentType: string,
    options: { upsert?: boolean; expiresIn?: number } = {}
  ): Promise<{ path: string; url: string; signedUrl?: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: options.upsert ?? false,
      });

    if (error) {
      throw new Error(`Storage upload error: ${error.message}`);
    }

    // Generate signed URL for secure access (default 1 hour expiry)
    const { data: signedData, error: signedError } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, options.expiresIn ?? 3600);

    if (signedError) {
      throw new Error(`Storage signed URL error: ${signedError.message}`);
    }

    return {
      path: data.path,
      url: signedData.signedUrl,
      signedUrl: signedData.signedUrl,
    };
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Storage delete error: ${error.message}`);
    }
  }

  /**
   * Generate a signed URL for temporary access
   */
  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Storage signed URL error: ${error.message}`);
    }

    return data.signedUrl;
  }
}

// Singleton instance
let storageServiceInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = new StorageService();
  }
  return storageServiceInstance;
}