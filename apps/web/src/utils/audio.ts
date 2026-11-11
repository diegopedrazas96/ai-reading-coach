/** Picks an upload file name whose extension matches the recorded MIME type. */
export function getRecordingFileName(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'reading.mp4';
  if (mimeType.includes('ogg')) return 'reading.ogg';
  return 'reading.webm';
}
