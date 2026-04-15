const benefits = [
  { icon: '💪', title: 'High in Protein', desc: '9.7g of protein per 100g — keeps you full longer without the guilt.' },
  { icon: '🌿', title: 'Completely Natural', desc: 'Zero preservatives, zero artificial colours. What you see is what you eat.' },
  { icon: '🔥', title: 'Perfectly Roasted', desc: 'Slow-roasted at controlled temperatures to preserve nutrients and crunch.' },
  { icon: '🪷', title: 'Farm-to-Pack', desc: 'Sourced directly from Darbhanga — the makhana capital of India.' },
  { icon: '⚡', title: 'Quick Energy', desc: 'Complex carbs for sustained energy without sugar spikes.' },
  { icon: '🫀', title: 'Heart Healthy', desc: 'Low glycaemic index, rich in antioxidants, naturally cholesterol-free.' }
];

export default function Benefits() {
  return (
    <section className="py-24 bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-forest uppercase">Why Lotus Crunch</span>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-3 leading-tight">Every handful is a<br />deliberate choice.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {benefits.map(b => (
            <div key={b.title} className="group bg-cream/5 hover:bg-cream/10 border border-cream/5 rounded-2xl p-6 transition-all duration-300">
              <span className="text-3xl">{b.icon}</span>
              <h3 className="font-semibold text-cream mt-4 mb-2 text-sm md:text-base">{b.title}</h3>
              <p className="text-cream/45 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
