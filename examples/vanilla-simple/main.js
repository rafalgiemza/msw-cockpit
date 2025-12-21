import { enableMockControls } from '../../dist/index.js';

// Update current URL display
function updateURLDisplay() {
  document.getElementById('current-url').textContent = window.location.href;
}

// Update state display
function updateStateDisplay(state) {
  if (state) {
    const scenario = state.values.scenario || 'None';
    document.getElementById('active-scenario').textContent = scenario;
    document.getElementById('state-json').textContent = JSON.stringify(state, null, 2);
  }
}

// Initialize on page load
updateURLDisplay();

// Enable MSW Demo Controls
const controls = enableMockControls({
  scenarios: [
    'default',
    'error',
    'loading',
  ],
  onChange: (state) => {
    console.log('Scenario changed:', state);
    updateURLDisplay();
    updateStateDisplay(state);
  }
});

if (controls) {
  console.log('✅ MSW Demo Controls enabled!');
  console.log('Click the 🎭 button in the bottom-right corner to switch scenarios.');

  // Display initial state
  updateStateDisplay(controls.getState());
} else {
  console.warn('⚠️ MSW Demo Controls not enabled.');
  console.log('To enable, run: localStorage.setItem("MSW_DEMO_CONTROLS_ENABLED", "true")');
  console.log('Then reload the page.');
}
