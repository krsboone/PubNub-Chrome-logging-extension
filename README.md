# PubNub-Chrome-logging-extension


## Details

Chrome browser extension that will capture console messages and runtime errors then Publish to PubNub

`content_script.js` runs on every page at document_start. It injects page_logger.js as a <script> tag so it executes in the page's own JavaScript world — this is the only way to intercept the page's console object.

`page_logger.js` runs inside the page's own JavaScript world (where it can intercept), but has no direct access to Chrome extension APIs. Wraps console.log/warn/error/info/debug. Listens for error & unhandledrejection on DOM. 

`content_script.js` acts as a message relay bridge between two isolated JavaScript environments.

`background.js` (service worker) receives the message, reads the saved sourceId from storage, and publishes to PubNub channel logging using the REST publish API.

`force-error.html` just a simple test page that throws an error when the button is clicked | you can do better :)

Default sends to PubNub channel `logging`; the same channel as other logging utilities [PubNub-device-logging](https://github.com/krsboone/PubNub-device-logging)


## Config

Replace
```
publishKey: "pub-key-here"
subscribeKey: "sub-key-here"
```
with your pub/sub keys

Loading the extension in Chrome
1. Go to chrome://extensions
2. Enable Developer mode (top-right toggle)
3. Click Load unpacked → select the logger-extension/ dir
4. Click the extension icon, enter your Source ID (any unique id), and click Save & Activate


## Recording

https://youtu.be/vheg9hwJ5ww


## Todo

1. Add date/time to the log line
2. Broader testing
3. Flood protection needs to be considered
4. Access controls, and effeciant way for user to programmatically invoke pub/sub keys
5. Strict userIDs vs randomly generated



