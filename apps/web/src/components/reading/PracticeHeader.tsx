interface PracticeHeaderProps {
  current: number;
  total: number;
}

export function PracticeHeader({ current, total }: PracticeHeaderProps) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">LET'S GET STARTED</span>
        <h2>
          Today's reading practice <span>✨</span>
        </h2>
      </div>
      <span className="practice-count">
        {current} / {total} stories
      </span>
    </div>
  );
}
