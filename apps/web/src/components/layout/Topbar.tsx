import { ChevronRight } from 'lucide-react';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Learning space</span>
        <ChevronRight size={14} />
        <strong>Reading practice</strong>
      </div>
      <div className="top-actions">
        <span className="demo-pill">
          <span className="demo-dot" /> Portfolio demo
        </span>
        <div className="top-avatar">D</div>
      </div>
    </header>
  );
}
