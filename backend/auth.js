import express from 'express';

const router = express.Router();

// Hardcoded mock accounts
const MOCK_ACCOUNTS = [
  { id: 1, name: "Demo User", email: "user@demo.com", password: "user123", role: "user" },
  { id: 2, name: "Demo Admin", email: "admin@demo.com", password: "admin123", role: "admin" }
];

// Mock Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`[Auth] Login attempt: ${email}`);
  
  const user = MOCK_ACCOUNTS.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...safeUser } = user;
    res.json({ message: "Login successful!", token: "simulated_jwt_token", user: safeUser });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Mock Signup Route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log(`[Auth] User registering: ${name} (${email})`);
  res.status(201).json({ message: "Signup successful!", status: "success" });
});

export default router;
