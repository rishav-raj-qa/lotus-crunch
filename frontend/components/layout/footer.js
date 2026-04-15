import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-cream text-xs font-display">LC</div>
            <span className="font-display text-cream text-lg font-medium">Lotus Crunch</span>
          </div>
          <p className="text-sm leading-relaxed text-cream/50 max-w-xs">
            Premium roasted makhana crafted for modern lifestyles. Born in Bihar, loved across India.
          </p>
          <div className="flex gap-3 mt-6">
            {['Instagram', 'Twitter', 'YouTube'].map(s => (
              <a key={s} href="#" className="text-xs badge bg-cream/5 text-cream/50 hover:bg-forest hover:text-cream transition-colors">{s}</a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-cream text-sm mb-4 tracking-wide">Shop</h4>
          <ul className="space-y-3 text-sm">
            {[['All Products', '/shop'], ['Classic Flavours', '/shop?category=classic'], ['New Arrivals', '/shop?sort=newest'], ['Gift Sets', '/shop?category=gifting']].map(([l, h]) => (
              <li key={l}><Link href={h} className="hover:text-forest transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-cream text-sm mb-4 tracking-wide">Company</h4>
          <ul className="space-y-3 text-sm">
            {[['About Us', '/about'], ['FAQ', '/faq'], ['Shipping Policy', '/shipping'], ['Privacy Policy', '/privacy'], ['Contact', '/contact']].map(([l, h]) => (
              <li key={l}><Link href={h} className="hover:text-forest transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/30">
        <span>© {new Date().getFullYear()} Lotus Crunch. All rights reserved.</span>
        <span>Made with care in Patna, Bihar 🪷</span>
      </div>
    </footer>
  );
}
