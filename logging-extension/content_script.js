// page_logger.js runs in the MAIN world (declared in manifest.json) and
// posts PUBNUB_CONSOLE_LOG messages via window.postMessage.
// This isolated-world script relays those messages to the background service worker.
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data && event.data.type === 'PUBNUB_CONSOLE_LOG') {
    chrome.runtime.sendMessage({ type: 'CONSOLE_LOG', log: event.data.log });
  }
});
