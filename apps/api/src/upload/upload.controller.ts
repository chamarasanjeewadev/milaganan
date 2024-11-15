import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('postId') postId: string,
  ) {
    const url = await this.uploadService.upload(
      postId,
      file.originalname,
      file,
    );
    return {
      url,
      path: `${postId}/${file.originalname}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Body('postId') postId: string,
  ) {
    console.log('inside logo upload');
    const key = await this.uploadService.uploadLogo(postId, file);
    
    const bucketName = this.configService.get('AWS_BUCKET_NAME');
    const region = this.configService.get('AWS_REGION');
    const fullUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    
    return {
      url: fullUrl,
      path: key,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Get('logo/:postId')
  async getLogo(@Param('postId') postId: string) {
    const logoInfo = await this.uploadService.getLogo(postId);
    return logoInfo;
  }
}
