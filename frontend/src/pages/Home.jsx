import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Headphones } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

const categories = [
  ['Audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'],
  ['Computers', 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=700&q=80'],
  ['Fashion', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80'],
  ['Home', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80']
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => { api.get('/products').then(({ data }) => setProducts(data.slice(0, 8))); }, []);

  return (
    <>
      <section className="hero container">
        <div className="hero-copy"><div className="hero-badge"><Sparkles size={15} /> Smart shopping, made simple</div><h1>Everything you need.<br /><span>One better cart.</span></h1><p>Discover handpicked tech, fashion and lifestyle products with fast checkout, personalized recommendations and a seamless shopping experience.</p><div className="hero-actions"><Link className="btn btn-primary" to="/products">Explore products <ArrowRight size={18} /></Link><button className="btn btn-secondary" onClick={() => navigate('/products?sort=rating')}>Top rated</button></div><div className="trust-row"><span><ShieldCheck size={18} /> Secure checkout</span><span><Truck size={18} /> Fast delivery</span><span><Headphones size={18} /> Support</span></div></div>
        <div className="hero-visual"><div className="hero-glow"></div><img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=80" alt="Shopping" /><div className="floating-card"><span>Today’s pick</span><strong>Nova Mechanical Keyboard</strong><small>4.8 ★ · 20% off</small></div></div>
      </section>

      <section className="container categories"><SectionTitle eyebrow="Explore" title="Shop by category" text="Quick paths to the things you use most." /><div className="category-grid">{categories.map(([name, image]) => <Link className="category-card" to={`/products?category=${name}`} key={name}><img src={image} alt={name} /><div><strong>{name}</strong><span>Browse now <ArrowRight size={15} /></span></div></Link>)}</div></section>

      <section className="container products-section"><div className="section-row"><SectionTitle eyebrow="Curated for you" title="Featured products" text="Strong ratings, great value, ready to ship." /><Link className="text-link" to="/products">View all <ArrowRight size={16} /></Link></div><div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div></section>

      <section className="container feature-band"><div><span className="eyebrow">Why ShopSphere</span><h2>Built like a real store,<br />not a college demo.</h2></div><div className="feature-points"><div><strong>01</strong><span>Search, filters & sorting</span></div><div><strong>02</strong><span>JWT authentication</span></div><div><strong>03</strong><span>Cart & simulated checkout</span></div><div><strong>04</strong><span>MongoDB order history</span></div></div></section>
    </>
  );
}
