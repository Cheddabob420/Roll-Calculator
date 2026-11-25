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
  if (!runLengthEl || !remainingEl || !remainingBarEl) return;

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
  if (atOrUnderZero && finalMessageEl && instructionEl && inputEl && actionBtn) {
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

  if (undoBtn) undoBtn.disabled = rolls.length === 0;
}

function updateInventory() {
  if (!inventoryEl) return;
  inventoryEl.innerHTML = '';
  rolls.forEach((roll, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>Roll ${index + 1}</span><span>${roll} ft</span>`;
    inventoryEl.appendChild(li);
  });
}

function setError(message) {
  if (errorMessageEl) errorMessageEl.textContent = message || '';
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
  if (inputEl) inputEl.disabled = false;
  if (actionBtn) {
    actionBtn.disabled = false;
    actionBtn.innerText = 'Add Roll';
  }
  if (instructionEl) instructionEl.textContent = 'Enter each roll footage to subtract from total.';
  updateDisplay();
  if (inputEl) inputEl.focus();
}

function resetFinalMessage() {
  if (!finalMessageEl) return;
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

  if (inputEl) inputEl.disabled = false;
  if (actionBtn) {
    actionBtn.disabled = false;
    actionBtn.innerText = 'Set/Apply';
  }
  if (undoBtn) undoBtn.disabled = true;
  if (instructionEl) instructionEl.textContent = 'Enter Total Run Length (Feet)';
  if (runLengthEl) runLengthEl.innerText = 'Not set';
  if (remainingEl) remainingEl.innerText = '0 ft';

  updateInventory();
  resetFinalMessage();
  updateDisplay();
  if (inputEl) {
    inputEl.value = '';
    inputEl.focus();
  }
}

function handleInput() {
  if (!inputEl) return;
  let val = parseFloat(inputEl.value);
  if (isNaN(val) || val <= 0) {
    setError('Please enter a positive number.');
    return;
  }

  if (isFirstStep) {
    runLength = val;
    remaining = val;
    isFirstStep = false;
    if (instructionEl) instructionEl.innerText = 'Enter each roll footage to subtract from total.';
    if (actionBtn) actionBtn.innerText = 'Add Roll';
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

if (inputEl) {
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleInput();
  });
}

// Initial states for Run Length Calculator
updateDisplay();
updateInventory();


/* ==========================================================================
   TAB SWITCHING & TAKEUP CALCULATOR LOGIC
   ========================================================================== */

function switchTab(tabId, evt) {
  // Hide all tab panels
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active styling from tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Activate selected tab panel
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Activate chosen button dynamically
  const targetBtn = evt ? evt.currentTarget : window.event?.currentTarget;
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
}

function calculateTakeup() {
  const flatInput = document.getElementById('flatLineal');
  if (!flatInput) return;

  const flatLineal = parseFloat(flatInput.value) || 0;

  // Get factor values with safe fallbacks
  const factorE = parseFloat(document.getElementById('factorE')?.value) || 0;
  const factorC = parseFloat(document.getElementById('factorC')?.value) || 0;
  const factorB = parseFloat(document.getElementById('factorB')?.value) || 0;

  // Calculate results for E, C, and B flutes
  const resultE = Math.round(flatLineal * factorE);
  const resultC = Math.round(flatLineal * factorC);
  const resultB = Math.round(flatLineal * factorB);

  // Render values to UI formatted with commas
  const outE = document.getElementById('outputE');
  const outC = document.getElementById('outputC');
  const outB = document.getElementById('outputB');

  if (outE) outE.innerText = resultE.toLocaleString();
  if (outC) outC.innerText = resultC.toLocaleString();
  if (outB) outB.innerText = resultB.toLocaleString();
}
