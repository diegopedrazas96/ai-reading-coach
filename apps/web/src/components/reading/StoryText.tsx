import type { ReadingScore } from '@/types';

interface StoryTextProps {
  text: string;
  score: ReadingScore | null;
}

/** Shows the passage, highlighting each word once a reading has been scored. */
export function StoryText({ text, score }: StoryTextProps) {
  if (!score) {
    return (
      <div className="story-text" aria-label="Reading passage">
        {text.split(' ').map((word, index) => (
          <span key={index}>{word} </span>
        ))}
      </div>
    );
  }

  const lastIndex = score.marked.length - 1;
  return (
    <div className="story-text" aria-label="Reading passage">
      {score.marked.map((word, index) => (
        <span
          key={index}
          className={`word ${word.status}`}
          title={word.status === 'correct' ? 'Recognized' : 'Not recognized'}
        >
          {word.word}
          {index < lastIndex ? ' ' : ''}
        </span>
      ))}
    </div>
  );
}
