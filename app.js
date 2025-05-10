const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const config = require('./config/config');

// Initialize Express app
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    // First try to connect to MongoDB Atlas
    await mongoose.connect(config.db.uri, config.db.options);
    console.log('MongoDB Atlas Connected');
    return true;
  } catch (err) {
    console.log('MongoDB Atlas connection failed:', err.message);
    console.log('Attempting to connect to local MongoDB...');
    
    try {
      // Fallback to local MongoDB
      await mongoose.connect('mongodb://localhost:27017/mp3player');
      console.log('Connected to local MongoDB');
      return true;
    } catch (localErr) {
      console.log('Local MongoDB connection failed:', localErr.message);
      console.log('WARNING: Application running without database connection. Features requiring database will not work.');
      return false;
    }
  }
};

// Try to connect to database but continue even if it fails
connectDB().then(connected => {
  if (!connected) {
    console.log('⚠️ Running in limited mode without database connection');
  }
});

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Routes
app.use('/', require('./routes/index'));
app.use('/api/tracks', require('./routes/api/tracks'));

// Start server
const PORT = config.server.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
