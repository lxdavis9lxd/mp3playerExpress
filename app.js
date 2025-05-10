const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const config = require('./config/config');
require('dotenv').config();

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(config.db.uri, config.db.options)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

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
