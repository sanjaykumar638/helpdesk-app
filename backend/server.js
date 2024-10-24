require("dotenv").config();

const express = require('express');
const colors = require('colors');
const path = require('path');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Set up the port
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes for users and tickets
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Serve the Frontend in Production
if (process.env.NODE_ENV === 'production') {
  // Serve the React build directory as static files
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Handle routing in React (SPA fallback)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
} else {
  // Fallback for non-production environments
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Support Desk API' });
  });
}

// Custom error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.cyan.bold);
});
