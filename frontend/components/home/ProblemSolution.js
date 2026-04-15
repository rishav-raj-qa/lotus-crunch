'use client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function ProblemSolution() {
  const ref = useScrollAnimation();
  return (
    <section ref={ref} className="py-24 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Problem */}
          <div className="animate-on-scroll space-y-6">
            <span className="text-xs font-bold tracking-widest text-ink/30 uppercase">The Problem</span>
            <h2 className="section-title">Snacking shouldn't mean<br />compromising.</h2>
            <div className="space-y-4">
              {[
                ['Most snacks are loaded with preservatives and artificial flavours', '❌'],
                ['Chips leave you bloated and sluggish', '❌'],
                ['Healthy options are bland and joyless', '❌']
              ].map(([text, icon]) => (
                <div key={text} className="flex items-start gap-3 text-ink/55 text-sm leading-relaxed">
                  <span className="mt-0.5 text-base">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="animate-on-scroll space-y-6">
            <span className="text-xs font-bold tracking-widest text-forest uppercase">Our Answer</span>
            <h2 className="section-title">Roasted makhana.<br /><em className="not-italic text-forest">Pure and simple.</em></h2>
            <div className="space-y-4">
              {[
                ['Naturally light — just 347 kcal per 100g', '✓'],
                ['Rich in protein, calcium, and antioxidants', '✓'],
                ['No preservatives, no MSG, no artificial colours', '✓'],
                ['Sourced directly from farmers in Darbhanga, Bihar', '✓']
              ].map(([text, icon]) => (
                <div key={text} className="flex items-start gap-3 text-ink/70 text-sm leading-relaxed">
                  <span className="mt-0.5 text-forest font-bold">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
