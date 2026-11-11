import OpenAI, { toFile } from 'openai';
import { getAudioExtension, getBaseMimeType } from '../utils/audio';
import {
  TranscriptionProviderError,
  type TranscriptionFailureReason,
  type TranscriptionProvider,
} from './transcription-provider.interface';

function classifyOpenAIError(error: unknown): TranscriptionFailureReason {
  if (!(error instanceof OpenAI.APIError)) return 'unknown';
  if (error.status === 429) return error.code === 'insufficient_quota' ? 'quota' : 'rate_limit';
  if (error.status === 401 || error.status === 403) return 'auth';
  return 'unknown';
}

/** Speech-to-text backed by the OpenAI audio transcription API. */
export class OpenAITranscriptionProvider implements TranscriptionProvider {
  readonly isConfigured = true;
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async transcribe(audio: Buffer, mimeType: string): Promise<string> {
    const type = getBaseMimeType(mimeType);
    const file = await toFile(audio, `reading.${getAudioExtension(type)}`, { type });
    try {
      const output = await this.client.audio.transcriptions.create({
        file,
        model: this.model,
        language: 'en',
      });
      return output.text.trim();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new TranscriptionProviderError(classifyOpenAIError(error), message);
    }
  }
}

/** Null-object provider used when no API key is configured. */
export class UnconfiguredTranscriptionProvider implements TranscriptionProvider {
  readonly isConfigured = false;

  transcribe(): Promise<string> {
    return Promise.reject(new TranscriptionProviderError('auth', 'No API key configured.'));
  }
}
