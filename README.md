# MP3 Player Application

A Node.js Express application for managing and playing MP3 files. The application allows you to upload MP3 files, add tracks via URLs, search for tracks, and play them directly in the browser.

## Features

- Upload and manage MP3 files
- Add tracks by providing a URL or local path
- Play tracks directly in the browser
- Search for tracks by title, artist, or album
- RESTful API for CRUD operations
- Responsive design for desktop and mobile

## Technologies Used

- Node.js & Express.js
- MongoDB with Mongoose
- EJS Templates
- Bootstrap 5
- Font Awesome
- JavaScript (ES6+)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mp3player.git
   cd mp3player
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mp3player
   ```

4. Start the application:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/:id` - Get a specific track
- `POST /api/tracks` - Add a new track
- `PUT /api/tracks/:id` - Update a track
- `DELETE /api/tracks/:id` - Delete a track

## Usage

### Adding Tracks

1. Click on "Add Track" in the navigation bar
2. Enter the track title, artist, and album (artist and album are optional)
3. Choose to either upload an MP3 file or provide a URL/path to an MP3 file
4. Click "Add Track"

### Playing Tracks

1. Click on a track in the list to go to its play page
2. Use the audio player controls to play, pause, and adjust volume
3. Alternatively, click the "Play" button directly in the track list

### Searching Tracks

Use the search box in the navigation bar to search for tracks by title, artist, or album.

## License

MIT
