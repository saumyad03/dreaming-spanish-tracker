# dreaming-spanish-tracker
This script integrates Dreaming Spanish's comprehensible input tracking capabilities with Spotify using Spotify's API
## Chrome Extension
### Details
The `chrome-extension` directory contains code for a Chrome extension that stores comprehensible input from YouTube to your Dreaming Spanish account with the click of a button. In order to authenticate the requests it makes to Dreaming Spanish's server, it presents a popup when you click on the extension logo through which you can provide your authentication token. This authentication token is stored locally via Chrome's Storage API. Additionally, the Chrome extension renders a button next to the share button under YouTube videos using `content.js`. When clicked, this button sends the information needed to make a request to store the comprehensible input to the background service worker `background.js`. `background.js` makes the actual API request, sending back the results of it the request to `content.js`, which then displays a success or error message. Given that YouTube operates as a Single Page Application (SPA), the extension checks every few seconds whether the user's URL changed to determine whether the button should be rerendered after its initial render. Additionally, a the background service worker is used to send the actual request because Dreaming Spanish's server doesn't accept cross-origin requests from YouTube.
### Setup
1. In Google Chrome, go to chrome://extensions, turn on Developer Mode, click Load Unpacked, select the directory `chrome-extension` wherever it is stored locally in your computer, and pin the extension
2. Log in to Dreaming Spanish, go to developer tools, copy the authorization token from local storage, paste this into the popup that shows up when you click on the extension, and click save
## Spotify Job
1. Log in to Dreaming Spanish, go to developer tools, and store the authorization token from local storage in .env file as DS_AUTHORIZATION_TOKEN
2. Log in to https://developer.spotify.com/dashboard, create an application, and store the application's Client ID and Client Secret as SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env file
3. Visit the following URL in your browser, replacing YOUR_CLIENT_ID with your Spotify Client ID, the redirect URI with whatever you set the redirect URI to when creating the Spotify application, and YOUR_RANDOM_STATE with a random string
    - https://accounts.spotify.com/authorize?response_type=code&client_id=YOUR_CLIENT_ID&scope=user-read-recently-played&redirect_uri=http://localhost:8888/callback&state=YOUR_RANDOM_STATE
4. After being redirected to the redirect URI, extract the authorization code from the code query parameter, and store it in .env file as SPOTIFY_AUTHORIZATION_CODE
