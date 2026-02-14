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
    name: 'Water Wise',
  },
  zero: {
    element: document.getElementById('zeroCount'),
    name: 'Net Zero',
  },
  power: {
    element: document.getElementById('powerCount'),
    name: 'Renewables',
  },
};
const checkInBtn = document.getElementById('checkInBtn');
const greetingMessage = document.getElementById('greeting');
const progressBar = document.getElementById('progressBar');

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
