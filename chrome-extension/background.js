chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendRequest") {
        fetch('https://www.dreamingspanish.com/.netlify/functions/externalTime', {
            method: message.method,
            headers: message.headers,
            body: message.body
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ success: true, data });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});
