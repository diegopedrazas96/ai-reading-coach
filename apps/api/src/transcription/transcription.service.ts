import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ApiException } from '../common/exceptions/api.exception';
import {
  TRANSCRIPTION_PROVIDER,
  TranscriptionProviderError,
  type TranscriptionProvider,
} from './providers/transcription-provider.interface';

const BILLING_URL = 'https://platform.openai.com/settings/organization/billing';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(@Inject(TRANSCRIPTION_PROVIDER) private readonly provider: TranscriptionProvider) {}

  get isConfigured(): boolean {
    return this.provider.isConfigured;
  }

  assertConfigured(): void {
    if (!this.provider.isConfigured) {
      throw new ApiException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'OpenAI API key not configured. Use browser mode or add OPENAI_API_KEY to .env.',
        'TRANSCRIPTION_NOT_CONFIGURED',
      );
    }
  }

  async transcribe(audio: Buffer, mimeType: string): Promise<string> {
    this.assertConfigured();
    try {
      return await this.provider.transcribe(audio, mimeType);
    } catch (error) {
      throw this.toApiException(error);
    }
  }

  private toApiException(error: unknown): ApiException {
    const reason = error instanceof TranscriptionProviderError ? error.reason : 'unknown';
    this.logger.warn(
      `Transcription failed (${reason}): ${error instanceof Error ? error.message : error}`,
    );

    switch (reason) {
      case 'quota':
        return new ApiException(
          HttpStatus.SERVICE_UNAVAILABLE,
          `Your OpenAI account has no credits remaining. Add credits at ${BILLING_URL} to use OpenAI mode.`,
          'TRANSCRIPTION_QUOTA_EXCEEDED',
        );
      case 'rate_limit':
        return new ApiException(
          HttpStatus.TOO_MANY_REQUESTS,
          'OpenAI is rate limiting requests. Please wait a moment and try again.',
          'TRANSCRIPTION_RATE_LIMITED',
        );
      case 'auth':
        return new ApiException(
          HttpStatus.BAD_GATEWAY,
          'OpenAI rejected the API key. Check OPENAI_API_KEY in .env.',
          'TRANSCRIPTION_AUTH_FAILED',
        );
      default:
        return new ApiException(
          HttpStatus.BAD_GATEWAY,
          'Audio transcription failed. Please try again.',
          'TRANSCRIPTION_FAILED',
        );
    }
  }
}
