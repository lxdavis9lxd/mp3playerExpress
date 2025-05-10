const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

// Home page
router.get('/', async (req, res) => {
  try {
    let tracks = [];
    try {
      tracks = await trackController.getAllTracks();
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Gracefully handle DB errors by showing empty tracks list
    }
    
    res.render('index', { 
      tracks,
      currentTrack: null,
      dbError: tracks ? null : 'Database connection error'
    });
  } catch (err) {
    console.error('Server error:', err);
    res.render('index', { 
      tracks: [],
      currentTrack: null,
      error: 'An unexpected error occurred'
    });
  }
});

// Search tracks
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.term;
    let tracks = [];
    
    try {
      tracks = await trackController.searchTracks(searchTerm);
    } catch (dbError) {
      console.error('Database error during search:', dbError);
      // Gracefully handle DB errors by showing empty tracks list
    }
    
    res.render('index', { 
      tracks,
      currentTrack: null,
      searchTerm,
      dbError: tracks ? null : 'Database connection error during search'
    });
  } catch (err) {
    console.error('Server error during search:', err);
    res.render('index', { 
      tracks: [],
      currentTrack: null,
      error: 'An unexpected error occurred during search'
    });
  }
});

// Play track page
router.get('/play/:id', async (req, res) => {
  try {
    let tracks = [];
    let currentTrack = null;
    
    try {
      tracks = await trackController.getAllTracks();
      currentTrack = await trackController.getTrackById(req.params.id);
    } catch (dbError) {
      console.error('Database error while playing track:', dbError);
      // Gracefully handle DB errors
    }
    
    if (!currentTrack) {
      return res.redirect('/?error=Track+not+found+or+database+error');
    }
    
    res.render('index', { 
      tracks,
      currentTrack
    });
  } catch (err) {
    console.error('Server error while playing track:', err);
    res.render('index', { 
      tracks: [],
      currentTrack: null,
      error: 'An unexpected error occurred while playing the track'
    });
  }
});

// Add track form
router.get('/add', (req, res) => {
  res.render('add');
});

module.exports = router;
