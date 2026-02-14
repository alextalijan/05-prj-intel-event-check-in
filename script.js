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
let greetingTimeoutId = null; // Track the hide timer

// Add event listener to the form submission
checkInBtn.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Check if maximum attendees limit is reached
  if (counter === maxAttendees) {
    alert('Maximum number of attendees reached. Please try again later.');
    greetingMessage.textContent =
      '🎉 Everybody has checked in! Please wait for the event to start.';
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

  // Clean up any previous animation state
  greetingMessage.classList.remove('show'); // Remove enter animation class
  greetingMessage.classList.remove('hide'); // Remove exit animation class
  greetingMessage.style.display = 'block'; // Make visible
  void greetingMessage.offsetWidth; // Force reflow to restart animation
  greetingMessage.classList.add('show'); // Trigger slide-down animation

  // Shift form down while greeting is visible
  form.classList.add('shifted');

  // Cancel any previous hide timer
  if (greetingTimeoutId) {
    clearTimeout(greetingTimeoutId);
  }

  // Hide and slide-up after 2 seconds
  greetingTimeoutId = setTimeout(function () {
    greetingMessage.classList.remove('show'); // Stop enter animation
    greetingMessage.classList.add('hide'); // Start slide-up animation
    form.classList.remove('shifted'); // Slide form back up at same time

    // Hide greeting after animation completes
    setTimeout(function () {
      greetingMessage.style.display = 'none';
      greetingMessage.classList.remove('hide');
    }, 300); // Match the 300ms slide-up animation
  }, 2000); // Wait 2 seconds before sliding up

  // Reset form fields
  form.reset();
});
