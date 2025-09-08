// Golf course and club data
const golfData = {
  golfCourse: {
    name: "Hylliekrokens Golfcenter",
    holes: [
      {number: 1, par: 3, length: 125},
      {number: 2, par: 3, length: 128},
      {number: 3, par: 3, length: 101},
      {number: 4, par: 3, length: 154},
      {number: 5, par: 3, length: 105},
      {number: 6, par: 3, length: 128},
      {number: 7, par: 3, length: 110},
      {number: 8, par: 3, length: 77},
      {number: 9, par: 3, length: 118},
      {number: 10, par: 3, length: 125},
      {number: 11, par: 3, length: 128},
      {number: 12, par: 3, length: 101},
      {number: 13, par: 3, length: 154},
      {number: 14, par: 3, length: 105},
      {number: 15, par: 3, length: 128},
      {number: 16, par: 3, length: 110},
      {number: 17, par: 3, length: 77},
      {number: 18, par: 3, length: 118}
    ]
  },
  clubs: [
    {name: "Driver", distance: 210},
    {name: "3-wood", distance: 192},
    {name: "2-iron", distance: 173},
    {name: "3-iron", distance: 164},
    {name: "4-iron", distance: 155},
    {name: "5-iron", distance: 146},
    {name: "6-iron", distance: 137},
    {name: "7-iron", distance: 128},
    {name: "8-iron", distance: 118},
    {name: "9-iron", distance: 109},
    {name: "Pitching wedge", distance: 100},
    {name: "Sand wedge", distance: 82},
    {name: "Lob wedge", distance: 59}
  ],
  windUrl: "https://zoom.earth/maps/wind-speed/#view=55.59,12.94,5z/place=55.59324,12.943357/model=icon"
};

// DOM elements
let golfCourseSelect;
let holeSelect;
let selectedCourse;
let selectedHole;
let clubSuggestions;
let windButton;
let imageButton;
let windModal;
let imageModal;
let windIframe;
let holeImage;
let imageError;
let imageModalTitle;
let expectedFileName;
let currentHoleNumber = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing application...');
  initializeApp();
});

function initializeApp() {
  // Get DOM elements
  golfCourseSelect = document.getElementById('golfCourseSelect');
  holeSelect = document.getElementById('holeSelect');
  selectedCourse = document.getElementById('selectedCourse');
  selectedHole = document.getElementById('selectedHole');
  clubSuggestions = document.getElementById('clubSuggestions');
  windButton = document.getElementById('windButton');
  imageButton = document.getElementById('imageButton');
  windModal = document.getElementById('windModal');
  imageModal = document.getElementById('imageModal');
  windIframe = document.getElementById('windIframe');
  holeImage = document.getElementById('holeImage');
  imageError = document.getElementById('imageError');
  imageModalTitle = document.getElementById('imageModalTitle');
  expectedFileName = document.getElementById('expectedFileName');

  // Verify elements exist
  if (!golfCourseSelect || !holeSelect || !selectedCourse || !selectedHole || !clubSuggestions) {
    console.error('Required DOM elements not found');
    return;
  }

  console.log('All DOM elements found, setting up event listeners...');

  setupEventListeners();
}

function setupEventListeners() {
  // Golf course selection handler
  golfCourseSelect.addEventListener('change', function() {
    const selectedValue = this.value;

    if (selectedValue === 'hylliekrokens') {
      handleCourseSelection();
    } else {
      resetCourseSelection();
    }
  });

  // Hole selection handler
  holeSelect.addEventListener('change', function() {
    const selectedValue = this.value;

    if (selectedValue) {
      handleHoleSelection(parseInt(selectedValue));
    } else {
      resetHoleSelection();
    }
  });

  // Wind button handler
  windButton.addEventListener('click', function() {
    openWindModal();
  });

  // Image button handler
  imageButton.addEventListener('click', function() {
    if (currentHoleNumber) {
      openImageModal(currentHoleNumber);
    }
  });

  // Modal close handlers
  windModal.addEventListener('click', function(e) {
    if (e.target === windModal) {
      closeWindModal();
    }
  });

  imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
      closeImageModal();
    }
  });

  // Keyboard handlers for modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (!windModal.classList.contains('hidden')) {
        closeWindModal();
      }
      if (!imageModal.classList.contains('hidden')) {
        closeImageModal();
      }
    }
  });

  console.log('Event listeners set up successfully');
}

function handleCourseSelection() {
  console.log('Course selected: Hylliekrokens Golfcenter');

  // Update selected course display
  selectedCourse.textContent = 'Selected Course: ' + golfData.golfCourse.name;
  selectedCourse.classList.remove('hidden');

  // Populate hole dropdown
  populateHoleDropdown();

  // Enable hole selection
  holeSelect.disabled = false;

  console.log('Hole dropdown populated and enabled');
}

function resetCourseSelection() {
  console.log('Course selection reset');

  // Hide selected course display
  selectedCourse.classList.add('hidden');

  // Clear and disable hole dropdown
  holeSelect.innerHTML = '<option value="" selected>Hole number</option>';
  holeSelect.disabled = true;

  // Reset hole selection
  resetHoleSelection();
}

function populateHoleDropdown() {
  // Clear existing options
  holeSelect.innerHTML = '<option value="" selected>Hole number</option>';

  // Add hole options
  golfData.golfCourse.holes.forEach(hole => {
    const option = document.createElement('option');
    option.value = hole.number;
    option.textContent = `Hole ${hole.number} - PAR ${hole.par} - ${hole.length}m`;
    holeSelect.appendChild(option);
  });

  console.log('Hole dropdown populated with', golfData.golfCourse.holes.length, 'holes');
}

function handleHoleSelection(holeNumber) {
  console.log('Hole selected:', holeNumber);

  currentHoleNumber = holeNumber;

  // Find hole data
  const hole = golfData.golfCourse.holes.find(h => h.number === holeNumber);
  if (!hole) {
    console.error('Hole not found:', holeNumber);
    return;
  }

  // Update selected hole display
  selectedHole.textContent = `Selected Hole: Hole ${hole.number} - PAR ${hole.par} - ${hole.length}m`;
  selectedHole.classList.remove('hidden');

  // Calculate and display club suggestions
  calculateClubSuggestions(hole.length);

  // Enable image button
  imageButton.disabled = false;

  console.log('Hole selection completed for hole', holeNumber);
}

function resetHoleSelection() {
  console.log('Hole selection reset');

  currentHoleNumber = null;

  // Hide selected hole display
  selectedHole.classList.add('hidden');

  // Reset club suggestions
  clubSuggestions.innerHTML = '<p class="placeholder-text">Select a hole to see club suggestions</p>';

  // Disable image button
  imageButton.disabled = true;
}

function calculateClubSuggestions(holeLength) {
  console.log('Calculating club suggestions for hole length:', holeLength + 'm');

  // Find suitable clubs (within 25m of hole length)
  const suitableClubs = golfData.clubs.filter(club => {
    const distanceDiff = Math.abs(club.distance - holeLength);
    return distanceDiff <= 25;
  });

  // Sort by distance (closest to hole length first)
  suitableClubs.sort((a, b) => {
    const diffA = Math.abs(a.distance - holeLength);
    const diffB = Math.abs(b.distance - holeLength);
    return diffA - diffB;
  });

  console.log('Found', suitableClubs.length, 'suitable clubs');

  // Display suggestions
  if (suitableClubs.length > 0) {
    const suggestionsHtml = suitableClubs.map(club => 
      `<div class="club-item">${club.name} - ${club.distance}m</div>`
    ).join('');
    clubSuggestions.innerHTML = suggestionsHtml;
  } else {
    clubSuggestions.innerHTML = '<p class="placeholder-text">No suitable clubs found for this distance</p>';
  }
}

// Modal functions
function openWindModal() {
  console.log('Opening wind modal');
  windIframe.src = golfData.windUrl;
  windModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeWindModal() {
  console.log('Closing wind modal');
  windModal.classList.add('hidden');
  windIframe.src = ''; // Clear iframe to stop loading
  document.body.style.overflow = ''; // Restore scrolling
}

function openImageModal(holeNumber) {
  console.log('Opening image modal for hole', holeNumber);

  // Update modal title
  imageModalTitle.textContent = `Hole ${holeNumber} Image`;

  // Set expected filename
  const fileName = `Hole ${holeNumber}.png`;
  expectedFileName.textContent = fileName;

  // Try to load the image
  const imagePath = `./images/${fileName}`;
  holeImage.src = imagePath;

  // Handle image load success/failure
  holeImage.onload = function() {
    console.log('Image loaded successfully:', imagePath);
    holeImage.classList.remove('hidden');
    imageError.classList.add('hidden');
  };

  holeImage.onerror = function() {
    console.log('Image failed to load:', imagePath);
    holeImage.classList.add('hidden');
    imageError.classList.remove('hidden');
  };

  // Show modal
  imageModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeImageModal() {
  console.log('Closing image modal');
  imageModal.classList.add('hidden');
  holeImage.src = ''; // Clear image source
  holeImage.classList.add('hidden');
  imageError.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scrolling
}

// Global functions for modal close buttons
window.closeWindModal = closeWindModal;
window.closeImageModal = closeImageModal;

console.log('Golf Caddie app initialized successfully');