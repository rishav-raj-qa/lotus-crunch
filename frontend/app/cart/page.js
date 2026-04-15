'use client';
import Link from 'next/link';
import { useCartStore } from '@/store';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, shipping, total } = useCartStore();

  if (items.length === 0) return (
    <div className="pt-32 pb-24 flex flex-col items-center gap-6 text-center px-4">
      <span className="text-7xl">🛒</span>
      <h2 className="font-display text-3xl text-ink">Your cart is empty</h2>
      <p className="text-ink/45">Looks like you haven't added anything yet.</p>
      <Link href="/shop" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="pt-28 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      <h1 className="font-display text-4xl font-medium text-ink mb-10">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-dark/30 shrink-0">
                {item.images?.[0]
                  ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl">🪷</span></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm truncate">{item.name}</p>
                <p className="text-ink/35 text-xs mt-0.5">{item.weight}</p>
                <p className="font-bold text-ink mt-1.5">₹{item.salePrice || item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-ink/15 rounded-full text-sm">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-ink/5 rounded-full transition-colors">−</button>
                  <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-ink/5 rounded-full transition-colors">+</button>
                </div>
                <button onClick={() => removeItem(item._id)} className="text-ink/25 hover:text-red-400 transition-colors p-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-ink mb-5">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-forest font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-ink/35">Add ₹{499 - subtotal} more for free shipping</p>
              )}
              <div className="border-t border-ink/5 pt-3 flex justify-between font-bold text-ink text-base">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full justify-center mt-6 py-3.5">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="btn-ghost w-full text-center mt-3 block">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
