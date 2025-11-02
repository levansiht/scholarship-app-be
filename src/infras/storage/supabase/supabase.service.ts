import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly supabase: SupabaseClient;
  private readonly bucketName = 'application-documents';

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_KEY in environment variables.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized');
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    applicationId: string,
  ): Promise<string> {
    const filePath = `${applicationId}/${Date.now()}-${fileName}`;

    this.logger.log(`Uploading file: ${filePath}`);

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file, {
        contentType: this.getContentType(fileName),
        upsert: false,
      });

    if (error) {
      this.logger.error(`Upload failed: ${error.message}`, error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(data.path);

    this.logger.log(`File uploaded successfully: ${publicUrl}`);
    return publicUrl;
  }

  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; originalName: string }>,
    applicationId: string,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file.buffer, file.originalName, applicationId),
    );

    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const filePath = this.extractFilePathFromUrl(fileUrl);

    if (!filePath) {
      this.logger.warn(`Invalid file URL: ${fileUrl}`);
      return;
    }

    this.logger.log(`Deleting file: ${filePath}`);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      this.logger.error(`Delete failed: ${error.message}`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    this.logger.log(`File deleted successfully: ${filePath}`);
  }

  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    const deletePromises = fileUrls.map((url) => this.deleteFile(url));
    await Promise.all(deletePromises);
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    const filePath = this.extractFilePathFromUrl(fileUrl);

    if (!filePath) {
      throw new Error(`Invalid file URL: ${fileUrl}`);
    }

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(filePath, 3600); // 1 hour

    if (error) {
      this.logger.error(`Failed to create signed URL: ${error.message}`, error);
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      txt: 'text/plain',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  private extractFilePathFromUrl(fileUrl: string): string | null {
    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf(this.bucketName);

      if (bucketIndex === -1) {
        return null;
      }

      return pathParts.slice(bucketIndex + 1).join('/');
    } catch (error) {
      this.logger.error(`Failed to parse URL: ${fileUrl}`, error);
      return null;
    }
  }

  async ensureBucketExists(): Promise<void> {
    const { data: buckets, error: listError } =
      await this.supabase.storage.listBuckets();

    if (listError) {
      this.logger.error(`Failed to list buckets: ${listError.message}`);
      return;
    }

    const bucketExists = buckets?.some(
      (bucket) => bucket.name === this.bucketName,
    );

    if (!bucketExists) {
      this.logger.log(`Creating bucket: ${this.bucketName}`);

      const { error: createError } = await this.supabase.storage.createBucket(
        this.bucketName,
        {
          public: true,
          fileSizeLimit: 10485760,
        },
      );

      if (createError) {
        this.logger.error(
          `Failed to create bucket: ${createError.message}`,
          createError,
        );
      } else {
        this.logger.log(`Bucket created successfully: ${this.bucketName}`);
      }
    }
  }
}
