# dreaming-spanish-tracker
This script integrates Dreaming Spanish's comprehensible input tracking capabilities with Spotify using Spotify's API
## Chrome Extension / Proxy
### Details
The `chrome-extension` directory contains code for a Chrome extension that stores comprehensible input from YouTube to your Dreaming Spanish account with the click of a button. In order to authenticate the requests it makes to Dreaming Spanish's server to add data, it presents a popup when you click on the extension logo through which you can provide your authentication token. Additionally, the Chrome extension renders a button next to the share button under YouTube videos, which sends a request to your locally hosted proxy server with the details of the video. This proxy server then sends a request to Dreaming Spanish's actual server. Given that YouTube operates as a Single Page Application (SPA), the extension checks every few seconds whether the user's URL changed to determine whether the button should be rerendered after its initial render. Additionally, a proxy server is used because Dreaming Spanish's server doesn't seem to accept the request headers sent from requests made by Chrome extensions.
### Setup
1. In Google Chrome, go to chrome://extensions, turn on Developer Mode, click Load Unpacked, select the directory `chrome-extension` wherever it is stored locally in your computer, and pin the extension
2. Log in to Dreaming Spanish, go to developer tools, copy the authorization token from local storage, paste this into the popup that shows up when you click on the extension, and click save
3. Open a terminal, go to the directory `proxy` wherever it is stored locally in your computer, run `npm install`, and then run `npm run start`
## Spotify Job
1. Log in to Dreaming Spanish, go to developer tools, and store the authorization token from local storage in .env file as DS_AUTHORIZATION_TOKEN
2. Log in to https://developer.spotify.com/dashboard, create an application, and store the application's Client ID and Client Secret as SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env file
3. Visit the following URL in your browser, replacing YOUR_CLIENT_ID with your Spotify Client ID, the redirect URI with whatever you set the redirect URI to when creating the Spotify application, and YOUR_RANDOM_STATE with a random string
    - https://accounts.spotify.com/authorize?response_type=code&client_id=YOUR_CLIENT_ID&scope=user-read-recently-played&redirect_uri=http://localhost:8888/callback&state=YOUR_RANDOM_STATE
4. After being redirected to the redirect URI, extract the authorization code from the code query parameter, and store it in .env file as SPOTIFY_AUTHORIZATION_CODE
