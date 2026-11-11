import { BookOpen, ChevronDown, Sparkles } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="brand" href="#home" aria-label="Reading Bloom home">
        <span className="brand-logo">
          <BookOpen size={22} strokeWidth={2.8} />
        </span>
        <span>
          reading<span className="brand-bold">bloom</span>
          <span className="brand-period">.</span>
        </span>
      </a>

      <div className="sidebar-caption">YOUR LEARNING SPACE</div>
      <nav className="side-menu">
        <a className="nav-item active" href="#practice">
          <BookOpen size={19} /> Reading practice
        </a>
        <a className="nav-item" href="#how">
          <Sparkles size={19} /> How it works
        </a>
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-callout">
        <span className="callout-emoji">🌱</span>
        <strong>Little steps, big growth.</strong>
        <span>Every word you read is a new adventure!</span>
        <div className="callout-deco">✦</div>
      </div>

      <div className="sidebar-footer">
        <span className="avatar">D</span>
        <span>
          <strong>Demo learner</strong>
          <small>Reading Explorer</small>
        </span>
        <ChevronDown size={16} />
      </div>
    </aside>
  );
}
