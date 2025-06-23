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
            const today = new Date().toLocaleDateString('en-CA');
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
                    alert(`Success: CI added!`);
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

function wrapSubtitleWords() {
    if (!document.getElementById('yt-word-hover-style')) {
        const style = document.createElement('style');
        style.id = 'yt-word-hover-style';
        style.textContent = `
            .yt-word {
                margin-right: 0.25em;
            }
            .yt-word:hover {
                color: #4169e1 !important;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
    const segments = document.querySelectorAll('span.ytp-caption-segment');
    segments.forEach(segment => {
        if (segment.dataset.processed === "true") return;
        const text = segment.textContent.trim();
        const words = text.split(/\s+/); // split by whitespace
        segment.innerHTML = words
            .map(word => `<span class="yt-word">${word}</span>`)
            .join('');
        segment.dataset.processed = "true";
    });
}

let trackedWords = new Set();
const overlay = document.createElement('div');
overlay.id = 'yt-word-overlay';
overlay.style.position = 'fixed';
overlay.style.top = '100px';
overlay.style.right = '20px';
overlay.style.width = '250px';
overlay.style.maxHeight = '50vh';
overlay.style.overflowY = 'auto';
overlay.style.background = 'rgba(0, 0, 0, 0.8)';
overlay.style.color = '#fff';
overlay.style.padding = '10px';
overlay.style.fontFamily = 'sans-serif';
overlay.style.fontSize = '14px';
overlay.style.borderRadius = '8px';
overlay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
overlay.style.zIndex = 9999;
overlay.innerHTML = '<strong>Clicked Words</strong><ul id="yt-word-list" style="margin-top: 8px;"></ul>';
document.body.appendChild(overlay);
const clearBtn = document.createElement('button');
clearBtn.textContent = 'Clear';
clearBtn.style.marginTop = '10px';
clearBtn.style.background = '#4169e1';
clearBtn.style.color = '#fff';
clearBtn.style.border = 'none';
clearBtn.style.padding = '5px 10px';
clearBtn.style.borderRadius = '5px';
clearBtn.style.cursor = 'pointer';
overlay.appendChild(clearBtn);

function updateOverlay() {
    const list = document.getElementById('yt-word-list');
    list.innerHTML = '';
    [...trackedWords].forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        list.appendChild(li);
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('yt-word')) {
        const word = e.target.textContent.trim().toLowerCase();
        trackedWords.add(word);
        updateOverlay();
    }
});

clearBtn.onclick = () => {
    trackedWords.clear();
    updateOverlay();
};

setInterval(() => {
    insertCustomButton();
}, 1000)

setInterval(() => {
    wrapSubtitleWords();
}, 100);