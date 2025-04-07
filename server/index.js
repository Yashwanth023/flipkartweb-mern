
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'FlipKart Clone API is running' });
});

// API routes would be defined here
// app.use('/api/products', require('./routes/products'));
// app.use('/api/users', require('./routes/users'));
// etc.

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
