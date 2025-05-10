const Track = require('../models/Track');

// Get all tracks
exports.getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find().sort({ uploadDate: -1 });
    return tracks;
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching tracks');
  }
};

// Get a single track by ID
exports.getTrackById = async (id) => {
  try {
    const track = await Track.findById(id);
    return track;
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching track');
  }
};

// Search tracks by term
exports.searchTracks = async (searchTerm) => {
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
    throw new Error('Error searching tracks');
  }
};
