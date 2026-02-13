// Runs in the page's MAIN world. Wraps each console method so every call
// is also forwarded to the extension via window.postMessage.
(function () {
  const METHODS = ['log', 'warn', 'error', 'info', 'debug'];

  function serialize(arg) {
    if (arg instanceof Error) return arg.toString();
    if (typeof arg === 'object' && arg !== null) {
      try { return JSON.stringify(arg); } catch (_) { return String(arg); }
    }
    return String(arg);
  }

  function post(log) {
    window.postMessage({ type: 'PUBNUB_CONSOLE_LOG', log }, '*');
  }

  METHODS.forEach((method) => {
    const original = console[method].bind(console);
    console[method] = function (...args) {
      original(...args);
      post(`[${method.toUpperCase()}] ${args.map(serialize).join(' ')}`);
    };
  });

  // Uncaught JavaScript exceptions (e.g. ReferenceError, TypeError thrown at runtime)
  window.addEventListener('error', (event) => {
    const location = `${event.filename}:${event.lineno}:${event.colno}`;
    post(`[UNCAUGHT ERROR] ${event.message} (${location})`);
  }, true);

  // Unhandled promise rejections (e.g. fetch().then(...) with no .catch())
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error
      ? event.reason.toString()
      : serialize(event.reason);
    post(`[UNHANDLED REJECTION] ${reason}`);
  });
})();
