import { Module } from '@nestjs/common';
import { appConfig, type AppConfig } from '../config/app.config';
import {
  OpenAITranscriptionProvider,
  UnconfiguredTranscriptionProvider,
} from './providers/openai-transcription.provider';
import {
  TRANSCRIPTION_PROVIDER,
  type TranscriptionProvider,
} from './providers/transcription-provider.interface';
import { TranscriptionController } from './transcription.controller';
import { TranscriptionService } from './transcription.service';

@Module({
  controllers: [TranscriptionController],
  providers: [
    {
      provide: TRANSCRIPTION_PROVIDER,
      inject: [appConfig.KEY],
      useFactory: (config: AppConfig): TranscriptionProvider =>
        config.openaiApiKey
          ? new OpenAITranscriptionProvider(config.openaiApiKey, config.transcriptionModel)
          : new UnconfiguredTranscriptionProvider(),
    },
    TranscriptionService,
  ],
  exports: [TranscriptionService],
})
export class TranscriptionModule {}
