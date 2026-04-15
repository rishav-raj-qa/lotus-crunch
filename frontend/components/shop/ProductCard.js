'use client';
import Link from 'next/link';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`, { icon: '🛒' });
  };

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  return (
    <Link href={`/product/${product.slug || product._id}`} className="group card overflow-hidden block hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-cream-dark/30 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🪷</span>
          </div>
        )}
        {discount && (
          <span className="absolute top-3 left-3 badge bg-forest text-cream text-[10px]">{discount}% OFF</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-ink/50">Out of Stock</span>
          </div>
        )}
        {/* Quick add on hover */}
        {product.stock > 0 && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 left-3 right-3 bg-forest text-cream text-xs font-semibold py-2.5 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            + Add to Cart
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-ink/35 capitalize mb-1">{product.category} · {product.weight}</p>
        <h3 className="font-semibold text-ink text-sm leading-tight mb-2 group-hover:text-forest transition-colors">{product.name}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-ink">₹{product.salePrice || product.price}</span>
            {product.salePrice && (
              <span className="text-xs text-ink/35 line-through">₹{product.price}</span>
            )}
          </div>
          {product.rating > 0 && (
            <span className="text-xs text-ink/40 flex items-center gap-0.5">
              <span className="text-gold">★</span>{product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
