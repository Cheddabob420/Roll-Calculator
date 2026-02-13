let totalRun = 0;
let isFirstStep = true;

function handleInput() {
  const inputEl = document.getElementById('userInput');
  const instructionEl = document.getElementById('instruction');
  const remainingEl = document.getElementById('remainingVal');
  
  let val = parseFloat(inputEl.value);

  if (isNaN(val)) return; // Ignore empty/invalid inputs

  if (isFirstStep) {
    // Phase 1: Set the initial Run Length
    totalRun = val;
    isFirstStep = false;
    instructionEl.innerText = "Enter Roll Footage";
  } else {
    // Phase 2: Subtract Rolls
    totalRun -= val;
  }

  // Update Display
  remainingEl.innerText = totalRun;

  // Apply red color if below 8000 threshold
  if (totalRun < 5000 && totalRun >= 0) {
    remainingEl.classList.remove('status-good');
    remainingEl.classList.add('status-warning');
  } else if (totalRun >= 5000) {
    remainingEl.classList.remove('status-warning');
    remainingEl.classList.add('status-good');
  }

  // Check if negative
  if (totalRun < 0) {
    // Convert negative to positive for final result
    let finalOverage = Math.abs(totalRun);
    let isWarning = finalOverage < 8000;
    let textColor = isWarning ? '#e74c3c' : '#27ae60';
    let messageClass = isWarning ? 'warning' : 'success';
    let messageText = isWarning 
      ? '⚠️ This will create a small butt roll. Consider getting another roll to split the last two!'
      : '✓ Butt roll will be good to go back to the roll room!';
    
    // Final Output
    document.getElementById('app').innerHTML = `
      <div class="card">
        <h1 style="text-align:center; color:var(--accent); margin-top:0;">Finished!</h1>
        <div class="centered-content">
          <p style="font-size:1.25rem; margin:0.5rem 0;">Remaining Roll Footage:</p>
          <p style="font-size:3rem; font-weight:bold; color:${textColor}; margin:0;">${finalOverage} ft</p>
          <div class="finish-message ${messageClass}">
            ${messageText}
          </div>
          <button onclick="location.reload()" style="font-size:1rem; margin-top:1rem;">Restart</button>
        </div>
      </div>
    `;
  }

  // Reset input field for next roll
  inputEl.value = "";
  inputEl.focus();
}

// Allow "Enter" key to trigger the button
document.getElementById("userInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInput();
});
