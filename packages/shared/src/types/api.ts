/**
 * HTTP contract shared by the React client and the NestJS API.
 * Keep this file free of runtime code so both sides can import it safely.
 */

export interface TranscribeResponse {
  transcript: string;
}

export interface HealthResponse {
  status: 'ok';
  transcriptionConfigured: boolean;
}

/** Machine-readable reasons the client can react to (e.g. show billing help). */
export type ApiErrorCode =
  | 'TRANSCRIPTION_NOT_CONFIGURED'
  | 'TRANSCRIPTION_QUOTA_EXCEEDED'
  | 'TRANSCRIPTION_RATE_LIMITED'
  | 'TRANSCRIPTION_AUTH_FAILED'
  | 'TRANSCRIPTION_FAILED'
  | 'VALIDATION_FAILED'
  | 'INTERNAL_ERROR';

export interface ApiErrorResponse {
  error: string;
  code?: ApiErrorCode;
}
