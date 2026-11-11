import { API_ROUTES, AUDIO_FIELD_NAME, MAX_AUDIO_UPLOAD_BYTES } from '@/constants';
import type { ApiErrorResponse, TranscribeResponse } from '@/types';
import { getRecordingFileName } from '@/utils/audio';
import { ApiError } from '@/utils/errors';

type TranscribePayload = Partial<TranscribeResponse & ApiErrorResponse>;

/** Uploads a recording to the API and returns the recognized text. */
export async function transcribeAudio(blob: Blob, signal?: AbortSignal): Promise<string> {
  if (blob.size === 0) throw new Error('No audio was captured.');
  if (blob.size > MAX_AUDIO_UPLOAD_BYTES) {
    throw new Error('The recording is too long. Please try a shorter reading.');
  }

  const body = new FormData();
  body.append(AUDIO_FIELD_NAME, blob, getRecordingFileName(blob.type));

  const response = await fetch(API_ROUTES.transcribe, { method: 'POST', body, signal });
  const payload = (await response.json().catch(() => ({}))) as TranscribePayload;

  if (!response.ok) {
    throw new ApiError(
      payload.error ?? 'Transcription request failed.',
      response.status,
      payload.code,
    );
  }
  return payload.transcript ?? '';
}
