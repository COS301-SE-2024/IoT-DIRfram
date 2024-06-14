from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

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

# Example document to insert
example_document = {
    "name": "Sample File",
    "type": "text",
    "content": "This is a sample file content",
    "upload_date": "2024-06-14"
}

# Insert the example document
try:
    collection.insert_one(example_document)
    print("Database 'file_upload' and collection 'file_data' set up successfully!")
except Exception as e:
    print(f"An error occurred while setting up the database and collection: {e}")
