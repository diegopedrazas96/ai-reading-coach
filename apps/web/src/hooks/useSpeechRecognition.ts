import { useCallback, useEffect, useRef, useState } from 'react';
import { SPEECH_LANG } from '@/constants';
import type {
  SpeechRecognitionConstructor,
  SpeechRecognitionEngine,
  SpeechRecognitionState,
} from '@/types';

function getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/** Live, in-browser speech-to-text using the Web Speech API. */
export function useSpeechRecognition(): SpeechRecognitionState {
  const supported = Boolean(getSpeechRecognition());
  const engine = useRef<SpeechRecognitionEngine | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const start = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError('This browser does not support Speech Recognition. Try Chrome, or OpenAI mode.');
      return;
    }

    engine.current?.abort();
    const speech = new SpeechRecognition();
    engine.current = speech;
    speech.lang = SPEECH_LANG;
    speech.continuous = true;
    speech.interimResults = true;

    speech.onresult = (event) => {
      const parts: string[] = [];
      for (let i = 0; i < event.results.length; i++) parts.push(event.results[i][0].transcript);
      setTranscript(parts.join(' ').trim());
    };
    speech.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setListening(false);
    };
    speech.onend = () => setListening(false);

    setTranscript('');
    setError('');
    try {
      speech.start();
      setListening(true);
    } catch {
      setError('Could not start microphone recognition.');
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    engine.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    engine.current?.abort();
    setListening(false);
    setTranscript('');
    setError('');
  }, []);

  useEffect(() => () => engine.current?.abort(), []);

  return { supported, listening, transcript, error, start, stop, reset };
}
