const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Track = require('../../models/Track');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filter for mp3 files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
    cb(null, true);
  } else {
    cb(new Error('Only MP3 files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20 // 20MB limit
  }
});

// GET all tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find().sort({ uploadDate: -1 });
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET single track
router.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST new track
router.post('/', upload.single('mp3File'), async (req, res) => {
  try {
    let filePath = '';
    
    if (req.file) {
      // If file was uploaded
      filePath = `/uploads/${req.file.filename}`;
    } else if (req.body.filePath) {
      // If file path was provided directly
      filePath = req.body.filePath;
    } else {
      return res.status(400).json({ error: 'No file or file path provided' });
    }
    
    const newTrack = new Track({
      title: req.body.title,
      artist: req.body.artist || 'Unknown Artist',
      album: req.body.album || 'Unknown Album',
      filePath: filePath
    });
    
    const track = await newTrack.save();
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// UPDATE track
router.put('/:id', async (req, res) => {
  try {
    const { title, artist, album } = req.body;
    
    // Build track object
    const trackFields = {};
    if (title) trackFields.title = title;
    if (artist) trackFields.artist = artist;
    if (album) trackFields.album = album;
    
    let track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    track = await Track.findByIdAndUpdate(
      req.params.id,
      { $set: trackFields },
      { new: true }
    );
    
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE track
router.delete('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    // Delete the file if it's stored locally
    if (track.filePath.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../public', track.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Track.findByIdAndRemove(req.params.id);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
