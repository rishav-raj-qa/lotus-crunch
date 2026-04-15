'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { adminStats, adminOrders, updateOrderStat } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const [stats,  setStats]  = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    const load = async () => {
      try {
        const [s, o] = await Promise.all([adminStats(), adminOrders({ limit: 10 })]);
        setStats(s.data);
        setOrders(o.data.orders);
      } catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, [user, router]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStat(id, status);
      setOrders(o => o.map(ord => ord._id === id ? { ...ord, orderStatus: status } : ord));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="pt-36 text-center text-ink/40">Loading dashboard…</div>;

  const STATUS_COLORS = { placed: 'bg-amber-50 text-amber-700', confirmed: 'bg-blue-50 text-blue-700', packed: 'bg-purple-50 text-purple-700', shipped: 'bg-indigo-50 text-indigo-700', delivered: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-700' };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-medium text-ink">Admin Dashboard</h1>
          <p className="text-ink/40 mt-1 text-sm">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="btn-primary py-2.5 text-xs">Manage Products</Link>
          <Link href="/admin/orders"   className="btn-secondary py-2.5 text-xs">All Orders</Link>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            ['Total Revenue', `₹${stats.totalRevenue.toLocaleString()}`, '💰'],
            ['Total Orders',  stats.totalOrders, '📦'],
            ['Total Users',   stats.totalUsers, '👥'],
            ['Products',      stats.totalProducts, '🪷']
          ].map(([label, value, icon]) => (
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-ink/40 font-medium">{label}</p>
                <span className="text-2xl">{icon}</span>
              </div>
              <p className="font-bold text-2xl text-ink">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-ink/5 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-forest hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink/5">
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-ink/35 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-ink/5 hover:bg-cream-dark/20 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-ink/40">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm text-ink">{order.user?.name || order.guestEmail?.split('@')[0] || 'Guest'}</td>
                  <td className="px-6 py-4 text-sm text-ink/60">{order.items.length} item(s)</td>
                  <td className="px-6 py-4 text-sm font-semibold text-ink">₹{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${STATUS_COLORS[order.orderStatus] || 'bg-ink/5 text-ink/50'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={e => handleStatusUpdate(order._id, e.target.value)}
                      className="text-xs border border-ink/10 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-forest"
                    >
                      {['placed','confirmed','packed','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="text-center py-12 text-ink/35 text-sm">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
