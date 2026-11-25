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
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  const targetBtn = evt ? evt.currentTarget : window.event?.currentTarget;
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
}

function calculateTakeup() {
  const flatInput = document.getElementById('flatLineal');
  if (!flatInput) return;

  const flatLineal = parseFloat(flatInput.value) || 0;

  const factorE = parseFloat(document.getElementById('factorE')?.value) || 0;
  const factorC = parseFloat(document.getElementById('factorC')?.value) || 0;
  const factorB = parseFloat(document.getElementById('factorB')?.value) || 0;

  const resultE = Math.round(flatLineal * factorE);
  const resultC = Math.round(flatLineal * factorC);
  const resultB = Math.round(flatLineal * factorB);

  const outE = document.getElementById('outputE');
  const outC = document.getElementById('outputC');
  const outB = document.getElementById('outputB');

  if (outE) outE.innerText = resultE.toLocaleString();
  if (outC) outC.innerText = resultC.toLocaleString();
  if (outB) outB.innerText = resultB.toLocaleString();
}


/* ==========================================================================
   SHEET SCRAP & 10% TOLERANCE CALCULATOR LOGIC
   ========================================================================== */

let storedTenPercentCap = 0; // Stored 10% scrap allowance value

function setUnitPreset(count) {
  const unitInput = document.getElementById('sheetsPerUnit');
  if (unitInput) {
    unitInput.value = count;
    calculateScrapTolerance();
  }
}

function calculateScrapTolerance() {
  const totalSheets = parseFloat(document.getElementById('totalOrderSheets')?.value) || 0;
  const sheetsPerUnit = parseFloat(document.getElementById('sheetsPerUnit')?.value) || 0;
  const scrappedSheets = parseFloat(document.getElementById('scrappedSheets')?.value) || 0;

  // 1. Calculate and store 10% allowance separately
  storedTenPercentCap = totalSheets * 0.10;
  const minGoodRequired = Math.ceil(totalSheets - storedTenPercentCap);
  const capSheetsFloored = Math.floor(storedTenPercentCap);

  // 2. Unit calculations
  const totalUnitsDecimal = sheetsPerUnit > 0 ? (totalSheets / sheetsPerUnit) : 0;
  const fullUnits = sheetsPerUnit > 0 ? Math.floor(totalSheets / sheetsPerUnit) : 0;
  const looseSheets = sheetsPerUnit > 0 ? Math.round(totalSheets % sheetsPerUnit) : 0;
  const capUnits = sheetsPerUnit > 0 ? (storedTenPercentCap / sheetsPerUnit).toFixed(2) : '0';

  // 3. Scrap percentage of total order & remaining good sheets
  const scrapPct = totalSheets > 0 ? ((scrappedSheets / totalSheets) * 100) : 0;
  const goodRemaining = Math.max(0, totalSheets - scrappedSheets);

  // Update Stat Cards
  document.getElementById('resTotalUnits').innerText = totalUnitsDecimal.toLocaleString(undefined, { maximumFractionDigits: 2 });
  document.getElementById('resUnitBreakdown').innerText = sheetsPerUnit > 0
    ? `${fullUnits.toLocaleString()} full units + ${looseSheets.toLocaleString()} loose sheets`
    : 'Enter sheets per unit';

  document.getElementById('resTenPercent').innerText = capSheetsFloored.toLocaleString();
  document.getElementById('resTenPercentUnits').innerText = sheetsPerUnit > 0
    ? `${capUnits} units (Min Good: ${minGoodRequired.toLocaleString()} sheets)`
    : `Min Good: ${minGoodRequired.toLocaleString()} sheets`;

  const pctEl = document.getElementById('resScrapPct');
  const pctWrap = document.getElementById('resScrapPctWrap');
  pctEl.innerText = `${scrapPct.toFixed(2)}%`;
  document.getElementById('resGoodRemaining').innerText = `Good sheets remaining: ${goodRemaining.toLocaleString()}`;

  const banner = document.getElementById('scrapStatusBanner');
  const makeupBox = document.getElementById('makeupBox');

  if (totalSheets <= 0) {
    banner.className = 'finish-message';
    banner.innerText = 'Enter total order sheets above to calculate 10% tolerance.';
    pctWrap.classList.remove('over-limit');
    makeupBox.style.display = 'none';
    return;
  }

  // 4. Check if within 10% range or calculate makeup sheets
  if (scrappedSheets <= storedTenPercentCap) {
    const bufferRemaining = Math.floor(storedTenPercentCap - scrappedSheets);
    banner.className = 'finish-message success';
    banner.innerText = `✓ WITHIN 10% TOLERANCE — ${bufferRemaining.toLocaleString()} scrap sheets remaining in buffer.`;
    pctWrap.classList.remove('over-limit');
    makeupBox.style.display = 'none';
  } else {
    const makeupTo90 = Math.ceil(scrappedSheets - storedTenPercentCap);
    const makeupTo100 = Math.ceil(scrappedSheets);

    const units90Text = sheetsPerUnit > 0 ? ` (${(makeupTo90 / sheetsPerUnit).toFixed(2)} units)` : '';
    const units100Text = sheetsPerUnit > 0 ? ` (${(makeupTo100 / sheetsPerUnit).toFixed(2)} units)` : '';

    banner.className = 'finish-message warning';
    banner.innerText = `⚠️ OVER 10% TOLERANCE (${scrapPct.toFixed(2)}%) — MAKEUP REQUIRED`;
    pctWrap.classList.add('over-limit');

    document.getElementById('resMakeup90').innerText = `${makeupTo90.toLocaleString()} sheets${units90Text}`;
    document.getElementById('resMakeup100').innerText = `${makeupTo100.toLocaleString()} sheets${units100Text}`;
    makeupBox.style.display = 'flex';
  }
}

function resetScrapCalculator() {
  document.getElementById('totalOrderSheets').value = '';
  document.getElementById('sheetsPerUnit').value = '';
  document.getElementById('scrappedSheets').value = '';
  storedTenPercentCap = 0;
  calculateScrapTolerance();
}
