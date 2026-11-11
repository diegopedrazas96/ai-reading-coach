import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { HealthResponse } from '@reading-coach/shared';
import { TranscriptionService } from '../transcription/transcription.service';

@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly transcription: TranscriptionService) {}

  @Get()
  check(): HealthResponse {
    return { status: 'ok', transcriptionConfigured: this.transcription.isConfigured };
  }
}
