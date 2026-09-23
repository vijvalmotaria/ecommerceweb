import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';

  useEffect(() => { api.get('/products/categories').then(({ data }) => setCategories(data)); }, []);
  useEffect(() => {
    api.get('/products', { params: { q, category, sort } }).then(({ data }) => setProducts(data));
  }, [q, category, sort]);

  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  return <div className="container page-content"><div className="products-head"><SectionTitle eyebrow="Store" title="Browse the collection" text="Find your next favorite product by category, price, popularity or search." /><div className="filters"><select value={category} onChange={e => setFilter('category', e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select><select value={sort} onChange={e => setFilter('sort', e.target.value)}><option value="newest">Newest</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div></div>{q && <p className="results-note">Showing results for <strong>“{q}”</strong></p>}<div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p} onAdded={setMessage} />)}</div>{!products.length && <div className="empty-state"><h3>No products found</h3><p>Try another search or clear your filters.</p></div>}{message && <button className="toast" onClick={() => setMessage('')}>{message} ×</button>}</div>;
}
