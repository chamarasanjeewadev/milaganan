import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { CreateMarkdownRequestDto } from '@repo/types';

@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Get(':id')
  async getMarkdownContent(@Param('id') id: string) {
    try {
      console.log('..............................inside getMarkdownContent');
      return await this.markdownService.getMarkdownContent(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to retrieve markdown content',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  async updateMarkdown(@Body() body: CreateMarkdownRequestDto) {
    // console.log('inside controller', body);
    try {
      console.log('working.....');
      return await this.markdownService.updateMarkdown(body);
    } catch (error) {
      console.log('error at controller', error);
      throw new HttpException(
        'Failed to save markdown content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
