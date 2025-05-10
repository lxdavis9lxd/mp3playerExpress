const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mp3player', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// MP3 Schema
const mp3Schema = new mongoose.Schema({
  title: String,
  location: String,
});

const MP3 = mongoose.model('MP3', mp3Schema);

// Routes
app.get('/', async (req, res) => {
  try {
    const mp3Files = await MP3.find();
    res.render('index', { mp3Files });
  } catch (err) {
    res.status(500).send('Error fetching MP3 files');
  }
});

app.get('/api/mp3', async (req, res) => {
  try {
    const mp3Files = await MP3.find();
    res.json(mp3Files);
  } catch (err) {
    res.status(500).send('Error fetching MP3 files');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
