'use client';
import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { getProducts } from '@/lib/api';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'classic',   label: 'Classic' },
  { value: 'flavoured', label: 'Flavoured' },
  { value: 'combo',     label: 'Combo' },
  { value: 'gifting',   label: 'Gifting' }
];
const SORTS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low–High' },
  { value: 'price_desc', label: 'Price: High–Low' },
  { value: 'rating',     label: 'Top Rated' }
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [category, setCategory] = useState('');
  const [sort,     setSort]     = useState('newest');
  const [maxPrice, setMaxPrice] = useState('');
  const [page,     setPage]     = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 12 };
      if (category) params.category = category;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await getProducts(params);
      setProducts(data.products);
      setTotal(data.total);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [category, sort, maxPrice, page]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [category, sort, maxPrice]);

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-medium text-ink">Shop</h1>
        <p className="text-ink/45 mt-2">{total} products</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="md:w-52 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-xs font-bold tracking-widest text-ink/30 uppercase mb-3">Category</h3>
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                {CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      category === c.value
                        ? 'bg-forest text-cream'
                        : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-widest text-ink/30 uppercase mb-3">Max Price</h3>
              <input
                type="number"
                placeholder="e.g. 500"
                className="input-field text-sm"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-widest text-ink/30 uppercase mb-3">Sort By</h3>
              <select value={sort} onChange={e => setSort(e.target.value)} className="input-field text-sm">
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl skeleton aspect-[3/4]" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="text-6xl">🔍</span>
              <h3 className="font-display text-2xl text-ink">No products found</h3>
              <p className="text-ink/45 text-sm">Try adjusting your filters.</p>
              <button onClick={() => { setCategory(''); setMaxPrice(''); }} className="btn-primary mt-2">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(Math.ceil(total / 12))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${page === i + 1 ? 'bg-forest text-cream' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
