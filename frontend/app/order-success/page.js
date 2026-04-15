'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const params = useSearchParams();
  const id = params.get('id');

  return (
    <div className="pt-36 pb-24 flex flex-col items-center gap-6 text-center px-4 max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center animate-fade-in">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3D6B3D" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-medium text-ink">Order Placed!</h1>
        <p className="text-ink/50 leading-relaxed">
          Thank you for your order. You'll receive a confirmation shortly.
        </p>
        {id && <p className="text-xs text-ink/30 font-mono mt-2">Order ID: {id}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
        <Link href="/shop" className="btn-primary flex-1 justify-center py-3.5">Continue Shopping</Link>
        <Link href="/auth/login" className="btn-secondary flex-1 justify-center py-3.5">Track Order</Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
