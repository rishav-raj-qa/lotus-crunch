const reviews = [
  { name: 'Priya Sharma', role: 'Fitness Coach, Mumbai', text: 'I recommend Lotus Crunch to all my clients as a post-workout snack. The protein content is real and the taste is genuinely amazing.', rating: 5 },
  { name: 'Arjun Mehta', role: 'Product Manager, Bengaluru', text: 'Finally a healthy snack I actually look forward to. The Peri Peri flavour is dangerously addictive.', rating: 5 },
  { name: 'Sneha Verma', role: 'Nutritionist, Delhi', text: 'Clean ingredients, honest labelling, and great taste. I have tried many makhana brands — Lotus Crunch is in a different league.', rating: 5 },
  { name: 'Rahul Agarwal', role: 'Startup Founder, Hyderabad', text: 'The Starter Pack was the perfect intro. All three flavours were excellent. The Himalayan Salt is my daily desk snack now.', rating: 5 }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-cream-dark/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-forest uppercase">Reviews</span>
          <h2 className="section-title mt-3">What snackers are<br />saying.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {reviews.map(r => (
            <div key={r.name} className="card p-6 flex flex-col justify-between gap-5 hover:shadow-md transition-shadow duration-300">
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.rating)].map((_, i) => <span key={i} className="text-gold text-sm">★</span>)}
                </div>
                <p className="text-ink/65 text-sm leading-relaxed">"{r.text}"</p>
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">{r.name}</p>
                <p className="text-ink/35 text-xs mt-0.5">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
