# dreaming-spanish-tracker
This script integrates Dreaming Spanish's comprehensible input tracking capabilities with Spotify using Spotify's API
## Setup
1. Log in to Dreaming Spanish, go to developer tools, and store the authorization token from local storage in .env file as DS_AUTHORIZATION_TOKEN
2. Log in to https://developer.spotify.com/dashboard, create an application, and store the application's Client ID and Client Secret as SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env file
3. Visit the following URL in your browser, replacing YOUR_CLIENT_ID with your Spotify Client ID, the redirect URI with whatever you set the redirect URI to when creating the Spotify application, and YOUR_RANDOM_STATE with a random string
    - https://accounts.spotify.com/authorize?response_type=code&client_id=YOUR_CLIENT_ID&scope=user-read-recently-played&redirect_uri=http://localhost:8888/callback&state=YOUR_RANDOM_STATE
4. After being redirected to the redirect URI, extract the authorization code from the code query parameter, and store it in .env file as SPOTIFY_AUTHORIZATION_CODE
