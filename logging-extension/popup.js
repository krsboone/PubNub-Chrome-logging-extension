const input  = document.getElementById('sourceId');
const btn    = document.getElementById('saveBtn');
const status = document.getElementById('status');

// Load any previously saved ID when the popup opens.
chrome.storage.local.get(['sourceId'], (result) => {
  if (result.sourceId) {
    input.value = result.sourceId;
    setStatus(`Active — logging as "${result.sourceId}"`, true);
  } else {
    setStatus('No ID set — enter one to start logging.', false);
  }
});

btn.addEventListener('click', () => {
  const id = input.value.trim();
  if (!id) {
    setStatus('Please enter an ID.', false);
    return;
  }
  chrome.storage.local.set({ sourceId: id }, () => {
    setStatus(`Active — logging as "${id}"`, true);
  });
});

function setStatus(msg, active) {
  status.textContent = msg;
  status.className = active ? 'active' : 'idle';
}
