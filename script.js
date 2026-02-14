// Get all needed HTML elements
const form = document.getElementById('checkInForm');
const attendeeName = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const attendeeCounter = document.getElementById('attendeeCount');
const maxAttendees = 50; // Set maximum number of attendees
let counter = 0; // Initialize counter
const teams = {
  water: {
    element: document.getElementById('waterCount'),
    card: document.getElementById('waterCard'),
    list: document.getElementById('waterList'),
    name: 'Water Wise',
    attendees: [],
  },
  zero: {
    element: document.getElementById('zeroCount'),
    card: document.getElementById('zeroCard'),
    list: document.getElementById('zeroList'),
    name: 'Net Zero',
    attendees: [],
  },
  power: {
    element: document.getElementById('powerCount'),
    card: document.getElementById('powerCard'),
    list: document.getElementById('powerList'),
    name: 'Renewables',
    attendees: [],
  },
};
const checkInBtn = document.getElementById('checkInBtn');
const greetingMessage = document.getElementById('greeting');
const progressBar = document.getElementById('progressBar');
const resetBtn = document.getElementById('resetBtn');

// Function to save data to localStorage
function saveData() {
  const data = {
    counter: counter,
    water: Number(teams.water.element.textContent),
    zero: Number(teams.zero.element.textContent),
    power: Number(teams.power.element.textContent),
    waterAttendees: teams.water.attendees,
    zeroAttendees: teams.zero.attendees,
    powerAttendees: teams.power.attendees,
  };
  localStorage.setItem('attendanceData', JSON.stringify(data));
}

// Function to load data from localStorage
function loadData() {
  const savedData = localStorage.getItem('attendanceData');
  if (savedData) {
    const data = JSON.parse(savedData);
    counter = data.counter;
    attendeeCounter.textContent = counter;
    teams.water.element.textContent = data.water;
    teams.zero.element.textContent = data.zero;
    teams.power.element.textContent = data.power;
    teams.water.attendees = data.waterAttendees || [];
    teams.zero.attendees = data.zeroAttendees || [];
    teams.power.attendees = data.powerAttendees || [];

    // Update progress bar based on loaded counter
    const progressPercentage = (counter / maxAttendees) * 100;
    progressBar.style.width = progressPercentage + '%';
    if (progressPercentage === 100) {
      progressBar.classList.add('full');
    }

    // Render attendee lists
    renderAttendeeList('water');
    renderAttendeeList('zero');
    renderAttendeeList('power');
  }
}

// Load data when page loads
loadData();

// Function to render attendee list for a team
function renderAttendeeList(teamKey) {
  const team = teams[teamKey];
  team.list.innerHTML = '';

  if (team.attendees.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'attendee-empty';
    emptyMessage.textContent = 'No attendees yet';
    team.list.appendChild(emptyMessage);
    return;
  }

  team.attendees.forEach(function (attendeeName) {
    const attendeeItem = document.createElement('div');
    attendeeItem.className = 'attendee-item';
    attendeeItem.textContent = attendeeName;
    team.list.appendChild(attendeeItem);
  });
}

// Add click event listeners to team cards to toggle attendee list
Object.keys(teams).forEach(function (teamKey) {
  teams[teamKey].card.addEventListener('click', function (e) {
    // Stop click from propagating to document
    e.stopPropagation();

    // Close all other team cards
    Object.keys(teams).forEach(function (otherTeamKey) {
      if (otherTeamKey !== teamKey) {
        teams[otherTeamKey].card.classList.remove('expanded');
      }
    });

    // Toggle the current card
    teams[teamKey].card.classList.toggle('expanded');
  });
});

// Close expanded card when clicking anywhere else on the document
document.addEventListener('click', function () {
  Object.keys(teams).forEach(function (teamKey) {
    teams[teamKey].card.classList.remove('expanded');
  });
});

// Function to reset all data
function resetAllData() {
  const confirmed = confirm(
    'Are you sure you want to reset all attendance data? This cannot be undone.',
  );
  if (confirmed) {
    counter = 0;
    attendeeCounter.textContent = '0';
    teams.water.element.textContent = '0';
    teams.zero.element.textContent = '0';
    teams.power.element.textContent = '0';
    teams.water.attendees = [];
    teams.zero.attendees = [];
    teams.power.attendees = [];
    progressBar.style.width = '0%';
    progressBar.classList.remove('full');
    greetingMessage.style.display = 'none';
    greetingMessage.style.backgroundColor = 'rgb(215, 243, 255)';

    // Clear all team card expansions and attendee lists
    teams.water.card.classList.remove('expanded');
    teams.zero.card.classList.remove('expanded');
    teams.power.card.classList.remove('expanded');
    renderAttendeeList('water');
    renderAttendeeList('zero');
    renderAttendeeList('power');

    localStorage.clear();
  }
}

// Add click event listener to reset button
resetBtn.addEventListener('click', function () {
  resetAllData();
});

// Add event listener to the form submission
checkInBtn.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Get values from form fields
  const name = attendeeName.value;
  const team = teamSelect.value;

  // Validate form fields
  if (!name || !team) {
    alert('Please fill in all fields.');
    return;
  }

  // Check if maximum attendees limit is already reached
  if (counter === maxAttendees) {
    alert('Maximum number of attendees reached. Please try again later.');
    return;
  }

  // Update attendee counter
  counter++;
  attendeeCounter.textContent = counter;

  // Update progress bar width based on percentage of max attendees
  const progressPercentage = (counter / maxAttendees) * 100;
  progressBar.style.width = progressPercentage + '%';

  // Turn progress bar green when full
  if (progressPercentage === 100) {
    progressBar.classList.add('full');
  }

  // Update team counters
  teams[team].element.textContent = Number(teams[team].element.textContent) + 1;

  // Add attendee name to team's attendee list
  teams[team].attendees.push(name);

  // Render the updated attendee list
  renderAttendeeList(team);

  // Save data to localStorage
  saveData();

  // Check if this was the last attendee
  if (counter === maxAttendees) {
    // Display greeting message for the last person
    greetingMessage.textContent = `🎉 Welcome, ${name} from team ${teams[team].name}!`;

    // Clean up any previous animation state
    greetingMessage.classList.remove('show'); // Remove enter animation class
    greetingMessage.style.display = 'block'; // Make visible
    void greetingMessage.offsetWidth; // Force reflow to restart animation
    greetingMessage.classList.add('show'); // Trigger slide-down animation

    // Shift form down while greeting is visible
    form.classList.add('shifted');

    // Wait 2 seconds then show the winner announcement
    setTimeout(function () {
      // Determine the winning team(s)
      let maxCount = -1;

      // First pass: find the maximum count
      for (const teamKey in teams) {
        const teamCount = Number(teams[teamKey].element.textContent);
        if (teamCount > maxCount) {
          maxCount = teamCount;
        }
      }

      // Second pass: find all teams with the maximum count
      const winningTeams = [];
      for (const teamKey in teams) {
        const teamCount = Number(teams[teamKey].element.textContent);
        if (teamCount === maxCount) {
          winningTeams.push(teams[teamKey].name);
        }
      }

      // Display winner or tie message
      let messageText;
      if (winningTeams.length > 1) {
        messageText = `🏆 It's a tie! ${winningTeams.join(' and ')} are tied with ${maxCount} attendees each!`;
      } else {
        messageText = `🏆 Congratulations! Team ${winningTeams[0]} wins with ${maxCount} attendees!`;
      }

      greetingMessage.textContent = messageText;
      greetingMessage.style.backgroundColor = '#c4ffd1'; // Keep green background

      // Restart animation for winner message
      greetingMessage.classList.remove('show'); // Remove enter animation class
      void greetingMessage.offsetWidth; // Force reflow to restart animation
      greetingMessage.classList.add('show'); // Trigger slide-down animation
    }, 2000);
  } else {
    // Display greeting message for regular attendees
    greetingMessage.textContent = `🎉 Welcome, ${name} from team ${teams[team].name}!`;
    console.log('Added greeting message:', greetingMessage.textContent);

    // Clean up any previous animation state
    greetingMessage.classList.remove('show'); // Remove enter animation class
    greetingMessage.style.display = 'block'; // Make visible
    void greetingMessage.offsetWidth; // Force reflow to restart animation
    greetingMessage.classList.add('show'); // Trigger slide-down animation

    // Shift form down while greeting is visible
    form.classList.add('shifted');
  }

  // Reset form fields
  form.reset();
});
