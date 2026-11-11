export const SPEECH_LANG = 'en-US';

/** Slower than normal so early readers can follow along. */
export const SPEECH_PLAYBACK_RATE = 0.78;

/** Preferred MediaRecorder formats, most preferred first. */
export const RECORDER_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
] as const;

export const DEFAULT_RECORDING_MIME_TYPE = 'audio/webm';
