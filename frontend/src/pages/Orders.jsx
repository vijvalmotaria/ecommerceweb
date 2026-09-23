import { useEffect, useState } from 'react';
import { Package, Clock3 } from 'lucide-react';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders/my').then(({ data }) => setOrders(data)); }, []);
  return <div className="container page-content"><div className="section-title"><span className="eyebrow">Account</span><h1>Your orders</h1><p>Everything you've checked out through ShopSphere.</p></div>{!orders.length ? <div className="empty-state"><Package size={38} /><h3>No orders yet</h3><p>Your completed checkouts will appear here.</p></div> : <div className="orders-list">{orders.map(order => <article className="order-card" key={order._id}><div className="order-head"><div><span className="eyebrow">Order #{order._id.slice(-8).toUpperCase()}</span><h3>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</h3></div><span className="status"><Clock3 size={15} /> {order.status}</span></div><div className="order-products">{order.items.map((item, index) => <div className="mini-order" key={index}><img src={item.image} /><span>{item.title} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></div>)}</div><div className="order-total"><span>Total paid on delivery</span><strong>₹{order.total.toLocaleString('en-IN')}</strong></div></article>)}</div>}</div>;
}
