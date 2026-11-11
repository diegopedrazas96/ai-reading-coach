import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { passages } from '@/data/passages';
import { evaluateReading } from '@/lib/scoring';
import { speakText } from '@/services/speechSynthesisService';
import { transcribeAudio } from '@/services/transcriptionService';
import type { RecognitionMode } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { useAudioRecorder } from './useAudioRecorder';
import { useSpeechRecognition } from './useSpeechRecognition';

/**
 * Owns the full reading-practice flow: passage selection, recording, live
 * preview, transcription, and scoring. Components stay presentational.
 *
 * In `openai` mode the browser recognizer runs alongside the recorder purely
 * as a live preview; the OpenAI transcript is what gets scored. If OpenAI
 * fails, the preview transcript is used as a fallback.
 */
export function useReadingSession() {
  const [passageIndex, setPassageIndex] = useState(0);
  const [mode, setMode] = useState<RecognitionMode>('browser');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const pendingRequest = useRef<AbortController | null>(null);

  const {
    supported: livePreviewSupported,
    listening,
    transcript: browserTranscript,
    error: browserError,
    start: startListening,
    stop: stopListening,
    reset: resetListening,
  } = useSpeechRecognition();

  const {
    recording,
    error: recorderError,
    start: startRecording,
    stop: stopRecording,
    cancel: cancelRecording,
  } = useAudioRecorder();

  const passage = passages[passageIndex];
  const active = mode === 'browser' ? listening : recording;

  const score = useMemo(
    () => (transcript === null ? null : evaluateReading(passage.text, transcript)),
    [passage.text, transcript],
  );

  // In OpenAI mode the browser recognizer is only a best-effort preview,
  // so its errors are not surfaced.
  useEffect(() => {
    setMessage(mode === 'browser' ? browserError : recorderError);
  }, [mode, browserError, recorderError]);

  useEffect(() => () => pendingRequest.current?.abort(), []);

  const reset = useCallback(() => {
    pendingRequest.current?.abort();
    resetListening();
    cancelRecording();
    setTranscript(null);
    setMessage('');
  }, [resetListening, cancelRecording]);

  const selectPassage = useCallback(
    (index: number) => {
      if (index < 0 || index >= passages.length) return;
      reset();
      setPassageIndex(index);
    },
    [reset],
  );

  const selectMode = useCallback(
    (next: RecognitionMode) => {
      reset();
      setMode(next);
    },
    [reset],
  );

  const finishOpenAIReading = useCallback(async () => {
    const preview = browserTranscript.trim();
    stopListening();

    const controller = new AbortController();
    pendingRequest.current = controller;
    setBusy(true);
    setMessage('Analyzing your reading…');
    try {
      const blob = await stopRecording();
      setTranscript(await transcribeAudio(blob, controller.signal));
      setMessage('');
    } catch (err) {
      if (controller.signal.aborted) return;
      const reason = getErrorMessage(err, 'Could not transcribe audio.');
      if (preview) {
        setTranscript(preview);
        setMessage(`${reason} Showing results from the live browser transcript instead.`);
      } else {
        setMessage(reason);
      }
    } finally {
      if (pendingRequest.current === controller) pendingRequest.current = null;
      setBusy(false);
    }
  }, [browserTranscript, stopListening, stopRecording]);

  const startReading = useCallback(async () => {
    setTranscript(null);
    setMessage('');
    if (mode === 'browser') {
      startListening();
      return;
    }
    const started = await startRecording();
    if (started && livePreviewSupported) startListening();
  }, [mode, livePreviewSupported, startListening, startRecording]);

  const toggleRecording = useCallback(async () => {
    if (busy) return;
    if (!active) {
      await startReading();
      return;
    }
    if (mode === 'browser') {
      stopListening();
      setTranscript(browserTranscript.trim());
    } else {
      await finishOpenAIReading();
    }
  }, [busy, active, mode, browserTranscript, stopListening, startReading, finishOpenAIReading]);

  const listenToPassage = useCallback(() => {
    try {
      speakText(passage.text);
    } catch (err) {
      setMessage(getErrorMessage(err, 'Could not play the story.'));
    }
  }, [passage.text]);

  return {
    passages,
    passage,
    passageIndex,
    mode,
    transcript,
    liveTranscript: active || busy ? browserTranscript : '',
    livePreviewSupported,
    score,
    busy,
    active,
    message,
    reset,
    selectPassage,
    selectMode,
    toggleRecording,
    listenToPassage,
  };
}

export type ReadingSession = ReturnType<typeof useReadingSession>;
