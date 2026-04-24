import express from 'express';
import cors from 'cors';
import { mysqlDB, mongoDB } from './db.js';
import { loggingMiddleware, placeholderMiddleware } from './middleware.js';
import authRoutes from './auth.js';
import paymentRoutes from './payment.js';
import apiRoutes from './api.js';
import pool from './mysql-connection.js';
import './firebase-admin.js';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use(loggingMiddleware);
app.use(placeholderMiddleware);

// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming: ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', apiRoutes);

// Test Database Connection
pool.getConnection()
  .then(connection => {
    console.log('[MySQL] Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('[MySQL] Database connection failed:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`[Architecture]: Dual-DB setup (MySQL Core + MongoDB Documents) initialized.`);
});
