import { useState } from 'react';
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  async function submit(e) {
    e.preventDefault(); setError('');
    try { mode === 'login' ? await login(form.email, form.password) : await register(form.name, form.email, form.password); navigate(params.get('redirect') || '/'); }
    catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
  }

  return <div className="auth-page"><div className="auth-panel"><div className="auth-copy"><span className="eyebrow">Welcome to ShopSphere</span><h1>{mode === 'login' ? 'Your cart is waiting.' : 'Start your smarter shopping journey.'}</h1><p>Sign in to manage your cart, place orders and see your purchase history.</p><div className="auth-stat"><strong>10+</strong><span>demo products<br />ready to explore</span></div></div><div className="auth-form"><div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign in</button><button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create account</button></div><form onSubmit={submit}>{mode === 'register' && <label>Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>}<label>Email<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input type="password" required minLength="6" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" /></label>{error && <div className="error-box">{error}</div>}<button className="btn btn-primary full" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={18} /></button></form><div className="form-note"><LockKeyhole size={16} /> JWT-secured account</div></div></div></div>;
}
