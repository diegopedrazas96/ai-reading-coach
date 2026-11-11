import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from './config/app.config';
import { HealthModule } from './health/health.module';
import { TranscriptionModule } from './transcription/transcription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      // Works whether the API is started from apps/api or from the repo root.
      envFilePath: ['.env', '../../.env'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    TranscriptionModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
