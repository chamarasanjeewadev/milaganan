import { Injectable } from '@nestjs/common';
import { CreateMarkdownRequestDto } from '@repo/types';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  NotFound,
} from '@aws-sdk/client-s3';

@Injectable()
export class MarkdownService {
  private readonly s3Client: S3Client;
  private readonly config = {
    bucket: process.env.AWS_BUCKET_NAME || 'milaganan-bucket',
    region: process.env.AWS_REGION || 'us-east-1',
    contentType: 'text/markdown',
    fileExtension: '.md',
  };

  constructor() {
    this.s3Client = this.initializeS3Client();
  }

  private initializeS3Client(): S3Client {
    return new S3Client({
      region: this.config.region,
    });
  }

  private generateS3Key(uniqueId: string): string {
    return `${uniqueId}/content${this.config.fileExtension}`;
  }

  private generateS3Url(key: string): string {
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  private async checkIfContentExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
        }),
      );
      return true;
    } catch (error) {
      if (error instanceof NotFound) {
        return false;
      }
      // Log other unexpected errors but still return false
      console.warn('Error checking if content exists:', error);
      return false;
    }
  }

  async updateMarkdown(markdownContent: CreateMarkdownRequestDto) {
    console.log('inside service');
    const uniqueId = markdownContent.id;
    console.log('uniqueId', uniqueId);

    const key = this.generateS3Key(uniqueId);
    console.log('key', key);

    try {
      const exists = await this.checkIfContentExists(key);
      console.log(
        exists
          ? `Content already exists for ID ${uniqueId}, overriding...`
          : `Creating new content for ID ${uniqueId}`,
      );

      const metadata: Record<string, string> = {
        font: markdownContent.font || 'default',
      };

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
          Body: markdownContent.content,
          ContentType: this.config.contentType,
          Metadata: metadata,
        }),
      );

      return {
        id: uniqueId,
        url: this.generateS3Url(key),
        font: markdownContent.font,
      };
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to save markdown content', error);
    }
  }

  async getMarkdownContent(uniqueId: string) {
    const key = this.generateS3Key(uniqueId);
    console.log('generated key', key);

    try {
      const exists = await this.checkIfContentExists(key);

      if (!exists) {
        return {
          content: '',
          id: null,
          contentType: null,
          font: null,
        };
      }

      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
        }),
      );

      if (!response.Body) {
        return {
          content: '',
          id: null,
          contentType: null,
          font: null,
        };
      }

      const content = await response.Body.transformToString();

      return {
        content,
        id: uniqueId,
        contentType: response.ContentType,
        font: response.Metadata?.font || 'default',
      };
    } catch (error) {
      console.error('Error fetching markdown content...:', error);
      return {
        content: '',
        id: null,
        contentType: null,
        font: null,
      };
    }
  }
}
