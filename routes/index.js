const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

// Home page
router.get('/', async (req, res) => {
  try {
    const tracks = await trackController.getAllTracks();
    res.render('index', { 
      tracks,
      currentTrack: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Search tracks
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const tracks = await trackController.searchTracks(searchTerm);
    
    res.render('index', { 
      tracks,
      currentTrack: null,
      searchTerm
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Play track page
router.get('/play/:id', async (req, res) => {
  try {
    const tracks = await trackController.getAllTracks();
    const currentTrack = await trackController.getTrackById(req.params.id);
    
    if (!currentTrack) {
      return res.status(404).redirect('/');
    }
    
    res.render('index', { 
      tracks,
      currentTrack
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add track form
router.get('/add', (req, res) => {
  res.render('add');
});

module.exports = router;
