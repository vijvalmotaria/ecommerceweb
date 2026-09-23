import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, onAdded }) {
  const { addToCart } = useCart();
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  async function add(e) {
    e.preventDefault();
    try { await addToCart(product._id); onAdded?.('Added to cart'); }
    catch (error) { onAdded?.(error.response?.data?.message || error.message); }
  }

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image-wrap">
        {discount > 0 && <span className="discount">-{discount}%</span>}
        <img src={product.image} alt={product.title} className="product-image" />
      </div>
      <div className="product-body">
        <div className="product-meta"><span>{product.category}</span><span className="rating"><Star size={14} fill="currentColor" /> {product.rating}</span></div>
        <h3>{product.title}</h3>
        <p className="brand">{product.brand}</p>
        <div className="product-bottom">
          <div><strong>₹{product.price.toLocaleString('en-IN')}</strong>{product.oldPrice && <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>}</div>
          <button className="add-mini" onClick={add} title="Add to cart"><ShoppingCart size={17} /></button>
        </div>
      </div>
    </Link>
  );
}
