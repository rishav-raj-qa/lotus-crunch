import Link from 'next/link';

export default function BottomCTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-xs font-bold tracking-widest text-forest uppercase">Ready?</span>
        <h2 className="font-display text-4xl md:text-5xl font-medium text-ink mt-4 mb-6 leading-tight">
          Your next favourite snack<br />is one click away.
        </h2>
        <p className="text-ink/50 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Free shipping on orders above ₹499. No-questions returns. Delivered in 3–5 days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-primary text-base px-8 py-4">
            Shop All Flavours
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/shop?category=combo" className="btn-secondary text-base px-8 py-4">Try a Combo Pack</Link>
        </div>
        <div className="flex flex-wrap gap-6 justify-center mt-12 text-xs text-ink/35 font-medium">
          {['Free shipping above ₹499', 'Easy 7-day returns', 'COD available', 'Secure payments'].map(t => (
            <span key={t} className="flex items-center gap-1.5"><span className="text-forest">✓</span>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
