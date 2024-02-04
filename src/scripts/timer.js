let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let displayCallback = null;
let localStorageKey = "timerElapsed";

function startTimer(callback) {
  const storedElapsedTime = localStorage.getItem(localStorageKey);
  if (storedElapsedTime) {
    elapsedTime = parseInt(storedElapsedTime, 10);
  }
  startTime = Date.now() - elapsedTime;
  displayCallback = callback;
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  displayCallback(elapsedTime);
}

function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  localStorage.removeItem(localStorageKey);
}

export { startTimer, resetTimer };
