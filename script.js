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

// Add event listener to the form submission
checkInBtn.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Check if maximum attendees limit is reached
  if (counter === maxAttendees) {
    greetingMessage.textContent =
      '🎉 Everybody has checked in! Please wait for the event to start.';
    greetingMessage.style.backgroundColor = '#c4ffd1'; // Change background color to green
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
  teams[team].element.textContent = Number(teams[team].element.textContent) + 1;

  // Display greeting message
  greetingMessage.textContent = `🎉 Welcome, ${name} from team ${teams[team].name}!`;
  console.log('Added greeting message:', greetingMessage.textContent);

  // Clean up any previous animation state
  greetingMessage.classList.remove('show'); // Remove enter animation class
  greetingMessage.style.display = 'block'; // Make visible
  void greetingMessage.offsetWidth; // Force reflow to restart animation
  greetingMessage.classList.add('show'); // Trigger slide-down animation

  // Shift form down while greeting is visible
  form.classList.add('shifted');

  // Reset form fields
  form.reset();
});
