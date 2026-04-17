import express from 'express';

const router = express.Router();

// Mock Payment Processing Route
router.post('/process', (req, res) => {
  const { amount, method } = req.body;
  console.log(`[Payment] Processing payment of $${amount} via ${method || 'Credit Card'}`);
  
  // Simulate successful payment
  setTimeout(() => {
    res.json({ 
      message: "Payment processed successfully", 
      status: "ok", 
      transactionId: `txn_${Math.floor(Math.random() * 1000000)}` 
    });
  }, 1500);
});

export default router;
