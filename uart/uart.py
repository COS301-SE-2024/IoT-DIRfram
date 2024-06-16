import serial
import argparse
import time
import re
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

# MongoDB connection URI
uri = "mongodb+srv://uart:testpassword@codecraftersiotdirfram.zbblz89.mongodb.net/?retryWrites=true&w=majority&appName=CodeCraftersIOTDirfram"

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='UART to USB communication script')
    parser.add_argument('port', type=str, help='The serial port (e.g., /dev/ttyUSB0)')
    # parser.add_argument('baudrate', type=int, help='The baud rate (e.g., 9600)')
    baudrate = 115200
    args = parser.parse_args()
    port = "/dev/" + args.port 
    # Open the serial port
    try:
        ser = serial.Serial(port=port, baudrate=baudrate, timeout=1)
        print(f'Opened {args.port} at {baudrate} baudrate.')

        last_received_time = time.time()
        log_filename = f'log_{last_received_time}.txt'

        with open(log_filename, 'a') as log_file:
        # Read and write data
            while True:
                if ser.in_waiting > 0:
                    data = ser.read(ser.in_waiting)
                    decoded_data = data.decode()
                    print(f'Received: {decoded_data}')
                    log_file.write(decoded_data + '\n')
                    last_received_time = time.time()  # Update the last received time

                # Check if 20 seconds have passed since the last data received
                if time.time() - last_received_time > 20:
                    print('No data received for 20 seconds. Closing the connection.')
                    break

                time.sleep(0.1)  # Sleep for a short while to avoid busy-waiting

    except serial.SerialException as e:
        print(f'Error: {e}')
    finally:
        if ser.is_open:
            ser.close()
            print('Serial port closed.')
        
        if not check_garbage(log_filename):
            upload_to_server(log_filename)


def check_garbage(filepath):
    # Regex to identify garbage lines
    garbage_regex = re.compile(r"[^\x00-\x7F]")
    flag = False
    content = ""
    # Path to the text file
    file_path = filepath
    warning_line = "WARNING: Values may be read using wrong baud rate\n\n"
    try:
        # Read the file and check each line
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.readlines()
            for line_num, line in enumerate(file, start=1):
                if garbage_regex.search(line):
                    warning_line += f"Garbage detected in line {line_num}: {line.strip()}\n"
                    flag = True

        if flag:
            content.insert(0, warning_line)
            with open(file_path, 'w') as file:
                file.writelines(content)

        return flag
    except Exception as e:
        print(f"An error occurred: {e}")

    
def upload_to_server(filepath):
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Define the database and collection
    db = client['uart_data']
    collection = db['file_data']

    # Read data from the text file
    file_path = filepath

    try:
        with open(file_path, 'r') as file:
            file_content = file.read()  # Read the entire content of the file

        device_name = os.uname()[1]
        # Create a document to insert into the collection
        document = {
            "type": "text",
            "content": file_content,
            "filename": file_path.split('/')[-1],  # Optional: Store the filename
            "device_id": device_name
        }

        # Insert the document into the collection
        collection.insert_one(document)
        print("Data inserted successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    main()
