const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = 5001;
const MONGO_URI = 'mongodb://localhost:6000/organizer_db'; 

// --- Middleware ---
// Allow our React app to talk to this server
app.use(cors());
// Allow the server to parse JSON data from requests
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Models ---
// Simple user schema. In a real app, remember to hash passwords!
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// --- Routes ---

// 1. Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "That email is already in use." });
    }

    // Create and save the new user
    const newUser = new User({ email, password });
    await newUser.save();

    console.log(`🆕 New user registered: ${email}`);
    res.json(newUser);

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Something went wrong during registration." });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by credentials
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log(`👋 User logged in: ${email}`);
    res.json(user);

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Something went wrong during login." });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running and listening on http://localhost:${PORT}`);
});