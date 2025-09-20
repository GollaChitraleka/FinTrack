// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const app = express();
app.use(cors());
app.use(express.json());

// Mongoose connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transaction schema
const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes

// GET all transactions (most recent first)
app.get('/api/transactions', async (req, res) => {
  try {
    const tx = await Transaction.find().sort({ date: -1 });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const newTx = new Transaction({
      type,
      amount,
      category,
      description,
      date: date ? new Date(date) : undefined
    });
    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Deleted', id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUMMARY: totalIncome, totalExpense, balance
app.get('/api/summary', async (req, res) => {
  try {
    const incomes = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const expenses = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = incomes[0]?.total || 0;
    const totalExpense = expenses[0]?.total || 0;
    res.json({ totalIncome, totalExpense, balance: totalIncome - totalExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
