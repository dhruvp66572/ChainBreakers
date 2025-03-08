const express = require('express');
const transactionRoutes = require('./routes/transactionRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Configure CORS to allow requests from the frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Specify the allowed frontend origin
  methods: ['GET'], // Specify allowed methods
  credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions));
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});