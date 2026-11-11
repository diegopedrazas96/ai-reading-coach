import { Star } from 'lucide-react';
import type { ReadingScore } from '@/types';
import { EmptyResults } from './EmptyResults';
import { ScoreSummary } from './ScoreSummary';

interface ResultsCardProps {
  score: ReadingScore | null;
  transcript: string | null;
}

export function ResultsCard({ score, transcript }: ResultsCardProps) {
  return (
    <div className="results-card">
      <div className="result-heading">
        <span className="result-icon">
          <Star size={19} />
        </span>
        <h3>Your reading results</h3>
      </div>
      {score ? <ScoreSummary score={score} transcript={transcript ?? ''} /> : <EmptyResults />}
    </div>
  );
}
