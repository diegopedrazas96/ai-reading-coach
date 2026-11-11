import { useState, type CSSProperties } from 'react';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import type { ReadingScore } from '@/types';

interface ScoreSummaryProps {
  score: ReadingScore;
  transcript: string;
}

export function ScoreSummary({ score, transcript }: ScoreSummaryProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const gaugeStyle = { '--percentage': `${score.accuracy}%` } as CSSProperties;

  return (
    <>
      <div className="result-gauge">
        <div className="gauge-circle" style={gaugeStyle}>
          <div>
            <strong>{score.accuracy}%</strong>
            <small>words matched</small>
          </div>
        </div>
      </div>

      <div className="metric-row">
        <span>
          <Check size={17} /> Words matched
        </span>
        <strong>
          {score.matched} / {score.total}
        </strong>
      </div>
      <div className="metric-row">
        <span>
          <Sparkles size={17} /> Keep practicing
        </span>
        <strong>{score.total - score.matched}</strong>
      </div>

      <p className="result-note">
        {score.accuracy === 100
          ? 'Wonderful reading! You matched every word. 🎉'
          : 'Nice work! Highlighted words show what the recognizer may have missed.'}
      </p>

      <button className="transcript-toggle" onClick={() => setShowTranscript((shown) => !shown)}>
        {showTranscript ? 'Hide' : 'Show'} transcript <ChevronDown size={14} />
      </button>
      {showTranscript && (
        <div className="transcript-box">{transcript || '(no words detected)'}</div>
      )}
    </>
  );
}
