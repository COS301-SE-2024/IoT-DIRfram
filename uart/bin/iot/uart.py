import serial
import argparse
import time
import re
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
import xml.etree.ElementTree as ET
from pymongo.errors import DuplicateKeyError
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# MongoDB connection URI
uri = "mongodb+srv://uart:t*stp**sw**d@codecraftersiotdirfram.zbblz89.mongodb.net/?retryWrites=true&w=majority&appName=CodeCraftersIOTDirfram"

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
        formatted_time = time.strftime('%Y:%m:%d-%H:%M:%S', time.localtime(last_received_time))
        log_filename = f'/usr/local/bin/iot/log_{formatted_time}.txt'

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
        
        check_garbage(log_filename)
        voltage_arr = get_voltage()
        upload_to_server(log_filename, voltage_arr)
        xmlname = f'/usr/local/bin/iot/output_{formatted_time}.xml'
        create_xml(log_filename, xmlname)

def check_garbage(filepath):
    # Regex to identify garbage lines
    garbage_regex = re.compile(r"[^\x00-\x7F]")
    flag = False
    content = ""
    # Path to the text file
    file_path = filepath
    warning_line = "WARNING: Values may be read using wrong baud rate.\n\n"
    empty_line = "WARNING: The file is empty, no data was read."
    try:
        # Read the file and check each line
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.readlines()

            if not content:
                with open(file_path, 'w') as file:
                    file.write(empty_line)

            for line_num, line in enumerate(file, start=1):
                if garbage_regex.search(line):
                    warning_line += f"Garbage detected in line {line_num}: {line.strip()}\n"
                    flag = True

        if flag:
            content.insert(0, warning_line)
            with open(file_path, 'w') as file:
                file.writelines(content)

    except Exception as e:
        print(f"An error occurred: {e}")

    
def upload_to_server(filepath, voltage_arr):
    # Create a new client and connect to the server
    # client = MongoClient(uri, server_api=ServerApi('1'))
    client = MongoClient(uri)
    # Define the database and collection
    db = client['uart_data']
    collection = db['file_data']

    device_collection = db['pi_devices']
    # Read data from the text file
    file_path = filepath

    try:
        with open(file_path, 'r') as file:
            file_content = file.read()  # Read the entire content of the file

        device_name = os.uname()[1]
        device_serial_number = get_raspberry_pi_serial_number()
        # Create a document to insert into the collection
        document = {
            "type": "text",
            "content": file_content,
            "filename": file_path.split('/')[-1],  # Optional: Store the filename
            "device_name": device_name,
            "device_serial_number": device_serial_number,
            "voltage": voltage_arr
        }

        device = {
            "_id": device_serial_number,
            "device_name": device_name
        }

        # Insert the document into the collection
        collection.insert_one(document)
        try:
            # Try to insert the device document
            device_collection.insert_one(device)
        except DuplicateKeyError:
            # Handle the case where the device already exists
            print(f"Device with serial number {device_serial_number} already exists.")
        print("Data inserted successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

def get_raspberry_pi_serial_number():
    serial = "0000000000000000"
    try:
        with open('/proc/cpuinfo', 'r') as f:
            for line in f:
                if line.startswith('Serial'):
                    serial = line.split(':')[1].strip()
    except FileNotFoundError as e:
        print(f"File not found: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    
    return serial

def sanitize_text(text):
    # Define a regex pattern to match invalid XML characters
    invalid_xml_chars = re.compile(
        '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uD800-\uDFFF\uFDD0-\uFDEF\uFFFE\uFFFF]'
        '|[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD]', 
        re.UNICODE
    )
    return invalid_xml_chars.sub('', text)

def create_xml(filename, xmlname):
    # Read the input text from a
    # Read the input text from a file
    with open(filename, 'r') as file:
        data = file.read()

    # Sanitize the entire input data
    data = sanitize_text(data)

    # Split the data into sections based on two or more consecutive newlines
    sections = re.split(r'\n{3,}', data.strip())

    # Create the root XML element
    root = ET.Element("root")

    # Add each section as a child element to the root
    for i, section in enumerate(sections):
        section_element = ET.SubElement(root, f"section_{i + 1}")
        section_element.text = section

    # Create an ElementTree object and write it to an XML file
    tree = ET.ElementTree(root)
    tree.write(xmlname, encoding='utf-8', xml_declaration=True)

    print("XML file 'output.xml' has been created.")

def get_voltage():
    # Constants
    VOLTAGE_PER_AMP = 1 / 20  # Adjust this value based on your sensor's specifications

    # Initialize the I2C interface
    i2c = busio.I2C(board.SCL, board.SDA)

    # Create an ADS1115 object
    ads = ADS.ADS1115(i2c)
    ads.gain = 1  # Set gain to ±4.096V

    # Define the analog input channel
    channel0 = AnalogIn(ads, ADS.P0)

    def getVoltage(pin):
            return (pin.value) / 65536 * 3.3
    
    # Initialize an array to store current values
    current_values = []

    # Loop to read the analog input for 20 seconds
    for _ in range(20):
        voltage = getVoltage(channel0)  # Read voltage
        current = voltage * 20  # Calculate current
        current_values.append(current)  # Store current value in array
        print(f"Analog Value 0: {channel0.value / 65536:.6f}, Voltage: {channel0.voltage:.6f}V, Current: {current:.6f}A")
        time.sleep(1)  # Delay for 1 second

    return current_values

    # # Loop to read the analog input continuously
    # while True:
    #         voltage = getVoltage(channel0) #channel0.voltage
    #         current = voltage * 20
    #         print(f"Analog Value 0: {channel0.value / 65536:.6f}, Voltage: {channel0.voltage:.6f}V, Current: {current:.6f}A")
    #         #print(getVoltage(channel0))
    #         # Delay for 1 second
    #         time.sleep(1)

if __name__ == '__main__':
    main()
