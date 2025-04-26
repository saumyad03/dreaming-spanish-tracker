function getToken() {
    return new Promise((resolve) => {
        chrome.storage.local.get('authToken', (result) => {
            resolve(result.authToken);
        });
    });
}

function insertCustomButton() {
    // Identify Share button
    const shareBtn = [...document.querySelectorAll('button[aria-label="Share"]')].find(btn => btn.offsetParent !== null);;
    // Terminate early if Share button not found or if the custom button already exists
    if (!shareBtn || document.getElementById('ci-button')) return;
    // Clone the Share button to preserve styling
    const customBtn = shareBtn.cloneNode(true);
    customBtn.id = 'ci-button';
    // Update accessibility attributes and tooltip
    customBtn.setAttribute('aria-label', 'Add CI');
    customBtn.setAttribute('title', 'Add CI');
    // Remove the Share icon
    const iconDiv = customBtn.querySelector('.yt-spec-button-shape-next__icon');
    if (iconDiv) iconDiv.remove();
    // Update button text
    const textContainer = customBtn.querySelector('.yt-spec-button-shape-next__button-text-content');
    if (textContainer) textContainer.textContent = 'Add CI';
    // Send API request to Dreaming Spanish to add comprehensible input
    customBtn.onclick = async (e) => {
        e.preventDefault();
        try {
            const authToken = await getToken();
            if (!authToken) {
                throw new Error('No authentication token found. Please set it in the extension options.');
            }
            const titleElement = document.querySelector('ytd-watch-metadata h1 yt-formatted-string');
            const videoTitle = titleElement?.textContent?.trim();
            if (!titleElement || !videoTitle) {
                throw new Error('A problem occurred finding the YouTube video title');
            }
            const video = document.querySelector('video');
            const durationInSeconds = video?.duration;
            if (!video || !durationInSeconds) {
                throw new Error('A problem occurred finding the YouTube video');
            }
            const today = new Date().toISOString().split('T')[0];
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            };
            const body = JSON.stringify(
                {
                    'date': today,
                    'description': videoTitle,
                    'id': '',
                    'timeSeconds': durationInSeconds,
                    'type': 'watching'
                }
            );
            chrome.runtime.sendMessage({ action: "sendRequest", method, headers, body }, (response) => {
                if (response.success) {
                    alert(`Success: 'CI added!'`);
                } else {
                    throw new Error(response.error);
                }
            });
        } catch (error) {
            alert(`Failure: ${error.message}`);
        }
    };
    // Insert the custom button right after the Share button
    customBtn.style.marginLeft = '8px';
    shareBtn.parentElement.insertBefore(customBtn, shareBtn.nextSibling);
}

let currentUrl = location.href;
setInterval(() => {
    if (location.href !== currentUrl) {
        currentUrl = location.href;
        setTimeout(insertCustomButton, 1000);
    }
}, 10000)

setTimeout(insertCustomButton, 5000);