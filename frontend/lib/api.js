import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const auth = JSON.parse(localStorage.getItem('lotus-auth') || '{}');
    const token = auth?.state?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('lotus-auth');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Product helpers ──────────────────────────────────────────────────────────
export const getProducts  = (params) => api.get('/products', { params });
export const getProduct   = (id)     => api.get(`/products/${id}`);
export const addReview    = (id, d)  => api.post(`/products/${id}/review`, d);

// ── Order helpers ────────────────────────────────────────────────────────────
export const createOrder  = (d)      => api.post('/orders', d);
export const getMyOrders  = ()       => api.get('/orders/my');
export const getOrder     = (id)     => api.get(`/orders/${id}`);

// ── Payment helpers ──────────────────────────────────────────────────────────
export const createRzpOrder = (d)    => api.post('/payments/create-order', d);
export const verifyPayment  = (d)    => api.post('/payments/verify', d);

// ── Auth helpers ─────────────────────────────────────────────────────────────
export const login    = (d) => api.post('/auth/login', d);
export const register = (d) => api.post('/auth/register', d);
export const getMe    = ()  => api.get('/auth/me');

// ── Admin helpers ─────────────────────────────────────────────────────────────
export const adminStats      = ()       => api.get('/admin/stats');
export const adminUsers      = ()       => api.get('/admin/users');
export const adminOrders     = (p)      => api.get('/orders', { params: p });
export const updateOrderStat = (id, s)  => api.put(`/orders/${id}/status`, { status: s });
export const createProduct   = (d)      => api.post('/products', d);
export const updateProduct   = (id, d)  => api.put(`/products/${id}`, d);
export const deleteProduct   = (id)     => api.delete(`/products/${id}`);
