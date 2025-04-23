from datetime import date
import os
from dotenv import load_dotenv
import requests
import base64
load_dotenv()
# spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
# spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
# authorization_code = os.getenv("SPOTIFY_AUTHORIZATION_CODE")
# redirect_uri = "http://localhost:8888/callback"
# token_url = 'https://accounts.spotify.com/api/token'
# data = {
#     'grant_type': 'authorization_code',
#     'code': authorization_code,
#     'redirect_uri': redirect_uri
# }
# auth = (spotify_client_id, spotify_client_secret)
# response = requests.post(token_url, data=data, auth=auth)
# access_token = response.json().get('access_token')
# refresh_token = response.json().get('refresh_token')
# if response.status_code == 200:
#     print('Access Token:', access_token)
#     print('Refresh Token:', refresh_token)
# else:
#     print(f"Error: {response.status_code}, {response.text}")
# data = {
#     'grant_type': 'refresh_token',
#     'refresh_token': refresh_token
# }
# credentials = f'{spotify_client_id}:{spotify_client_secret}'
# encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
# headers = {
#     'Authorization': f'Basic {encoded_credentials}'
# }
# response = requests.post(token_url, data=data, headers=headers)
# new_access_token = response.json().get('access_token')
# if response.status_code == 200:
#     print("New access token:", new_access_token)
# else:
#     print("Failed to get new access token:", response.json())


# response = requests.get('https://api.spotify.com/v1/me/player', headers={
#     'Authorization': f'Bearer {access_token}'
# })
# print(response.status_code)
# print(response.json())

url = 'https://www.dreamingspanish.com/.netlify/functions/externalTime'
payload = {
    'date': str(date.today()),
    'description': 'TESTING TESTING',
    'id': '',
    'timeSeconds': 7200,
    'type': 'listening'
}
headers = {
    'Authorization': f'Bearer {os.getenv("DS_AUTHORIZATION_TOKEN")}',
}

response = requests.post(url, json=payload, headers=headers)

print("Status Code:", response.status_code)
print("Response:", response.json())
# Sample

# date:"2025-03-08"
# description:"example"
# id:"1741426340694e9993dcb40f2"
# timeSeconds: 240
# type:"watching"

# date: "2025-03-08"
# description: "1"
# id: "174142742422831511d252edeb"
# timeSeconds:60
# type:"listening"