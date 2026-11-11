import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="hero-kicker">
          <Sparkles size={15} /> YOUR READING ADVENTURE
        </span>
        <h1>
          Every great story
          <br />
          starts with <em>one word.</em>
        </h1>
        <p>
          Pick a story, read it out loud, and watch your confidence grow. Ready to give it a try?
        </p>
        <div className="hero-detail">
          <span className="tiny-stars">✦ ✦ ✦</span> Your reading journey starts here
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="art-blob" />
        <div className="art-sun">✳</div>
        <div className="art-cloud cloud-one">☁</div>
        <div className="art-cloud cloud-two">☁</div>
        <div className="art-book">📖</div>
        <div className="art-spark spark-one">✦</div>
        <div className="art-spark spark-two">✧</div>
        <div className="art-ground" />
      </div>
    </section>
  );
}
