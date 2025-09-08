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
  ]
};

// DOM elements
let golfCourseSelect;
let holeSelect;
let selectedCourse;
let selectedHole;
let clubSuggestions;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  golfCourseSelect = document.getElementById('golfCourseSelect');
  holeSelect = document.getElementById('holeSelect');
  selectedCourse = document.getElementById('selectedCourse');
  selectedHole = document.getElementById('selectedHole');
  clubSuggestions = document.getElementById('clubSuggestions');
  
  // Verify elements exist
  if (!golfCourseSelect || !holeSelect || !selectedCourse || !selectedHole || !clubSuggestions) {
    console.error('Required DOM elements not found');
    return;
  }
  
  setupEventListeners();
});

function setupEventListeners() {
  // Golf course selection handler
  golfCourseSelect.addEventListener('change', function(event) {
    const selectedValue = event.target.value;
    
    if (selectedValue === 'hylliekrokens') {
      // Show selected course
      selectedCourse.textContent = `Selected Course: ${golfData.golfCourse.name}`;
      selectedCourse.classList.remove('hidden');
      
      // Enable and populate hole dropdown
      enableHoleSelection();
      
      // Reset hole selection and club suggestions
      resetHoleSelection();
    } else {
      // Reset everything if no course selected
      resetCourseSelection();
    }
  });

  // Hole selection handler
  holeSelect.addEventListener('change', function(event) {
    const selectedHoleNumber = parseInt(event.target.value);
    
    if (selectedHoleNumber && !isNaN(selectedHoleNumber)) {
      const hole = golfData.golfCourse.holes.find(h => h.number === selectedHoleNumber);
      
      if (hole) {
        // Show selected hole
        selectedHole.textContent = `Selected Hole: Hole ${hole.number} - PAR ${hole.par} - ${hole.length}m`;
        selectedHole.classList.remove('hidden');
        
        // Calculate and display club suggestions
        displayClubSuggestions(hole.length);
      }
    } else {
      // Reset hole selection and club suggestions
      resetHoleSelection();
    }
  });
}

function enableHoleSelection() {
  // Clear existing options except the first placeholder
  holeSelect.innerHTML = '<option value="">Hole number</option>';
  
  // Add all holes to the dropdown
  golfData.golfCourse.holes.forEach(hole => {
    const option = document.createElement('option');
    option.value = hole.number.toString();
    option.textContent = `Hole ${hole.number} - PAR ${hole.par} - ${hole.length}m`;
    holeSelect.appendChild(option);
  });
  
  // Enable the dropdown
  holeSelect.disabled = false;
}

function resetCourseSelection() {
  selectedCourse.classList.add('hidden');
  selectedCourse.textContent = '';
  holeSelect.disabled = true;
  holeSelect.innerHTML = '<option value="">Hole number</option>';
  resetHoleSelection();
}

function resetHoleSelection() {
  selectedHole.classList.add('hidden');
  selectedHole.textContent = '';
  holeSelect.value = '';
  resetClubSuggestions();
}

function resetClubSuggestions() {
  clubSuggestions.innerHTML = '<p class="placeholder-text">Select a hole to see club suggestions</p>';
}

function displayClubSuggestions(holeLength) {
  // Find suitable clubs (within 25 meters of hole length)
  const suitableClubs = golfData.clubs.filter(club => {
    const distanceDifference = Math.abs(club.distance - holeLength);
    return distanceDifference <= 25;
  });
  
  // Sort clubs by distance (descending - longest first)
  suitableClubs.sort((a, b) => b.distance - a.distance);
  
  // Clear existing suggestions
  clubSuggestions.innerHTML = '';
  
  if (suitableClubs.length > 0) {
    suitableClubs.forEach((club, index) => {
      const clubItem = document.createElement('div');
      clubItem.className = 'club-item';
      // Add slight delay for animation effect
      clubItem.style.animationDelay = `${index * 0.1}s`;
      
      const clubName = document.createElement('span');
      clubName.className = 'club-name';
      clubName.textContent = club.name;
      
      const clubDistance = document.createElement('span');
      clubDistance.className = 'club-distance';
      clubDistance.textContent = `${club.distance}m`;
      
      clubItem.appendChild(clubName);
      clubItem.appendChild(clubDistance);
      clubSuggestions.appendChild(clubItem);
    });
  } else {
    // No suitable clubs found
    const noClubs = document.createElement('p');
    noClubs.className = 'placeholder-text';
    noClubs.textContent = 'No suitable clubs found for this distance';
    clubSuggestions.appendChild(noClubs);
  }
}