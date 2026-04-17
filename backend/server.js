import express from 'express';
import cors from 'cors';
import { CATEGORIES, RESTAURANTS, TOP_BRANDS, FEATURED_ITEMS, REVIEWS, PHOTOS } from './db.js';
import authRoutes from './auth.js';
import paymentRoutes from './payment.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/api/categories', async (req, res) => {
  await delay(400);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(CATEGORIES);
  res.json(CATEGORIES.filter(c => c.name.toLowerCase().includes(q)));
});

app.get('/api/restaurants', async (req, res) => {
  await delay(600);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(RESTAURANTS);
  res.json(RESTAURANTS.filter(r => r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)));
});

app.get('/api/restaurants/:id', async (req, res) => {
  await delay(500);
  const id = parseInt(req.params.id);
  const restaurant = RESTAURANTS.find(r => r.id === id);
  if (!restaurant) return res.status(404).json({ message: "Not found" });
  
  res.json({
    ...restaurant,
    menu: FEATURED_ITEMS
  });
});

app.get('/api/restaurants/:id/reviews', async (req, res) => {
  await delay(600);
  res.json(REVIEWS);
});

app.get('/api/restaurants/:id/photos', async (req, res) => {
  await delay(400);
  res.json(PHOTOS);
});

app.get('/api/brands', async (req, res) => {
  await delay(400);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(TOP_BRANDS);
  res.json(TOP_BRANDS.filter(b => b.name.toLowerCase().includes(q)));
});

app.get('/api/featured', async (req, res) => {
  await delay(500);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(FEATURED_ITEMS);
  res.json(FEATURED_ITEMS.filter(f => f.name.toLowerCase().includes(q)));
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
