const PUB_KEY = 'pub-key-here';
const SUB_KEY = 'sub-key-here';
const UUID    = 'logging_extension';
const CHANNEL = 'logging';

function getTimestamp() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
         `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

async function publishToPubNub(sourceId, logLine) {
  const payload = {
    source: sourceId+'.log',
    log: logLine,
    timestamp: getTimestamp()
  };
  const encoded = encodeURIComponent(JSON.stringify(payload));
  const url = `https://ps.pndsn.com/publish/${PUB_KEY}/${SUB_KEY}/0/${CHANNEL}/0/${encoded}?uuid=${UUID}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log('PubNub:', data);
}

// return true keeps the message channel open so the service worker stays alive
// for the async storage read + fetch — without it MV3 can terminate the worker early.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'CONSOLE_LOG') return false;

  (async () => {
    try {
      const result = await chrome.storage.local.get(['sourceId']);
      if (result.sourceId) {
        await publishToPubNub(result.sourceId, message.log);
      }
    } catch (err) {
      console.error('PubNub publish error:', err);
    } finally {
      sendResponse();
    }
  })();

  return true;
});
