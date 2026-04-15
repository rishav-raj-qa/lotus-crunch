'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';
import toast from 'react-hot-toast';

const EMPTY = { name:'', slug:'', description:'', shortDesc:'', price:'', salePrice:'', category:'classic', flavour:'', weight:'70g', stock:'', isFeatured:false, images:[''], benefits:[''], ingredients:'' };

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ limit: 50 });
      setProducts(data.products);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (p)  => {
    setEditing(p._id);
    setForm({ ...p, price: p.price.toString(), salePrice: p.salePrice?.toString() || '', stock: p.stock.toString(), images: p.images.length ? p.images : [''], benefits: p.benefits.length ? p.benefits : [''] });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return toast.error('Name, price, category required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug:      form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        price:     Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock:     Number(form.stock) || 0,
        images:    form.images.filter(Boolean),
        benefits:  form.benefits.filter(Boolean)
      };
      if (editing) await updateProduct(editing, payload);
      else         await createProduct(payload);
      toast.success(editing ? 'Product updated' : 'Product created');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-medium text-ink">Products</h1>
          <p className="text-ink/40 mt-1 text-sm">{products.length} products</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Product</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="skeleton rounded-2xl aspect-square" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5">
                  {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-ink/35 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-ink/5 hover:bg-cream-dark/20">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cream-dark/40 flex items-center justify-center shrink-0">
                          {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-xl" /> : <span>🪷</span>}
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm">{p.name}</p>
                          <p className="text-xs text-ink/35">{p.weight}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="badge bg-ink/5 text-ink/60 capitalize">{p.category}</span></td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink">₹{p.salePrice || p.price}{p.salePrice && <span className="text-xs text-ink/30 line-through ml-1">₹{p.price}</span>}</td>
                    <td className="px-5 py-4 text-sm text-ink/60">{p.stock}</td>
                    <td className="px-5 py-4"><span className={`badge text-xs ${p.isFeatured ? 'bg-forest/10 text-forest' : 'bg-ink/5 text-ink/30'}`}>{p.isFeatured ? 'Yes' : 'No'}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs border border-ink/15 px-3 py-1.5 rounded-lg hover:border-forest hover:text-forest transition-colors">Edit</button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="text-xs border border-ink/15 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-start justify-center py-8 px-4 overflow-y-auto">
          <div className="card w-full max-w-2xl p-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-medium text-ink">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(false)} className="text-ink/30 hover:text-ink text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Name *</label><input className="input-field" value={form.name} onChange={e => setF('name', e.target.value)} /></div>
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Slug (auto)</label><input className="input-field" value={form.slug} onChange={e => setF('slug', e.target.value)} placeholder="auto-generated" /></div>
              </div>
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Description *</label><textarea className="input-field h-20 resize-none" value={form.description} onChange={e => setF('description', e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Price *</label><input className="input-field" type="number" value={form.price} onChange={e => setF('price', e.target.value)} /></div>
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Sale Price</label><input className="input-field" type="number" value={form.salePrice} onChange={e => setF('salePrice', e.target.value)} /></div>
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Stock</label><input className="input-field" type="number" value={form.stock} onChange={e => setF('stock', e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Category *</label>
                  <select className="input-field" value={form.category} onChange={e => setF('category', e.target.value)}>
                    {['classic','flavoured','combo','gifting'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Flavour</label><input className="input-field" value={form.flavour} onChange={e => setF('flavour', e.target.value)} /></div>
                <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Weight</label><input className="input-field" value={form.weight} onChange={e => setF('weight', e.target.value)} /></div>
              </div>
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Image URL</label><input className="input-field" value={form.images[0]} onChange={e => setF('images', [e.target.value])} placeholder="https://..." /></div>
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Benefits (comma-separated)</label><input className="input-field" value={form.benefits.join(', ')} onChange={e => setF('benefits', e.target.value.split(',').map(s => s.trim()))} /></div>
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Ingredients</label><input className="input-field" value={form.ingredients} onChange={e => setF('ingredients', e.target.value)} /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setF('isFeatured', e.target.checked)} className="accent-forest" />
                <span className="text-sm text-ink/60">Featured product</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-50">{saving ? 'Saving…' : 'Save Product'}</button>
                <button onClick={() => setModal(false)} className="btn-secondary px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
