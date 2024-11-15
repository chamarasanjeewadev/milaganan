import { Module } from '@nestjs/common';
import { MarkdownModule } from './markdown/markdown.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MarkdownModule,
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // Add any other config options here
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 600, // Time window in seconds
        limit: 100, // Number of requests allowed in the time window
      },
    ]),
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
