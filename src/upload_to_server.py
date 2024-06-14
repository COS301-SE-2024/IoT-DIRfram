from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MongoDB connection URI
uri = "mongodb+srv://fluffythedragonslayer:RckbSNrFQpgO2cV2@cluster0.qisokbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Define the database and collection
db = client['file_upload']
collection = db['file_data']

# Read data from the text file
file_path = 'log_115200.txt'

try:
    with open(file_path, 'r') as file:
        file_content = file.read()  # Read the entire content of the file

    # Create a document to insert into the collection
    document = {
        "type": "text",
        "content": file_content,
        "filename": file_path.split('/')[-1]  # Optional: Store the filename
    }

    # Insert the document into the collection
    collection.insert_one(document)
    print("Data inserted successfully!")
except Exception as e:
    print(f"An error occurred: {e}")