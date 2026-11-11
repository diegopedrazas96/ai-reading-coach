import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_RECORDING_MIME_TYPE, RECORDER_MIME_TYPES } from '@/constants';
import type { AudioRecorderState } from '@/types';
import { getErrorMessage } from '@/utils/errors';

function pickSupportedMimeType(): string | undefined {
  return RECORDER_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

/** Records microphone audio in memory so it can be sent for transcription. */
export function useAudioRecorder(): AudioRecorderState {
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');

  const releaseMicrophone = useCallback(() => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    recorder.current = null;
  }, []);

  const start = useCallback(async () => {
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access is unavailable.');
      }

      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      chunks.current = [];

      const mimeType = pickSupportedMimeType();
      const rec = new MediaRecorder(media, mimeType ? { mimeType } : undefined);
      recorder.current = rec;

      rec.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data);
      };
      rec.onstop = () => {
        setRecording(false);
        releaseMicrophone();
      };

      rec.start();
      setRecording(true);
      return true;
    } catch (err) {
      releaseMicrophone();
      setError(getErrorMessage(err, 'Could not access microphone.'));
      return false;
    }
  }, [releaseMicrophone]);

  const stop = useCallback(
    () =>
      new Promise<Blob>((resolve, reject) => {
        const rec = recorder.current;
        if (!rec || rec.state !== 'recording') {
          reject(new Error('Not recording.'));
          return;
        }
        rec.onstop = () => {
          const blob = new Blob(chunks.current, {
            type: rec.mimeType || DEFAULT_RECORDING_MIME_TYPE,
          });
          setRecording(false);
          releaseMicrophone();
          resolve(blob);
        };
        rec.stop();
      }),
    [releaseMicrophone],
  );

  const cancel = useCallback(() => {
    const rec = recorder.current;
    if (rec?.state === 'recording') rec.stop();
    releaseMicrophone();
    setRecording(false);
  }, [releaseMicrophone]);

  useEffect(() => releaseMicrophone, [releaseMicrophone]);

  return { recording, error, start, stop, cancel };
}
