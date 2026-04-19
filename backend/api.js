import express from 'express';
import { mysqlDB, mongoDB } from './db.js';

const router = express.Router();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to stitch MySQL core data with MongoDB document data
const getFullRestaurantInfo = (mysqlRest) => {
  const mongoDetails = mongoDB.restaurantDetails.find(doc => doc.restaurantId === mysqlRest.id);
  return {
    ...mysqlRest,
    name: mongoDetails?.title || "Unknown Restaurant",
    description: mongoDetails?.description || "",
    reviews: mysqlRest.reviewsCount
  };
};

router.get('/categories', async (req, res) => {
  await delay(400);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(mysqlDB.categories);
  res.json(mysqlDB.categories.filter(c => c.name.toLowerCase().includes(q)));
});

router.get('/restaurants', async (req, res) => {
  await delay(600);
  const fullRestaurants = mysqlDB.restaurants.map(getFullRestaurantInfo);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(fullRestaurants);
  
  res.json(fullRestaurants.filter(r => 
    r.name.toLowerCase().includes(q) || 
    r.type.toLowerCase().includes(q)
  ));
});

router.get('/restaurants/:id', async (req, res) => {
  await delay(500);
  const id = parseInt(req.params.id);
  const mysqlRest = mysqlDB.restaurants.find(r => r.id === id);
  if (!mysqlRest) return res.status(404).json({ message: "Not found" });
  
  const menu = mysqlDB.featuredItems.filter(item => item.restaurantId === id);
  const fullRestaurant = getFullRestaurantInfo(mysqlRest);
  
  res.json({
    ...fullRestaurant,
    menu: menu.length > 0 ? menu : mysqlDB.featuredItems
  });
});

router.get('/restaurants/:id/reviews', async (req, res) => {
  await delay(600);
  const id = parseInt(req.params.id);
  const reviews = mongoDB.reviews.filter(r => r.restaurantId === id);
  res.json(reviews.length > 0 ? reviews : mongoDB.reviews);
});

router.get('/restaurants/:id/photos', async (req, res) => {
  await delay(400);
  res.json(mysqlDB.photos);
});

router.get('/brands', async (req, res) => {
  await delay(400);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(mysqlDB.topBrands);
  res.json(mysqlDB.topBrands.filter(b => b.name.toLowerCase().includes(q)));
});

router.get('/featured', async (req, res) => {
  await delay(500);
  const q = (req.query.q || '').toLowerCase();
  if(!q) return res.json(mysqlDB.featuredItems);
  res.json(mysqlDB.featuredItems.filter(f => f.name.toLowerCase().includes(q)));
});

router.get('/food/:id', async (req, res) => {
  await delay(400);
  const id = parseInt(req.params.id);
  const foodItem = mysqlDB.featuredItems.find(f => f.id === id);
  if (!foodItem) return res.status(404).json({ message: "Food item not found" });
  res.json(foodItem);
});

router.get('/food/:id/comments', async (req, res) => {
  await delay(500);
  const id = parseInt(req.params.id);
  const comments = mongoDB.foodComments.filter(c => c.foodId === id);
  res.json(comments);
});

router.get('/orders', async (req, res) => {
  await delay(400);
  // Placeholder mock orders from backend
  res.json([
    { id: '#ORD-9999', date: 'April 18, 2026', items: 'Spicy Mango Chicken x 2', total: '₹29.98', status: 'Delivered' },
    { id: '#ORD-8888', date: 'April 10, 2026', items: 'Classic Beef Burger x 1', total: '₹12.99', status: 'Delivered' }
  ]);
});

router.get('/addresses', async (req, res) => {
  await delay(300);
  res.json([
    { id: 1, type: "Home", isDefault: true, street: "123 Food Street, Apt 4B", city: "New York, NY", zip: "10001" },
    { id: 2, type: "Office", isDefault: false, street: "456 Tech Avenue, Floor 9", city: "New York, NY", zip: "10012" }
  ]);
});

router.get('/cart', async (req, res) => {
  res.json(mongoDB.cart);
});

router.put('/cart/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { action } = req.body;
  const item = mongoDB.cart.find(c => c.id === id);
  if (item) {
    if (action === 'add') item.quantity += 1;
    if (action === 'sub' && item.quantity > 1) item.quantity -= 1;
  }
  res.json(mongoDB.cart);
});

router.delete('/cart/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  mongoDB.cart = mongoDB.cart.filter(c => c.id !== id);
  res.json(mongoDB.cart);
});

router.get('/notifications', async (req, res) => {
  res.json(mongoDB.notifications);
});

router.delete('/notifications', async (req, res) => {
  mongoDB.notifications = [];
  res.json(mongoDB.notifications);
});

// --- ADMIN SPECIFIC ROUTES ---

router.get('/admin/users', async (req, res) => {
  await delay(500);
  res.json([
    { id: 1, name: 'Irfan Khan', email: 'irfan@demo.com', phone: '9999900000', status: 'active', orders: 12, address1: '123 Mango Street' },
    { id: 2, name: 'Sarah Miller', email: 'sarah@test.com', phone: '8888811111', status: 'blocked', orders: 0, address1: '456 Orange Ave' },
    { id: 3, name: 'David Smith', email: 'david@web.com', phone: '7777722222', status: 'active', orders: 5, address1: '789 Banana Blvd' },
  ]);
});

router.get('/admin/stats', async (req, res) => {
  res.json({
    orders: 1248,
    users: 842,
    revenue: '₹1,14,892',
    restaurants: 24
  });
});

router.get('/admin/payments', async (req, res) => {
  res.json([
    { id: 'pay_razor_001', method: 'Razorpay', amount: '₹1,200', status: 'success', date: '10m ago' },
    { id: 'pay_razor_002', method: 'Razorpay', amount: '₹850', status: 'failed', date: '1h ago' },
    { id: 'pay_razor_003', method: 'Razorpay', amount: '₹2,400', status: 'success', date: '3h ago' },
  ]);
});

export default router;
