'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/api';
import { useCartStore } from '@/store';
import ProductCard from '@/components/shop/ProductCard';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id }  = useParams();
  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [qty,      setQty]      = useState(1);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [loading,  setLoading]  = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getProduct(id);
        setProduct(data);
        const rel = await getProducts({ category: data.category, limit: 4 });
        setRelated(rel.data.products.filter(p => p._id !== data._id).slice(0, 3));
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="skeleton aspect-square rounded-3xl" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className={`skeleton h-6 rounded-xl ${i === 0 ? 'w-2/3' : 'w-full'}`} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="pt-40 text-center text-ink/40">Product not found.</div>;

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${product.name} added to cart 🛒`);
  };

  const displayPrice = product.salePrice || product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : null;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-dark/30">
              {product.images?.[imgIdx] ? (
                <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="text-8xl">🪷</span></div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-forest' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-ink/35 uppercase tracking-widest capitalize mb-2">{product.category} · {product.weight}</p>
              <h1 className="font-display text-3xl md:text-4xl font-medium text-ink">{product.name}</h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <span key={i} className={`text-sm ${i < Math.round(product.rating) ? 'text-gold' : 'text-ink/15'}`}>★</span>)}</div>
                  <span className="text-sm text-ink/40">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-3xl text-ink">₹{displayPrice}</span>
              {product.salePrice && <span className="text-lg text-ink/30 line-through">₹{product.price}</span>}
              {discount && <span className="badge bg-forest/10 text-forest">{discount}% off</span>}
            </div>

            <p className="text-ink/60 text-sm leading-relaxed">{product.description}</p>

            {/* Benefits */}
            {product.benefits?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.benefits.map(b => (
                  <span key={b} className="badge bg-ink/5 text-ink/60 text-xs">{b}</span>
                ))}
              </div>
            )}

            {/* Qty + Add to Cart */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-ink/15 rounded-full overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-ink/5 transition-colors text-ink/60 font-medium">−</button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 hover:bg-ink/5 transition-colors text-ink/60 font-medium">+</button>
                </div>
                <button onClick={handleAdd} className="btn-primary flex-1 justify-center py-3.5">Add to Cart</button>
              </div>
            ) : (
              <button disabled className="btn-primary opacity-40 cursor-not-allowed w-full justify-center">Out of Stock</button>
            )}

            {/* Nutrition */}
            {product.nutrition && (
              <div className="bg-cream-dark/40 rounded-2xl p-5">
                <h3 className="font-semibold text-ink text-sm mb-3">Nutrition per 100g</h3>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {[['Calories', product.nutrition.calories, 'kcal'], ['Protein', product.nutrition.protein, 'g'], ['Fat', product.nutrition.fat, 'g'], ['Carbs', product.nutrition.carbs, 'g'], ['Fibre', product.nutrition.fibre, 'g']].map(([label, val, unit]) => (
                    <div key={label} className="bg-white rounded-xl p-2.5">
                      <p className="font-bold text-ink text-sm">{val}{unit}</p>
                      <p className="text-ink/35 text-[10px] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div>
                <h3 className="font-semibold text-ink text-sm mb-1">Ingredients</h3>
                <p className="text-ink/50 text-sm">{product.ingredients}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-ink/5 text-xs text-ink/35 font-medium">
              {['Free shipping above ₹499', '7-day easy returns', 'Secure checkout'].map(t => (
                <span key={t} className="flex items-center gap-1.5"><span className="text-forest">✓</span>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="section-title mb-8">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
