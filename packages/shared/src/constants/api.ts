/** Global prefix for every API route. */
export const API_PREFIX = 'api';

/** Route paths as seen by the browser (prefix included). */
export const API_ROUTES = {
  health: `/${API_PREFIX}/health`,
  transcribe: `/${API_PREFIX}/transcribe`,
} as const;

/** Multipart field name that carries the audio upload. */
export const AUDIO_FIELD_NAME = 'audio';

/** Largest accepted audio upload. */
export const MAX_AUDIO_UPLOAD_BYTES = 15 * 1024 * 1024;

/** Base MIME types the transcription endpoint accepts. */
export const SUPPORTED_AUDIO_MIME_TYPES = [
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
] as const;
