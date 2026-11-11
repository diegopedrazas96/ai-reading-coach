/**
 * How the spoken reading is converted to text.
 * - `browser`: Web Speech API only (free, live).
 * - `openai`: hybrid — browser recognition shows a live preview while audio is
 *   recorded; the recording is then transcribed by OpenAI for the final score.
 */
export type RecognitionMode = 'browser' | 'openai';

export interface SpeechRecognitionState {
  supported: boolean;
  listening: boolean;
  transcript: string;
  error: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export interface AudioRecorderState {
  recording: boolean;
  error: string;
  /** Resolves to `true` once recording has actually started. */
  start: () => Promise<boolean>;
  stop: () => Promise<Blob>;
  cancel: () => void;
}
