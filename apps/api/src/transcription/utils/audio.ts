import { SUPPORTED_AUDIO_MIME_TYPES } from '@reading-coach/shared';

const SUPPORTED: ReadonlySet<string> = new Set(SUPPORTED_AUDIO_MIME_TYPES);

/** Strips parameters such as `;codecs=opus` from a MIME type. */
export function getBaseMimeType(mimeType: string): string {
  return mimeType.split(';')[0].trim().toLowerCase();
}

export function isSupportedAudioType(mimeType: string): boolean {
  return SUPPORTED.has(getBaseMimeType(mimeType));
}

/** File extension the transcription provider uses to detect the format. */
export function getAudioExtension(mimeType: string): string {
  const type = getBaseMimeType(mimeType);
  if (type.includes('webm')) return 'webm';
  if (type.includes('ogg')) return 'ogg';
  if (type.includes('wav')) return 'wav';
  if (type.includes('mp4')) return 'mp4';
  return 'mp3';
}
