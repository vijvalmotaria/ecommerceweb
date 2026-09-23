import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      api.get('/products', { params: { category: data.category, sort: 'rating' } }).then(r => setRecommended(r.data.filter(p => p._id !== data._id).slice(0, 4)));
    });
  }, [id]);

  if (!product) return <div className="page-center">Loading product…</div>;
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  async function add() {
    try { await addToCart(product._id, qty); setNotice('Added to cart'); } catch (error) { setNotice(error.response?.data?.message || error.message); }
  }

  return <div className="container page-content"><Link className="back-link" to="/products"><ArrowLeft size={17} /> Back to shop</Link><div className="detail-grid"><div className="detail-image"><img src={product.image} alt={product.title} /></div><div className="detail-copy"><div className="product-meta"><span>{product.category}</span><span className="rating"><Star size={14} fill="currentColor" /> {product.rating} ({product.reviewCount})</span></div><h1>{product.title}</h1><p className="brand large">{product.brand}</p><div className="price-line"><strong>₹{product.price.toLocaleString('en-IN')}</strong>{product.oldPrice && <><del>₹{product.oldPrice.toLocaleString('en-IN')}</del><span className="save">Save {discount}%</span></>}</div><p className="detail-description">{product.description}</p><div className="stock"><Check size={16} /> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div><div className="purchase-row"><div className="qty"><button disabled={qty === 1} onClick={() => setQty(q => q - 1)}><Minus size={15} /></button><span>{qty}</span><button disabled={qty >= product.stock} onClick={() => setQty(q => q + 1)}><Plus size={15} /></button></div><button className="btn btn-primary grow" disabled={!product.stock} onClick={add}>Add to cart</button><button className="btn btn-secondary" disabled={!product.stock} onClick={async () => { await add(); navigate('/cart'); }}>Buy now</button></div>{notice && <div className="notice">{notice}</div>}<div className="perks"><span><Truck size={19} /><b>Fast delivery</b><small>Across India</small></span><span><ShieldCheck size={19} /><b>Secure payments</b><small>Protected checkout</small></span></div></div></div>{recommended.length > 0 && <section className="related"><div className="section-row"><div><span className="eyebrow">You may also like</span><h2>More from {product.category}</h2></div></div><div className="product-grid">{recommended.map(p => <ProductCard key={p._id} product={p} />)}</div></section>}</div>;
}
