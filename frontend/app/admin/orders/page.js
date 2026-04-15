'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { adminOrders, updateOrderStat } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  placed: 'bg-amber-50 text-amber-700', confirmed: 'bg-blue-50 text-blue-700',
  packed: 'bg-purple-50 text-purple-700', shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-700'
};

export default function AdminOrdersPage() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    load();
  }, [user, filter, page]);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter) params.status = filter;
      const { data } = await adminOrders(params);
      setOrders(data.orders);
      setTotal(data.total);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStat(id, status);
      setOrders(o => o.map(ord => ord._id === id ? { ...ord, orderStatus: status } : ord));
      toast.success('Updated');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-medium text-ink">Orders</h1>
          <p className="text-ink/40 mt-1 text-sm">{total} total orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`text-xs px-4 py-2 rounded-full capitalize transition-all ${filter === s ? 'bg-forest text-cream' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink/5">
                {['Order', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Update'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-ink/35 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-ink/35 text-sm">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-ink/35 text-sm">No orders found</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} className="border-b border-ink/5 hover:bg-cream-dark/20 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-ink/40">#{o._id.slice(-8)}</td>
                  <td className="px-5 py-4 text-xs text-ink/50">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-ink">{o.user?.name || 'Guest'}</p>
                    <p className="text-xs text-ink/35">{o.shippingAddress.city}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink/60">{o.items.length}</td>
                  <td className="px-5 py-4 text-sm font-bold text-ink">₹{o.total}</td>
                  <td className="px-5 py-4">
                    <span className={`badge text-xs ${o.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : o.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                      {o.paymentMethod === 'cod' ? 'COD' : o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge text-xs ${STATUS_COLORS[o.orderStatus] || ''}`}>{o.orderStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select value={o.orderStatus} onChange={e => handleStatus(o._id, e.target.value)}
                      className="text-xs border border-ink/10 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-forest">
                      {['placed','confirmed','packed','shipped','delivered','cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center gap-2 p-4">
            {[...Array(Math.ceil(total / 20))].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full text-sm font-medium ${page === i + 1 ? 'bg-forest text-cream' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
