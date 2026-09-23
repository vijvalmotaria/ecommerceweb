import express from 'express';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Your cart is empty' });

    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;
    const required = ['fullName', 'phone', 'address', 'city', 'state', 'pincode'];
    if (!shippingAddress || required.some(key => !shippingAddress[key])) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.title}` });
      }
      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      });
    }

    // Simulated checkout: deduct stock, then create the order.
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    const shipping = subtotal >= 999 ? 0 : 60;
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod
    });

    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { next(error); }
});

export default router;
