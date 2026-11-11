import { features } from '@/data/features';

export function Features() {
  return (
    <section className="features" id="how">
      <div className="features-heading">
        <span className="eyebrow">MADE FOR CURIOUS READERS</span>
        <h2>Learn with every word</h2>
        <p>Small moments of practice lead to big breakthroughs.</p>
      </div>
      <div className="feature-grid">
        {features.map((feature) => (
          <div className="feature" key={feature.label}>
            <span>{feature.icon}</span>
            <strong>{feature.label}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
