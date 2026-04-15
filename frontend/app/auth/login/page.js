'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { login } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      const { data } = await login(form);
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center text-cream font-display mx-auto mb-4">LC</div>
          <h1 className="font-display text-3xl font-medium text-ink">Welcome back</h1>
          <p className="text-ink/45 mt-2 text-sm">Sign in to your Lotus Crunch account</p>
        </div>

        <div className="card p-8 space-y-5">
          <div>
            <label className="text-xs font-medium text-ink/40 mb-1.5 block">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/40 mb-1.5 block">Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-sm text-ink/45 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-forest font-semibold hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
