/** DI token for the active speech-to-text provider. */
export const TRANSCRIPTION_PROVIDER = Symbol('TRANSCRIPTION_PROVIDER');

export type TranscriptionFailureReason = 'quota' | 'rate_limit' | 'auth' | 'unknown';

/** Provider-agnostic failure, so the service never depends on a vendor SDK's errors. */
export class TranscriptionProviderError extends Error {
  constructor(
    public readonly reason: TranscriptionFailureReason,
    message: string,
  ) {
    super(message);
    this.name = 'TranscriptionProviderError';
  }
}

export interface TranscriptionProvider {
  /** False when the provider has no credentials (e.g. missing API key). */
  readonly isConfigured: boolean;
  transcribe(audio: Buffer, mimeType: string): Promise<string>;
}
