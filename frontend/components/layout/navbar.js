'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore, useAuthStore } from '../../store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const { items }   = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const count = items.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-md border-b border-ink/5 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-cream text-xs font-display font-medium group-hover:scale-110 transition-transform">LC</div>
          <span className="font-display font-medium text-lg text-ink tracking-tight">Lotus Crunch</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About']].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-ink/60 hover:text-forest transition-colors font-medium tracking-wide">{label}</Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:text-forest transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-forest text-cream text-[10px] font-bold rounded-full flex items-center justify-center">{count}</span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {user.role === 'admin' && (
                <Link href="/admin" className="text-xs badge bg-forest/10 text-forest">Admin</Link>
              )}
              <button onClick={handleLogout} className="btn-ghost text-xs">Sign out</button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:block btn-primary py-2 px-4 text-xs">Sign in</Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-ink/5 px-4 py-6 flex flex-col gap-5">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="text-base text-ink/70 hover:text-forest transition-colors font-medium">{label}</Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-base text-left text-ink/60">Sign out</button>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-primary w-fit">Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
