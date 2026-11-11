import { useState } from 'react';
import { BookOpen, ChevronDown, Volume2 } from 'lucide-react';
import type { ReadingSession } from '@/hooks/useReadingSession';
import { PassagePicker } from './PassagePicker';
import { RecordControls } from './RecordControls';
import { StoryText } from './StoryText';

interface ReadingCardProps {
  session: ReadingSession;
}

export function ReadingCard({ session }: ReadingCardProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { passage, passages, passageIndex, score } = session;

  const handleSelect = (index: number) => {
    session.selectPassage(index);
    setPickerOpen(false);
  };

  return (
    <section className="reading-card">
      <div className="card-header">
        <div className="card-icon">
          <BookOpen size={20} />
        </div>
        <div>
          <div className="card-overline">YOUR STORY</div>
          <h3>{passage.title}</h3>
        </div>
        <button
          className="level-tag"
          onClick={() => setPickerOpen((open) => !open)}
          aria-expanded={pickerOpen}
        >
          {passage.tag}
          <ChevronDown size={14} />
        </button>
      </div>

      {pickerOpen && (
        <PassagePicker passages={passages} selectedIndex={passageIndex} onSelect={handleSelect} />
      )}

      <div className="story-content">
        <div className="story-illustration" style={{ background: passage.accent }}>
          <span>{passage.emoji}</span>
          <div className="illustration-stars">✦</div>
        </div>
        <StoryText text={passage.text} score={score} />
        <button className="listen-link" onClick={session.listenToPassage}>
          <Volume2 size={17} /> Listen to the story
        </button>
      </div>

      <RecordControls
        mode={session.mode}
        active={session.active}
        busy={session.busy}
        hasScore={score !== null}
        liveTranscript={session.liveTranscript}
        livePreviewSupported={session.livePreviewSupported}
        message={session.message}
        onModeChange={session.selectMode}
        onToggleRecording={() => void session.toggleRecording()}
        onReset={session.reset}
      />
    </section>
  );
}
