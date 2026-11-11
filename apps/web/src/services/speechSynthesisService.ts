import { SPEECH_LANG, SPEECH_PLAYBACK_RATE } from '@/constants';

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Reads text aloud, interrupting anything currently being spoken. */
export function speakText(text: string): void {
  if (!isSpeechSynthesisSupported()) {
    throw new Error('Speech playback is unavailable in this browser.');
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG;
  utterance.rate = SPEECH_PLAYBACK_RATE;
  window.speechSynthesis.speak(utterance);
}
