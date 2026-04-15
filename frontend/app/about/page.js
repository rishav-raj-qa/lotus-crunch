export const metadata = { title: 'About — Lotus Crunch' };

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-20">
        <span className="text-xs font-bold tracking-widest text-forest uppercase">Our Story</span>
        <h1 className="font-display text-5xl md:text-6xl font-medium text-ink mt-4 leading-tight">
          Born in Bihar.<br /><em className="not-italic text-forest">Made for India.</em>
        </h1>
        <p className="text-ink/50 text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
          Carefully sourced and roasted to perfection, Lotus Crunch makhana delivers a guilt-free snacking experience packed with nutrition.
        </p>
      </section>

      {/* Story */}
      <section className="bg-ink text-cream py-20 mb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight mb-6">
              Where it all<br />started.
            </h2>
            <div className="space-y-4 text-cream/60 text-sm leading-relaxed">
              <p>Lotus Crunch was founded in Patna by a small team who grew up watching makhana farmers in Darbhanga — the makhana capital of the world — struggle to connect their harvests with urban consumers who desperately needed healthier snack alternatives.</p>
              <p>We saw an opportunity to bridge that gap: bring the richness of traditional makhana farming directly to modern kitchens, with thoughtful flavour profiles that would make the switch from unhealthy snacking completely effortless.</p>
              <p>Every packet of Lotus Crunch represents a direct relationship with our farming partners, a commitment to zero artificial additives, and a belief that good food should never mean compromising on taste.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['2021', 'Founded in Patna'], ['50K+', 'Happy customers'], ['6+', 'Flavours crafted'], ['100%', 'Natural ingredients']].map(([num, label]) => (
              <div key={label} className="bg-cream/5 border border-cream/5 rounded-2xl p-5 text-center">
                <p className="font-display text-3xl font-medium text-cream">{num}</p>
                <p className="text-cream/40 text-xs mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8">
            <span className="text-3xl mb-4 block">🎯</span>
            <h3 className="font-display text-2xl font-medium text-ink mb-3">Our Mission</h3>
            <p className="text-ink/55 text-sm leading-relaxed">
              To make healthy snacking delicious, accessible, and honest. We exist to prove that a snack can be genuinely nutritious, sustainably sourced, and still taste incredible — without relying on artificial flavours, preservatives, or misleading health claims.
            </p>
          </div>
          <div className="card p-8">
            <span className="text-3xl mb-4 block">🌿</span>
            <h3 className="font-display text-2xl font-medium text-ink mb-3">Our Vision</h3>
            <p className="text-ink/55 text-sm leading-relaxed">
              A India where the default snack isn't chips or biscuits, but something that actually nourishes you. We're building a brand that makes people proud of what they eat, while directly supporting the farming communities that make it all possible.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">What we stand for</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🌾', title: 'Direct Sourcing', desc: 'We work directly with makhana farmers in Darbhanga, Bihar, ensuring fair prices and full traceability from farm to pack.' },
            { icon: '🔬', title: 'Honest Nutrition', desc: 'Every nutritional claim on our packaging is accurate, verified, and never inflated. No marketing exaggerations, ever.' },
            { icon: '♻️', title: 'Sustainable Packaging', desc: 'Our packaging is designed to minimise waste — we\'re constantly working towards fully recyclable solutions.' }
          ].map(v => (
            <div key={v.title} className="card p-6 text-center">
              <span className="text-3xl">{v.icon}</span>
              <h3 className="font-semibold text-ink mt-4 mb-2">{v.title}</h3>
              <p className="text-ink/50 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
