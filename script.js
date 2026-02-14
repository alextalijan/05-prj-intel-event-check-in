// Get all needed HTML elements
const form = document.getElementById('checkInForm');
const attendeeName = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const attendeeCounter = document.getElementById('attendeeCount');
const maxAttendees = 50; // Set maximum number of attendees
let counter = 0; // Initialize counter
const teamCounters = {
  water: document.getElementById('waterCount'),
  zero: document.getElementById('zeroCount'),
  power: document.getElementById('powerCount'),
};
const checkInBtn = document.getElementById('checkInBtn');
const greetingMessage = document.getElementById('greeting');

// Add event listener to the form submission
checkInBtn.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Check if maximum attendees limit is reached
  if (counter === maxAttendees) {
    alert('Maximum number of attendees reached. Please try again later.');
    return;
  }

  // Get values from form fields
  const name = attendeeName.value;
  const team = teamSelect.value;

  // Validate form fields
  if (!name || !team) {
    alert('Please fill in all fields.');
    return;
  }

  // Update attendee counter
  counter++;
  attendeeCounter.textContent = counter;

  // Update team counters
  teamCounters[team].textContent = Number(teamCounters[team].textContent) + 1;

  // Display greeting message
  greetingMessage.textContent = `🎉 Welcome, ${name} from team ${team}!`;
  console.log('Added greeting message:', greetingMessage.textContent);
  greetingMessage.style.display = 'block'; // Show the greeting message

  // Reset form fields
  form.reset();
});
