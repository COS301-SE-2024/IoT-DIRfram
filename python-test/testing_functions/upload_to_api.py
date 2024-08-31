import requests
import json

# Define the URL for the upload_uart route
url = "http://localhost:3001/device/upload_uart"

# Create dummy data to upload
dummy_data = {
    "type": "text",
    "content": "This is a dummy log file content.",
    "filename": "log_dummy.txt",
    "device_name": "DummyDevice",
    "device_serial_number": "1000000013dcc3ee",
    "voltage": [1.1, 1.2, 1.3, 1.4]  # Example voltage values
}

# Convert the data to JSON format
json_data = json.dumps(dummy_data)

# Send a POST request to the server
response = requests.post(url, data=json_data, headers={'Content-Type': 'application/json'})

# Check the response status
if response.status_code == 200:
    print("Data uploaded successfully!")
    print("Response:", response.json())
else:
    print(f"Failed to upload data. Status code: {response.status_code}")
    print("Response:", response.text)
