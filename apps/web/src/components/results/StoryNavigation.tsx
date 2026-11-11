import { ArrowRight, ChevronLeft, Signpost } from 'lucide-react';

interface StoryNavigationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function StoryNavigation({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: StoryNavigationProps) {
  return (
    <div className="navigation-card">
      <div className="nav-card-heading">
        <Signpost size={18} />
        <strong>Explore stories</strong>
      </div>
      <p>Try another story whenever you're ready.</p>
      <div className="nav-buttons">
        <button disabled={!hasPrevious} onClick={onPrevious}>
          <ChevronLeft size={17} /> Previous
        </button>
        <button disabled={!hasNext} onClick={onNext}>
          Next story <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
