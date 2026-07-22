let runLength = 0;
let remaining = 0;
let isFirstStep = true;
let rolls = [];

const inputEl = document.getElementById('userInput');
const instructionEl = document.getElementById('instruction');
const runLengthEl = document.getElementById('runLengthVal');
const remainingEl = document.getElementById('remainingVal');
const inventoryEl = document.getElementById('rollInventory');
const finalMessageEl = document.getElementById('finalMessage');
const remainingBarEl = document.getElementById('remainingBar');
const errorMessageEl = document.getElementById('errorMessage');
const actionBtn = document.getElementById('actionBtn');
const undoBtn = document.getElementById('undoBtn');

function updateDisplay() {
  runLengthEl.innerText = isFirstStep ? 'Not set' : `${runLength} ft`;
  const displayRemaining = (!isFirstStep && remaining <= 0) ? Math.abs(remaining) : remaining;
  remainingEl.innerText = `${displayRemaining} ft`;

  runLengthEl.classList.remove('status-good', 'status-warning');
  remainingEl.classList.remove('status-good', 'status-warning');
  remainingBarEl.classList.remove('progress-green', 'progress-amber', 'progress-red');

  if (!isFirstStep) {
    runLengthEl.classList.add('status-good');

    if (remaining <= 0) {
      remainingEl.classList.add('status-warning');
      remainingBarEl.classList.add('progress-red');
    } else if (remaining < 8000) {
      remainingEl.classList.add('status-warning');
      remainingBarEl.classList.add('progress-amber');
    } else {
      remainingEl.classList.add('status-good');
      remainingBarEl.classList.add('progress-green');
    }
  }

  if (runLength > 0) {
    let percent = Math.round((remaining / runLength) * 100);
    percent = Math.max(0, Math.min(100, percent));
    remainingBarEl.value = percent;
  } else {
    remainingBarEl.value = 0;
  }

  const atOrUnderZero = (remaining <= 0 && !isFirstStep);
  if (atOrUnderZero) {
    const buttRoll = Math.abs(remaining);
    const smallRoll = buttRoll < 8000;
    finalMessageEl.style.display = 'block';
    finalMessageEl.className = `finish-message ${smallRoll ? 'warning' : 'success'}`;
    finalMessageEl.textContent = smallRoll
      ? `⚠️ Final butt roll: ${buttRoll} ft. Consider splitting another roll for storage.`
      : `✓ Final butt roll: ${buttRoll} ft. Good to return to the roll room.`;
    instructionEl.textContent = 'Run complete. Press Restart to begin a new session.';
    inputEl.disabled = true;
    actionBtn.disabled = true;
  }

  undoBtn.disabled = rolls.length === 0;
}

function updateInventory() {
  inventoryEl.innerHTML = '';
  rolls.forEach((roll, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>Roll ${index + 1}</span><span>${roll} ft</span>`;
    inventoryEl.appendChild(li);
  });
}

function setError(message) {
  errorMessageEl.textContent = message || '';
}

function undoLastRoll() {
  if (rolls.length === 0) {
    setError('No roll to undo.');
    return;
  }

  const lastRoll = rolls.pop();
  remaining += lastRoll;
  setError('');
  updateInventory();
  resetFinalMessage();
  inputEl.disabled = false;
  actionBtn.disabled = false;
  actionBtn.innerText = 'Add Roll';
  instructionEl.textContent = 'Enter each roll footage to subtract from total.';
  updateDisplay();
  inputEl.focus();
}

function resetFinalMessage() {
  finalMessageEl.style.display = 'none';
  finalMessageEl.className = 'finish-message';
  finalMessageEl.textContent = '';
  setError('');
}

function resetCalculator() {
  runLength = 0;
  remaining = 0;
  isFirstStep = true;
  rolls = [];

  inputEl.disabled = false;
  actionBtn.disabled = false;
  undoBtn.disabled = true;
  actionBtn.innerText = 'Set/Apply';
  instructionEl.textContent = 'Enter Total Run Length (Feet)';
  runLengthEl.innerText = 'Not set';
  remainingEl.innerText = '0 ft';

  updateInventory();
  resetFinalMessage();
  updateDisplay();
  inputEl.value = '';
  inputEl.focus();
}

function handleInput() {
  let val = parseFloat(inputEl.value);
  if (isNaN(val) || val <= 0) {
    setError('Please enter a positive number.');
    return;
  }

  if (isFirstStep) {
    runLength = val;
    remaining = val;
    isFirstStep = false;
    instructionEl.innerText = 'Enter each roll footage to subtract from total.';
    actionBtn.innerText = 'Add Roll';
    resetFinalMessage();
  } else {
    rolls.push(val);
    remaining -= val;
    updateInventory();
    setError('');
  }

  updateDisplay();

  inputEl.value = '';
  if (!inputEl.disabled) inputEl.focus();
}

inputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleInput();
});

// Initial states
updateDisplay();
updateInventory();


// Function to switch between tabs
function switchTab(tabId) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Activate selected tab and button
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

// Function to calculate takeup lineal footages
function calculateTakeup() {
  const flatLineal = parseFloat(document.getElementById('flatLineal').value) || 0;

  const factorA = parseFloat(document.getElementById('factorA').value) || 0;
  const factorC = parseFloat(document.getElementById('factorC').value) || 0;
  const factorB = parseFloat(document.getElementById('factorB').value) || 0;

  // Multiply flat lineal by each takeup factor
  const resultA = Math.round(flatLineal * factorA);
  const resultC = Math.round(flatLineal * factorC);
  const resultB = Math.round(flatLineal * factorB);

  // Update output displays formatted with commas
  document.getElementById('outputA').innerText = resultA.toLocaleString();
  document.getElementById('outputC').innerText = resultC.toLocaleString();
  document.getElementById('outputB').innerText = resultB.toLocaleString();
}
