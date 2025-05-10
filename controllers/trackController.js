const Track = require('../models/Track');
const mongoose = require('mongoose');

// Check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Get all tracks
exports.getAllTracks = async () => {
  // If database is not connected, return empty array
  if (!isDbConnected()) {
    console.log('Database not connected, returning empty tracks array');
    return [];
  }

  try {
    const tracks = await Track.find().sort({ uploadDate: -1 });
    return tracks;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Get a single track by ID
exports.getTrackById = async (id) => {
  // If database is not connected, return null
  if (!isDbConnected()) {
    console.log('Database not connected, cannot fetch track by ID');
    return null;
  }

  try {
    const track = await Track.findById(id);
    return track;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Search tracks by term
exports.searchTracks = async (searchTerm) => {
  // If database is not connected, return empty array
  if (!isDbConnected()) {
    console.log('Database not connected, cannot search tracks');
    return [];
  }

  try {
    const tracks = await Track.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { artist: { $regex: searchTerm, $options: 'i' } },
        { album: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ uploadDate: -1 });
    
    return tracks;
  } catch (err) {
    console.error(err);
    return [];
  }
};
