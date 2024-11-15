import { Injectable, BadRequestException } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(postId: string, fileName: string, file: Express.Multer.File) {
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Empty file buffer received');
    }

    try {
      const uniqueFileName = `${fileName}`;
      const key = `${postId}/${uniqueFileName}`;
      const bucketName = this.configService.getOrThrow('AWS_BUCKET_NAME');

      // Log file details for debugging
      console.log('Upload details:', {
        bucketName,
        key,
        contentType: file.mimetype,
        bufferLength: file.buffer.length,
        originalName: file.originalname,
      });

      const uploadResult = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        }),
      );

      console.log('Upload result:', uploadResult);
      return key;
    } catch (error: unknown) {
      console.error('Upload error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to upload file',
      );
    }
  }

  async uploadLogo(postId: string, file: Express.Multer.File) {
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Empty file buffer received');
    }

    try {
      const fileExtension = file.originalname.split('.').pop();
      const key = `${postId}/logo.${fileExtension}`;
      const bucketName = this.configService.getOrThrow('AWS_BUCKET_NAME');

      console.log('Logo upload details:', {
        bucketName,
        key,
        contentType: file.mimetype,
        bufferLength: file.buffer.length,
        originalName: file.originalname,
      });

      const uploadResult = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        }),
      );

      console.log('Logo upload result:', uploadResult);
      return key;
    } catch (error: unknown) {
      console.error('Logo upload error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to upload logo',
      );
    }
  }

  async getLogo(postId: string) {
    try {
      const bucketName = this.configService.getOrThrow('AWS_BUCKET_NAME');
      const region = this.configService.getOrThrow('AWS_REGION');

      // Check if the logo exists
      const key = `${postId}/logo.jpg`; // You might want to make this more flexible

      try {
        await this.s3Client.send(
          new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
          }),
        );

        const fullUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

        return {
          url: fullUrl,
          path: key,
          timestamp: Date.now(),
        };
      } catch (error) {
        // If the logo doesn't exist, return undefined
        return {
          url: undefined,
          path: undefined,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error('Error getting logo:', error);
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to get logo',
      );
    }
  }
}
