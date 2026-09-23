import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

async function getCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  if (!cart.populated('items.product')) await cart.populate('items.product');
  return cart;
}

router.get('/', protect, async (req, res, next) => {
  try { res.json(await getCart(req.user._id)); } catch (error) { next(error); }
});

router.post('/items', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock available' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity = Math.min(item.quantity + quantity, product.stock);
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    res.json(await getCart(req.user._id));
  } catch (error) { next(error); }
});

router.put('/items/:productId', protect, async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Invalid quantity' });
    const product = await Product.findById(req.params.productId);
    const cart = await Cart.findOne({ user: req.user._id });
    if (!product || !cart) return res.status(404).json({ message: 'Cart item not found' });
    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    if (quantity > product.stock) return res.status(400).json({ message: 'Not enough stock available' });
    item.quantity = quantity;
    await cart.save();
    res.json(await getCart(req.user._id));
  } catch (error) { next(error); }
});

router.delete('/items/:productId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ user: req.user._id, items: [] });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(await getCart(req.user._id));
  } catch (error) { next(error); }
});

export default router;
