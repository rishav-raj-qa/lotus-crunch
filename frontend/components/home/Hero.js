'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-animate]');
    els?.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden bg-cream">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-forest/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      {/* Floating label */}
      <div className="absolute top-28 right-6 md:right-16 hidden md:flex items-center gap-2 bg-white border border-ink/5 rounded-full px-4 py-2 shadow-sm animate-on-scroll visible" style={{ animationDelay: '0.8s' }}>
        <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
        <span className="text-xs text-ink/60 font-medium tracking-wide">100% Natural. No preservatives.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid md:grid-cols-2 gap-12 items-center pt-28 pb-16">
        {/* Left */}
        <div className="space-y-8">
          <div className="animate-on-scroll" data-animate>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-forest uppercase mb-6">
              <span className="w-8 h-px bg-forest" />Premium Makhana
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-ink leading-[1.05]">
              Clean Snacking<br />
              <em className="not-italic text-forest">Starts Here</em>
            </h1>
          </div>

          <p className="animate-on-scroll text-base md:text-lg text-ink/55 leading-relaxed max-w-md" data-animate>
            Premium roasted makhana crafted for modern lifestyles — light, nutritious, and irresistibly crunchy.
          </p>

          <div className="animate-on-scroll flex flex-wrap gap-3" data-animate>
            <Link href="/shop" className="btn-primary">
              Shop Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/about" className="btn-secondary">Our Story</Link>
          </div>

          {/* Stats */}
          <div className="animate-on-scroll flex gap-8 pt-2" data-animate>
            {[['4.9★', 'Avg. Rating'], ['50K+', 'Happy Snackers'], ['6+', 'Flavours']].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-medium text-ink">{num}</p>
                <p className="text-xs text-ink/40 tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Product visual */}
        <div className="animate-on-scroll relative flex justify-center" data-animate>
          <div className="relative w-full max-w-sm aspect-square">
            {/* Background ring */}
            <div className="absolute inset-4 rounded-full border-2 border-forest/10" />
            <div className="absolute inset-8 rounded-full bg-forest/5" />

            {/* Product mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-52 h-64 bg-gradient-to-br from-forest to-forest-dark rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-3xl">🪷</span>
                </div>
                <div className="text-center px-4">
                  <p className="font-display text-cream text-lg font-medium">Lotus Crunch</p>
                  <p className="text-cream/60 text-xs mt-1">Himalayan Salt</p>
                  <p className="text-cream/80 text-sm font-semibold mt-2">₹199</p>
                </div>
                <div className="bg-white/10 px-4 py-1 rounded-full">
                  <span className="text-cream/70 text-xs">70g • Premium Makhana</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute top-6 left-0 bg-white border border-ink/5 rounded-2xl px-3 py-2 shadow-md">
              <p className="text-xs font-semibold text-ink">High Protein</p>
              <p className="text-[10px] text-ink/40">9.7g per 100g</p>
            </div>
            <div className="absolute bottom-8 right-0 bg-white border border-ink/5 rounded-2xl px-3 py-2 shadow-md">
              <p className="text-xs font-semibold text-ink">Low Fat</p>
              <p className="text-[10px] text-ink/40">Only 0.1g fat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink/30">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-ink/20 animate-bounce" />
      </div>
    </section>
  );
}
