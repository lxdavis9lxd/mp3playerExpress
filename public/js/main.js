document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  const editTrackModal = document.getElementById('editTrackModal');
  const editTrackForm = document.getElementById('edit-track-form');
  const addTrackForm = document.getElementById('add-track-form');
  const uploadOption = document.getElementById('uploadOption');
  const pathOption = document.getElementById('pathOption');
  const uploadSection = document.getElementById('uploadSection');
  const pathSection = document.getElementById('pathSection');
  const shuffleBtn = document.getElementById('shuffle-btn');
  
  // Handle track source toggle in add form
  if (uploadOption && pathOption) {
    uploadOption.addEventListener('change', () => {
      uploadSection.classList.remove('d-none');
      pathSection.classList.add('d-none');
    });
    
    pathOption.addEventListener('change', () => {
      pathSection.classList.remove('d-none');
      uploadSection.classList.add('d-none');
    });
  }
  
  // Edit track modal setup
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const trackId = button.getAttribute('data-id');
      const title = button.getAttribute('data-title');
      const artist = button.getAttribute('data-artist');
      const album = button.getAttribute('data-album');
      
      // Set values in the edit form
      document.getElementById('edit-track-id').value = trackId;
      document.getElementById('edit-title').value = title;
      document.getElementById('edit-artist').value = artist;
      document.getElementById('edit-album').value = album;
      
      // Show the modal
      const modal = new bootstrap.Modal(editTrackModal);
      modal.show();
    });
  });
  
  // Handle edit form submission
  if (editTrackForm) {
    editTrackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const trackId = document.getElementById('edit-track-id').value;
      const title = document.getElementById('edit-title').value;
      const artist = document.getElementById('edit-artist').value;
      const album = document.getElementById('edit-album').value;
      
      try {
        const response = await fetch(`/api/tracks/${trackId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, artist, album })
        });
        
        if (response.ok) {
          window.location.reload();
        } else {
          const data = await response.json();
          alert(`Error updating track: ${data.error}`);
        }
      } catch (err) {
        console.error('Error updating track:', err);
        alert('An error occurred while updating the track');
      }
    });
  }
  
  // Handle delete buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (confirm('Are you sure you want to delete this track?')) {
        const trackId = button.getAttribute('data-id');
        
        try {
          const response = await fetch(`/api/tracks/${trackId}`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            window.location.reload();
          } else {
            const data = await response.json();
            alert(`Error deleting track: ${data.error}`);
          }
        } catch (err) {
          console.error('Error deleting track:', err);
          alert('An error occurred while deleting the track');
        }
      }
    });
  });
  
  // Handle add track form submission
  if (addTrackForm) {
    addTrackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(addTrackForm);
      const trackSource = formData.get('trackSource');
      
      // Remove unnecessary fields based on track source
      if (trackSource === 'upload') {
        formData.delete('filePath');
        
        // Ensure a file was selected
        if (!formData.get('mp3File').name) {
          alert('Please select an MP3 file to upload');
          return;
        }
      } else {
        formData.delete('mp3File');
        
        // Ensure a file path was provided
        if (!formData.get('filePath')) {
          alert('Please enter a file path');
          return;
        }
      }
      
      // Remove the track source field since it's not needed in the API
      formData.delete('trackSource');
      
      try {
        const response = await fetch('/api/tracks', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          window.location.href = '/';
        } else {
          const data = await response.json();
          alert(`Error adding track: ${data.error}`);
        }
      } catch (err) {
        console.error('Error adding track:', err);
        alert('An error occurred while adding the track');
      }
    });
  }
  
  // Handle play buttons
  document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const audioPlayer = document.getElementById('audio-player');
      if (audioPlayer) {
        audioPlayer.src = button.getAttribute('data-path');
        audioPlayer.play();
        
        // Add 'now-playing' class to the parent list item
        document.querySelectorAll('.list-group-item').forEach(item => {
          item.classList.remove('now-playing');
        });
        button.closest('.list-group-item').classList.add('now-playing');
      }
    });
  });
  
  // Handle shuffle play
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const playButtons = document.querySelectorAll('.play-btn');
      if (playButtons.length > 0) {
        const randomIndex = Math.floor(Math.random() * playButtons.length);
        playButtons[randomIndex].click();
      }
    });
  }
  
  // Automatically play track if we're on a play page
  const audioPlayer = document.getElementById('audio-player');
  if (audioPlayer) {
    audioPlayer.play().catch(err => {
      console.log('Auto-play prevented:', err);
    });
  }
});
