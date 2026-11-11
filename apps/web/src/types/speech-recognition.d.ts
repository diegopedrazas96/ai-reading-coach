/**
 * Minimal typings for the Web Speech API, which is not yet part of lib.dom.d.ts.
 * Only the members this app uses are declared.
 */

export interface SpeechAlternative {
  transcript: string;
}

export interface SpeechResult {
  isFinal: boolean;
  0: SpeechAlternative;
}

export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechResult>;
}

export interface SpeechRecognitionErrorEventLike {
  error: string;
}

export interface SpeechRecognitionEngine {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionEngine;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
