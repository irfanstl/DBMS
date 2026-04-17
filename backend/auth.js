import express from 'express';

const router = express.Router();

// Mock Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`[Auth] User attempting to login with: ${email}`);
  res.json({ message: "Login successful!", token: "simulated_jwt_token", user: { name: "John Doe", email } });
});

// Mock Signup Route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log(`[Auth] User registering: ${name} (${email})`);
  res.status(201).json({ message: "Signup successful!", status: "success" });
});

export default router;
