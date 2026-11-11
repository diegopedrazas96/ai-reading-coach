import { AudioLines, Mic, RotateCcw, ShieldCheck, Square } from 'lucide-react';
import type { RecognitionMode } from '@/types';

interface RecordControlsProps {
  mode: RecognitionMode;
  active: boolean;
  busy: boolean;
  hasScore: boolean;
  liveTranscript: string;
  livePreviewSupported: boolean;
  message: string;
  onModeChange: (mode: RecognitionMode) => void;
  onToggleRecording: () => void;
  onReset: () => void;
}

function getStatusTitle(busy: boolean, active: boolean, hasScore: boolean): string {
  if (busy) return 'Analyzing…';
  if (active) return 'Listening to you…';
  if (hasScore) return 'Great effort!';
  return 'Tap to start reading';
}

function getStatusHint(active: boolean, hasScore: boolean): string {
  if (active) return 'Read the story aloud, then tap stop.';
  if (hasScore) return 'See your word-by-word results below.';
  return 'Your microphone is ready when you are.';
}

function RecordIcon({ busy, active }: { busy: boolean; active: boolean }) {
  if (busy) return <AudioLines size={27} />;
  if (active) return <Square size={25} fill="currentColor" />;
  return <Mic size={29} />;
}

export function RecordControls({
  mode,
  active,
  busy,
  hasScore,
  liveTranscript,
  livePreviewSupported,
  message,
  onModeChange,
  onToggleRecording,
  onReset,
}: RecordControlsProps) {
  return (
    <div className="read-controls">
      <div className="mode-select">
        <label htmlFor="mode">Recognition mode</label>
        <select
          id="mode"
          value={mode}
          onChange={(event) => onModeChange(event.target.value as RecognitionMode)}
        >
          <option value="browser">Browser speech recognition</option>
          <option value="openai">OpenAI transcription (live preview + API)</option>
        </select>
      </div>

      <div className="record-center">
        <button
          disabled={busy}
          className={`record-button ${active ? 'recording' : ''}`}
          onClick={onToggleRecording}
          aria-label={active ? 'Stop reading' : 'Start reading'}
        >
          <RecordIcon busy={busy} active={active} />
        </button>
        <strong>{getStatusTitle(busy, active, hasScore)}</strong>
        <span>{getStatusHint(active, hasScore)}</span>
      </div>

      {liveTranscript && (
        <div className="live-transcript" aria-live="polite">
          <strong>{mode === 'openai' ? 'Live preview' : 'Live transcript'}</strong>
          <span>{liveTranscript}</span>
          {mode === 'openai' && <small>Final results are transcribed by OpenAI.</small>}
        </div>
      )}

      {mode === 'openai' && active && !livePreviewSupported && (
        <div className="live-transcript">
          <span>
            Live preview isn't available in this browser (try Chrome or Edge). Your reading is still
            being recorded.
          </span>
        </div>
      )}

      {message && (
        <div className="alert" role="alert">
          {message}
        </div>
      )}

      <div className="record-footer">
        <span>
          <ShieldCheck size={15} /> No audio recordings saved by this app
        </span>
        <button onClick={onReset}>
          <RotateCcw size={15} /> Start over
        </button>
      </div>
    </div>
  );
}
