import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, UserRound, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="navbar-wrap">
      <div className="navbar container">
        <Link className="brand" to="/">Shop<span>Sphere</span></Link>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
        </nav>
        <form className="nav-search" onSubmit={submit}>
          <Search size={18} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." />
        </form>
        <div className="nav-actions">
          {user ? (
            <button className="icon-btn" title="Logout" onClick={logout}><LogOut size={18} /></button>
          ) : <Link className="icon-btn" title="Login" to="/auth"><UserRound size={18} /></Link>}
          <Link className="cart-pill" to="/cart"><ShoppingBag size={19} /><span>{count}</span></Link>
        </div>
      </div>
    </header>
  );
}
