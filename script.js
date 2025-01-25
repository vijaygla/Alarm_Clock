// Get current time and update the clock display
function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  document.getElementById('timeDisplay').textContent = time;
}

// Get current date and update the date display
function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = now.toLocaleDateString(undefined, options);
  document.getElementById('dateDisplay').textContent = date;
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Set up the clock interval
setInterval(function () {
  updateTime();
  updateDate();
  checkAlarms();
}, 1000);

// Handle dark mode button click event
document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);

// Alarm variables
let alarms = [];

// Set the alarm
function setAlarm() {
  const hour = parseInt(document.getElementById('alarmHour').value);
  const minute = parseInt(document.getElementById('alarmMinute').value);
  const second = parseInt(document.getElementById('alarmSecond').value);
  const period = document.getElementById('alarmPeriod').value;

  // Check if hour is not entered or exceeds 12
  if (isNaN(hour) || hour < 0 || hour > 12) {
    alert("Invalid hour. Please enter a value between 0 and 12.");
    return;
  }

  // Check if minute is not entered or exceeds 60
  if (isNaN(minute) || minute < 0 || minute > 59) {
    alert("Invalid minute. Please enter a value between 0 and 59.");
    return;
  }
  // Set seconds to '00' if not entered
  const actualSecond = isNaN(second) ? 0 : second;

  const alarmTime = new Date();
  alarmTime.setHours(period === 'pm' ? hour + 12 : hour);
  alarmTime.setMinutes(minute);
  alarmTime.setSeconds(actualSecond);

  // Check if the alarm time is a valid date
  if (isNaN(alarmTime.getTime())) {
    alert("Invalid time");
    return;
  }

  alarms.push(alarmTime);
  const alarmItem = document.createElement('li');
  alarmItem.classList.add('list-group-item');
  alarmItem.textContent = alarmTime.toLocaleTimeString();

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right', 'ml-2');
  deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  deleteButton.addEventListener('click', function () {
    const index = alarms.indexOf(alarmTime);
    if (index > -1) {
      alarms.splice(index, 1);
      alarmItem.remove();
    }
  });

  alarmItem.appendChild(deleteButton);
  document.getElementById('alarmsList').appendChild(alarmItem);
}

// Handle set alarm button click event
document.getElementById('setAlarmBtn').addEventListener('click', setAlarm);

let activeAlarm = null; // Store the active alarm

function playAlarmSound() {
  if (activeAlarm) {
    return; // Only one active alarm at a time
  }

  const audio = new Audio('music.mp3');
  audio.volume = 0; // Start with muted volume
  audio.play();

  const startTime = Date.now(); // Get the start time of the alarm

  // Gradually increase the volume over time
  const fadeInInterval = setInterval(function () {
    const elapsedTime = Date.now() - startTime;
    const elapsedSeconds = elapsedTime / 1000;

    // Increase the volume linearly over 30 seconds
    if (elapsedSeconds <= 30) {
      audio.volume = elapsedSeconds / 30;
    } else {
      audio.volume = 1; // Set maximum volume after 30 seconds
    }

    // Stop increasing the volume after 4 minutes (240 seconds)
    if (elapsedSeconds >= 240) {
      clearInterval(fadeInInterval);
    }
  }, 1000);

  // Display the popup notification
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerHTML = '<h3>Alarm!</h3><button id="stopAlarmBtn" class="btn btn-danger">Stop Alarm</button>';

  // Stop the alarm sound when the user clicks the "Stop Alarm" button
  notification.querySelector('#stopAlarmBtn').addEventListener('click', function () {
    audio.pause();
    audio.currentTime = 0;
    clearInterval(fadeInInterval);
    notification.remove();

    // Remove the alarm from the list
    const index = alarms.indexOf(activeAlarm);
    if (index > -1) {
      alarms.splice(index, 1);
      document.getElementById('alarmsList').children[index].remove();
    }

    activeAlarm = null; // Reset active alarm
  });

  document.body.appendChild(notification);
  activeAlarm = alarms[alarms.length - 1]; // Set the current alarm as active
}

// Check alarms every second
// Check alarms every second
setInterval(function () {
  const now = new Date();

  // Check if any alarm time matches the current time and is in the future
  alarms.forEach(function (alarmTime) {
    if (now.getTime() >= alarmTime.getTime() && now.getTime() <= alarmTime.getTime() + 4000) {
      playAlarmSound();
    }
  });
}, 1000);

