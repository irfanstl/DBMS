import express from 'express';

const router = express.Router();

// Hardcoded mock accounts
const MOCK_ACCOUNTS = [
  { id: 1, name: "Demo User", email: "user@demo.com", password: "user123", role: "user" },
  { id: 2, name: "Demo Admin", email: "admin@demo.com", password: "admin123", role: "admin" }
];

// Route to generate and print OTP
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  
  // Set default OTP for Admin, random for others
  const otp = phone === '0000000000' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  
  console.log('------------------------------------------');
  console.log(`[AUTH] OTP Request for: +91 ${phone}`);
  console.log(`[CODE] Your OTP is: ${otp}`);
  console.log('------------------------------------------');
  
  res.json({ success: true, message: "OTP sent successfully" });
});

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
