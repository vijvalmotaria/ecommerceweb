import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const products = [
  { title: 'AeroLite Wireless Headphones', description: 'Noise-cancelling wireless headphones with up to 40 hours of battery life.', category: 'Audio', price: 2499, oldPrice: 3999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', brand: 'AeroLite', rating: 4.7, reviewCount: 218, stock: 34, tags: ['headphones', 'wireless', 'audio'] },
  { title: 'PulseFit Smart Watch', description: 'AMOLED fitness smartwatch with heart-rate, sleep and workout tracking.', category: 'Wearables', price: 3299, oldPrice: 4999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', brand: 'PulseFit', rating: 4.6, reviewCount: 164, stock: 27, tags: ['smartwatch', 'fitness', 'wearable'] },
  { title: 'Nova Mechanical Keyboard', description: 'Hot-swappable mechanical keyboard with RGB lighting and tactile switches.', category: 'Computers', price: 3999, oldPrice: 5499, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80', brand: 'Nova', rating: 4.8, reviewCount: 301, stock: 19, tags: ['keyboard', 'mechanical', 'gaming'] },
  { title: 'Orbit Pro Mouse', description: 'Ergonomic precision mouse with customizable buttons and a high-accuracy sensor.', category: 'Computers', price: 1599, oldPrice: 2299, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80', brand: 'Orbit', rating: 4.5, reviewCount: 119, stock: 52, tags: ['mouse', 'gaming', 'computer'] },
  { title: 'PixelMax 27-inch Monitor', description: 'QHD IPS monitor with a 165Hz refresh rate and ultra-thin bezels.', category: 'Computers', price: 18999, oldPrice: 22999, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80', brand: 'PixelMax', rating: 4.7, reviewCount: 88, stock: 11, tags: ['monitor', 'display', 'gaming'] },
  { title: 'UrbanMove Sneakers', description: 'Everyday lightweight sneakers built for city walks and active weekends.', category: 'Fashion', price: 2199, oldPrice: 3499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', brand: 'UrbanMove', rating: 4.4, reviewCount: 197, stock: 45, tags: ['sneakers', 'shoes', 'fashion'] },
  { title: 'Terra Everyday Backpack', description: 'Water-resistant 24L backpack with laptop sleeve and travel organizer.', category: 'Fashion', price: 1799, oldPrice: 2599, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', brand: 'Terra', rating: 4.6, reviewCount: 146, stock: 38, tags: ['backpack', 'travel', 'laptop'] },
  { title: 'BrewCraft Coffee Maker', description: 'Compact programmable coffee maker for rich morning brews at home.', category: 'Home', price: 2799, oldPrice: 3999, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', brand: 'BrewCraft', rating: 4.3, reviewCount: 76, stock: 22, tags: ['coffee', 'kitchen', 'home'] },
  { title: 'GlowDesk Ambient Lamp', description: 'Minimal smart desk lamp with adjustable brightness and warm/cool modes.', category: 'Home', price: 1299, oldPrice: 1799, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', brand: 'GlowDesk', rating: 4.5, reviewCount: 91, stock: 30, tags: ['lamp', 'desk', 'home'] },
  { title: 'GameBox X Controller', description: 'Low-latency wireless controller with haptic feedback and ergonomic grips.', category: 'Gaming', price: 2999, oldPrice: 3999, image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=80', brand: 'GameBox', rating: 4.8, reviewCount: 245, stock: 24, tags: ['controller', 'gaming', 'console'] }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);

  const adminEmail = 'admin@shopsphere.com';
  const password = await bcrypt.hash('Admin@123', 12);
  await User.findOneAndUpdate(
    { email: adminEmail },
    { name: 'ShopSphere Admin', email: adminEmail, password, role: 'admin' },
    { upsert: true, new: true }
  );

  console.log(`Seeded ${products.length} products`);
  console.log('Demo admin: admin@shopsphere.com / Admin@123');
  await mongoose.disconnect();
}

seed().catch(error => { console.error(error); process.exit(1); });
