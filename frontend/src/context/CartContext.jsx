import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setCart({ items: [] }); return; }
    setLoading(true);
    api.get('/cart').then(({ data }) => setCart(data)).finally(() => setLoading(false));
  }, [user]);

  async function addToCart(productId, quantity = 1) {
    if (!user) throw new Error('Please login to add items to your cart');
    const { data } = await api.post('/cart/items', { productId, quantity });
    setCart(data);
  }

  async function updateQuantity(productId, quantity) {
    const { data } = await api.put(`/cart/items/${productId}`, { quantity });
    setCart(data);
  }

  async function removeFromCart(productId) {
    const { data } = await api.delete(`/cart/items/${productId}`);
    setCart(data);
  }

  const count = useMemo(() => cart.items.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 60;
  const total = subtotal + shipping;

  return <CartContext.Provider value={{ cart, count, subtotal, shipping, total, loading, addToCart, updateQuantity, removeFromCart }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
