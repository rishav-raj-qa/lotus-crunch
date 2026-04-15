'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { register } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await register(form);
      setAuth(data.user, data.token);
      toast.success(`Welcome to Lotus Crunch, ${data.user.name}!`);
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center text-cream font-display mx-auto mb-4">LC</div>
          <h1 className="font-display text-3xl font-medium text-ink">Create account</h1>
          <p className="text-ink/45 mt-2 text-sm">Join thousands of healthy snackers</p>
        </div>

        <div className="card p-8 space-y-5">
          <div>
            <label className="text-xs font-medium text-ink/40 mb-1.5 block">Full Name</label>
            <input className="input-field" placeholder="Rishav Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/40 mb-1.5 block">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/40 mb-1.5 block">Password</label>
            <input className="input-field" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-sm text-ink/45 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-forest font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
