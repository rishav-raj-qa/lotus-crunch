'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/store';
import { createOrder, createRzpOrder, verifyPayment } from '@/lib/api';
import toast from 'react-hot-toast';

const INDIAN_STATES = ['Andhra Pradesh','Bihar','Delhi','Gujarat','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState('razorpay');
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', email: user?.email || '',
    line1: '', line2: '', city: '', state: 'Bihar', pincode: ''
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const required = ['name','phone','email','line1','city','state','pincode'];
    for (const k of required) {
      if (!form[k].trim()) { toast.error(`${k.charAt(0).toUpperCase() + k.slice(1)} is required`); return false; }
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Invalid phone number'); return false; }
    if (!/^\d{6}$/.test(form.pincode))     { toast.error('Invalid pincode'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!items.length) return toast.error('Your cart is empty');
    if (!validate()) return;
    setLoading(true);
    try {
      const orderPayload = {
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: { name: form.name, phone: form.phone, line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode },
        paymentMethod: payMethod,
        guestEmail: form.email
      };

      const { data: order } = await createOrder(orderPayload);

      if (payMethod === 'cod') {
        clearCart();
        router.push(`/order-success?id=${order._id}`);
        return;
      }

      // Razorpay
      const { data: rzp } = await createRzpOrder({ orderId: order._id });

      const options = {
        key:         rzp.keyId,
        amount:      rzp.amount,
        currency:    rzp.currency,
        order_id:    rzp.razorpayOrderId,
        name:        'Lotus Crunch',
        description: 'Premium Makhana',
        prefill:     { name: form.name, email: form.email, contact: form.phone },
        theme:       { color: '#3D6B3D' },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId:           order._id
            });
            clearCart();
            router.push(`/order-success?id=${order._id}`);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (!items.length) return (
    <div className="pt-36 pb-24 text-center px-4">
      <h2 className="font-display text-3xl text-ink mb-4">Cart is empty</h2>
      <a href="/shop" className="btn-primary">Back to Shop</a>
    </div>
  );

  return (
    <div className="pt-28 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      <h1 className="font-display text-4xl font-medium text-ink mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Full Name</label><input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rishav Kumar" /></div>
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Phone</label><input className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" /></div>
            </div>
            <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Email</label><input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" /></div>
          </div>

          {/* Address */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink">Shipping Address</h2>
            <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Address Line 1</label><input className="input-field" value={form.line1} onChange={e => set('line1', e.target.value)} placeholder="House/Flat No, Street" /></div>
            <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Address Line 2 (optional)</label><input className="input-field" value={form.line2} onChange={e => set('line2', e.target.value)} placeholder="Landmark" /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">City</label><input className="input-field" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Patna" /></div>
              <div>
                <label className="text-xs text-ink/40 font-medium mb-1.5 block">State</label>
                <select className="input-field" value={form.state} onChange={e => set('state', e.target.value)}>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-ink/40 font-medium mb-1.5 block">Pincode</label><input className="input-field" value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="800001" maxLength={6} /></div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink">Payment Method</h2>
            {[['razorpay', '💳 Pay Online (UPI / Card / Net Banking)', 'Secure payment via Razorpay'], ['cod', '🏠 Cash on Delivery', 'Pay when your order arrives']].map(([val, label, sub]) => (
              <label key={val} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === val ? 'border-forest bg-forest/5' : 'border-ink/10 hover:border-ink/20'}`}>
                <input type="radio" name="payment" value={val} checked={payMethod === val} onChange={() => setPayMethod(val)} className="mt-0.5 accent-forest" />
                <div>
                  <p className="font-semibold text-sm text-ink">{label}</p>
                  <p className="text-xs text-ink/40 mt-0.5">{sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-ink mb-5">Order Summary</h3>
            <div className="space-y-3 mb-5">
              {items.map(i => (
                <div key={i._id} className="flex justify-between text-sm">
                  <span className="text-ink/60 truncate max-w-[160px]">{i.name} × {i.quantity}</span>
                  <span className="font-medium text-ink">₹{(i.salePrice || i.price) * i.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-ink/55"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-ink/55"><span>Shipping</span><span className={shipping === 0 ? 'text-forest font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="flex justify-between font-bold text-ink text-base pt-2 border-t border-ink/5"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary w-full justify-center mt-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing…' : payMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${total}`}
            </button>
            <p className="text-[11px] text-ink/30 text-center mt-3">🔒 Secured by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
