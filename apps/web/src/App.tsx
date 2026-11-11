import { Features } from '@/components/features/Features';
import { Hero } from '@/components/hero/Hero';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { PracticeHeader } from '@/components/reading/PracticeHeader';
import { ReadingCard } from '@/components/reading/ReadingCard';
import { ResultsCard } from '@/components/results/ResultsCard';
import { StoryNavigation } from '@/components/results/StoryNavigation';
import { TipCard } from '@/components/results/TipCard';
import { useReadingSession } from '@/hooks/useReadingSession';

export default function App() {
  const session = useReadingSession();
  const { passageIndex, passages, selectPassage } = session;

  return (
    <div className="app-shell">
      <Sidebar />
      <main id="home" className="main-content">
        <Topbar />
        <div className="page-container" id="practice">
          <Hero />
          <PracticeHeader current={passageIndex + 1} total={passages.length} />

          <div className="practice-layout">
            <ReadingCard session={session} />
            <aside className="right-panel">
              <ResultsCard score={session.score} transcript={session.transcript} />
              <TipCard />
              <StoryNavigation
                hasPrevious={passageIndex > 0}
                hasNext={passageIndex < passages.length - 1}
                onPrevious={() => selectPassage(passageIndex - 1)}
                onNext={() => selectPassage(passageIndex + 1)}
              />
            </aside>
          </div>

          <Features />
          <Footer />
        </div>
      </main>
    </div>
  );
}
