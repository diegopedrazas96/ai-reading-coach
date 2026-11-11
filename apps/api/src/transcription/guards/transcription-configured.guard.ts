import { Injectable, type CanActivate } from '@nestjs/common';
import { TranscriptionService } from '../transcription.service';

/**
 * Rejects early (before the upload is buffered) when no provider is configured.
 * Guards run before interceptors, so this fires ahead of the file interceptor.
 */
@Injectable()
export class TranscriptionConfiguredGuard implements CanActivate {
  constructor(private readonly transcription: TranscriptionService) {}

  canActivate(): boolean {
    this.transcription.assertConfigured();
    return true;
  }
}
