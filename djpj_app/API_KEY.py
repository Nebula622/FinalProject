import json
file_path = f'djpj_app/static/json/key.json'

# Read the JSON file
with open(file_path, 'r') as file:
    data = json.load(file)

# Extract the value associated with the "key" key
OPEN_API_KEY1 = data.get('key1')
OPEN_API_KEY2 = data.get('key2')
OPEN_API_KEY3 = data.get('key3')
OPEN_API_KEY4 = data.get('key4')
OPEN_API_KEY5 = data.get('key5')

OPEN_API_KEY = OPEN_API_KEY1 + OPEN_API_KEY2 + OPEN_API_KEY3 + OPEN_API_KEY4 + OPEN_API_KEY5
# Print the value of OPEN_API_KEY to verify
