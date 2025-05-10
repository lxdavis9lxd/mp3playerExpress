const path = require('path');

module.exports = {
  // MongoDB configuration
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mp3player',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 3000
  },
  
  // File upload configuration
  upload: {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
    directory: path.join(__dirname, '../public/uploads')
  }
};
