import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { cart, subtotal, shipping, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '', paymentMethod: 'Cash on Delivery' });
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(null);

  if (!cart.items.length && !placed) return <div className="page-center"><h2>Nothing to checkout.</h2><button className="btn btn-primary" onClick={() => navigate('/products')}>Back to shop</button></div>;

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setError('');
    try { const { data } = await api.post('/orders', { shippingAddress: { fullName: form.fullName, phone: form.phone, address: form.address, city: form.city, state: form.state, pincode: form.pincode }, paymentMethod: form.paymentMethod }); setPlaced(data); }
    catch (err) { setError(err.response?.data?.message || 'Could not place order'); }
  }

  if (placed) return <div className="page-center success-state"><CheckCircle2 size={64} /><span className="eyebrow">Order confirmed</span><h1>Thanks, {placed.shippingAddress.fullName}.</h1><p>Your order <strong>#{placed._id.slice(-8).toUpperCase()}</strong> has been placed successfully.</p><div className="success-box"><span>Order total</span><strong>₹{placed.total.toLocaleString('en-IN')}</strong></div><div><button className="btn btn-primary" onClick={() => navigate('/orders')}>View orders</button> <button className="btn btn-secondary" onClick={() => navigate('/products')}>Continue shopping</button></div></div>;

  return <div className="container page-content"><div className="section-title"><span className="eyebrow">Secure checkout</span><h1>Delivery & payment</h1></div><div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><h3>Delivery details</h3><div className="form-grid"><label>Full name<input name="fullName" required value={form.fullName} onChange={change} /></label><label>Phone<input name="phone" required pattern="[0-9]{10}" value={form.phone} onChange={change} placeholder="10-digit number" /></label><label className="wide">Address<textarea name="address" required value={form.address} onChange={change} /></label><label>City<input name="city" required value={form.city} onChange={change} /></label><label>State<input name="state" required value={form.state} onChange={change} /></label><label>Pincode<input name="pincode" required pattern="[0-9]{6}" value={form.pincode} onChange={change} /></label></div><h3>Payment method</h3><div className="payment-option"><input type="radio" checked readOnly /><div><strong>Cash on Delivery</strong><span>Demo payment mode for the internship project</span></div></div>{error && <div className="error-box">{error}</div>}<button className="btn btn-primary full" type="submit">Place order <CheckCircle2 size={18} /></button></form><aside className="summary"><h3>Your order</h3>{cart.items.map(item => <div className="mini-order" key={item.product._id}><img src={item.product.image} /><span>{item.product.title} × {item.quantity}</span><strong>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</strong></div>)}<div className="summary-sep"></div><div><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><div><span>Shipping</span><strong>{shipping ? `₹${shipping}` : 'FREE'}</strong></div><div className="summary-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div></aside></div></div>;
}
