import express from 'express';
import cors from 'cors';
import { mysqlDB, mongoDB } from './db.js';
import { loggingMiddleware, placeholderMiddleware } from './middleware.js';
import authRoutes from './auth.js';
import paymentRoutes from './payment.js';
import apiRoutes from './api.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(loggingMiddleware);
app.use(placeholderMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`[Architecture]: Dual-DB setup (MySQL Core + MongoDB Documents) initialized.`);
});
