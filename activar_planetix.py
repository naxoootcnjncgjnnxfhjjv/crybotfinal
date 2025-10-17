
import os
import requests

'''
CryBot automation script to list Planet IX NFTs for sale with a minimum offer threshold.

This script demonstrates how you could automate your Planet IX NFT sales using CryBot's API.
It expects the following environment variables:

- CRYBOT_API_URL: base URL of the CryBot API (e.g., https://api.crybot.com)
- CRYBOT_API_TOKEN: your personal API token or key for authentication
- WALLET_ADDRESS: the Polygon wallet holding your Planet IX NFTs
- THRESHOLD_USD: minimum offer (in USD) required to list NFTs for sale
- DESTINATION_WALLET: address where proceeds from sales should be sent

The example function `activar_planetix` illustrates how to call an API endpoint
that scans your wallet for Planet IX NFTs and lists them for sale if their
current floor price or best offer meets or exceeds the threshold.

Note: This script is a template and will not work without a real CryBot API
endpoint. Adjust `endpoint_path` and request payload to match the actual API.
'''

def activar_planetix():
    # Read configuration from environment variables
    base_url = os.getenv('CRYBOT_API_URL', 'https://api.crybot.com')
    api_token = os.getenv('CRYBOT_API_TOKEN')
    wallet_address = os.getenv('WALLET_ADDRESS', '0x7B9Fc90C99b2ae4711BDEe31049c357999e79B09')
    threshold_usd = float(os.getenv('THRESHOLD_USD', '5'))
    destination_wallet = os.getenv('DESTINATION_WALLET', '0x82219fc3B1d22f0DAd2703101724dfA8f08DC456')

    if not api_token:
        raise RuntimeError("CRYBOT_API_TOKEN must be set in environment variables.")

    # Define the endpoint path for activating Planet IX sales
    endpoint_path = '/activar_planetix'

    # Construct the request URL
    url = f"{base_url}{endpoint_path}"

    # Payload for the request
    payload = {
        'wallet': wallet_address,
        'min_offer_usd': threshold_usd,
        'destination': destination_wallet
    }

    # Headers for authentication
    headers = {
        'Authorization': f"Bearer {api_token}",
        'Content-Type': 'application/json'
    }

    # Perform the POST request
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        print("Response from CryBot:", data)
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"An error occurred: {err}")

if __name__ == '__main__':
    activar_planetix()
