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
import RPi.GPIO as GPIO
import sys  # Add this to use sys.exit()
import subprocess

# MongoDB connection URI
uri = "mongodb+srv://uart:t*stp**sw**d@codecraftersiotdirfram.zbblz89.mongodb.net/?retryWrites=true&w=majority&appName=CodeCraftersIOTDirfram"

def main(lcd):
    try:
        # Parse command line arguments
        parser = argparse.ArgumentParser(description='UART to USB communication script')
        parser.add_argument('port', type=str, help='The serial port (e.g., /dev/ttyUSB0)')
        baudrate = 115200
        args = parser.parse_args()
        port = "/dev/" + args.port 
        lcd.clear()
        lcd.message(f"OPENING PORT\n{args.port}", 4, 0.2)
        # Open the serial port
        try:
            ser = serial.Serial(port=port, baudrate=baudrate, timeout=1)
            print(f'Opened {args.port} at {baudrate} baudrate.')
        except serial.SerialException as e:
            print(f'Serial error: {e}')
            sys.exit(1)

        last_received_time = time.time()
        formatted_time = time.strftime('%Y:%m:%d-%H:%M:%S', time.localtime(last_received_time))
        log_filename = f'/usr/local/bin/iot/log_{formatted_time}.txt'

        try:

            lcd.clear()
            lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
            lcd.lcd_string(f"READING DATA", 2)
            lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
            lcd.lcd_string(f"FROM PORT", 2)
            with open(log_filename, 'a') as log_file:
                print("Reading data from serial port")
                while True:
                    if ser.in_waiting > 0:
                        data = ser.read(ser.in_waiting)
                        decoded_data = data.decode()
                        print(f'Received: {decoded_data}')
                        log_file.write(decoded_data + '\n')
                        last_received_time = time.time()  # Update the last received time

                    if time.time() - last_received_time > 20:
                        print('No data received for 20 seconds. Closing the connection.')
                        lcd.clear()
                        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
                        lcd.lcd_string(f"CLOSING DATA", 2)
                        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
                        lcd.lcd_string(f"CONNECTION", 2)
                        time.sleep(5)
                        break

                    time.sleep(0.1)
        except IOError as e:
            print(f'File I/O error: {e}')
        finally:
            if ser.is_open:
                ser.close()
                print('Serial port closed.')
        
        check_garbage(log_filename, lcd)
        voltage_arr = get_voltage(lcd)
        upload_to_server(log_filename, voltage_arr, lcd)
        xmlname = f'/usr/local/bin/iot/output_{formatted_time}.xml'
        create_xml(log_filename, xmlname, lcd)

    except Exception as e:
        print(f"An unexpected error occurred in main: {e}")
        sys.exit(1)

def check_garbage(filepath, lcd):
    # Regex to identify garbage lines
    garbage_regex = re.compile(r"[^\x00-\x7F]")
    flag = False
    content = ""
    # Path to the text file
    print(filepath)
    file_path = filepath
    warning_line = "WARNING: Values may be read using wrong baud rate.\n\n"
    empty_line = "WARNING: The file is empty, no data was read."
    try:
        # Read the file and check each line
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.readlines()
            print(content)

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
        lcd.clear()
        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"CANNOT OPEN", 2)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
        lcd.lcd_string(f"LOG FILE", 2)
        print("error at check_garbage")
        print(f"An error occurred: {e}")
        time.sleep(5)

    
def upload_to_server(filepath, voltage_arr, lcd):
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
        lcd.clear()
        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"FAILED UPLOAD", 2)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
        lcd.lcd_string(f"TO SERVER", 2)
        print(f"An error occurred: {e}")
        time.sleep(5)

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

def create_xml(filename, xmlname, lcd):
    try:
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
    except Exception as e:
        lcd.clear()
        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"FAILED TO", 2)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
        lcd.lcd_string(f"CREATE XML", 2)
        print(f"An error occurred: {e}")

def get_voltage(lcd):
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
    lcd.clear()
    # Loop to read the analog input for 20 seconds
    for _ in range(20):
        voltage = getVoltage(channel0)  # Read voltage
        current = voltage * 20  # Calculate current
        current_values.append(current)  # Store current value in array
        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"Volt: {channel0.voltage:.6f}V", 2)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
        lcd.lcd_string(f"Curr: {current:.6f}A", 2)
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


#!/usr/bin/python
# -*- coding: utf-8 -*-

#
# HD44780 LCD Script for
# Raspberry Pi


# The wiring for the LCD is as follows:
# 1 : GND
# 2 : 5V
# 3 : Contrast (0-5V)*
# 4 : RS (Register Select)
# 5 : R/W (Read Write)       - GROUND THIS PIN
# 6 : Enable or Strobe
# 7 : Data Bit 0             - NOT USED
# 8 : Data Bit 1             - NOT USED
# 9 : Data Bit 2             - NOT USED
# 10: Data Bit 3             - NOT USED
# 11: Data Bit 4
# 12: Data Bit 5
# 13: Data Bit 6
# 14: Data Bit 7
# 15: LCD Backlight +5V**
# 16: LCD Backlight GND

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


# Define GPIO to LCD mapping

LCD_RS = 4
LCD_E = 17
LCD_D4 = 18
LCD_D5 = 27
LCD_D6 = 22
LCD_D7 = 23
LED_ON = 15

# Define some device constants

LCD_WIDTH = 0x10  # Maximum characters per line
LCD_CHR = True
LCD_CMD = False

LCD_LINE_1 = 0x80  # LCD RAM address for the 1st line
LCD_LINE_2 = 0xC0  # LCD RAM address for the 2nd line
LCD_LINE_3 = 0x94  # LCD RAM address for the 3rd line
LCD_LINE_4 = 0xD4  # LCD RAM address for the 4th line 
# Timing constants

E_PULSE = 0.00005
E_DELAY = 0.00005


class LCD(object):
    def __init__(self):

        # Main program block

        GPIO.setwarnings(False)

        # Initialise display

        self.lcd_init()

    def lcd_init(self):
        GPIO.setmode(GPIO.BCM)  # Use BCM GPIO numbers
        GPIO.setup(LCD_E, GPIO.OUT)  # E
        GPIO.setup(LCD_RS, GPIO.OUT)  # RS
        GPIO.setup(LCD_D4, GPIO.OUT)  # DB4
        GPIO.setup(LCD_D5, GPIO.OUT)  # DB5
        GPIO.setup(LCD_D6, GPIO.OUT)  # DB6
        GPIO.setup(LCD_D7, GPIO.OUT)  # DB7
        GPIO.setup(LED_ON, GPIO.OUT)  # Backlight enable

        # GPIO.output(LED_ON, False)  # Backlight enable
        # Initialise display

        self.lcd_byte(0x33, LCD_CMD)
        self.lcd_byte(0x32, LCD_CMD)
        self.lcd_byte(0x28, LCD_CMD)
        self.lcd_byte(0x0C, LCD_CMD)
        self.lcd_byte(0x06, LCD_CMD)
        self.lcd_byte(0x01, LCD_CMD)

    def message(self, message, style=1,speed=1):
        # Auto splits, not perfect for clock
        # Send string to display
        # style=1 Left justified
        # style=2 Centred
        # style=3 Right justified
        # style=4 typing

        msgs = message.split('\n')
        for (idx, msg) in enumerate(msgs):
            if idx == 0:
                self.lcd_byte(LCD_LINE_1, LCD_CMD)
            elif idx == 0x01:
                self.lcd_byte(LCD_LINE_2, LCD_CMD)
            if style != 4:
                self.lcd_string(msg, style)
            elif style == 4:
                self.type_string(msg, speed)

    def type_string(self, message, speed=1, style=1):

        # Send string to display
        # style=1 Left justified
        # style=2 Centred
        # style=3 Right justified

        if style == 0x01:
            message = message.ljust(LCD_WIDTH, ' ')
        elif style == 0x02:
            message = message.center(LCD_WIDTH, ' ')
        elif style == 3:
            message = message.rjust(LCD_WIDTH, ' ')

        for i in range(LCD_WIDTH):
            self.lcd_byte(ord(message[i]), LCD_CHR)
            print(message[i])
            if message[i] != " ":
                time.sleep(speed)

    def clear(self):
        self.lcd_byte(0x06, LCD_CMD)
        self.lcd_byte(0x01, LCD_CMD)
        time.sleep(0.45)

    def write_line1(self, message, style):
        self.lcd_byte(LCD_LINE_1, LCD_CMD)
        self.lcd_string(message, style)

    def write_line2(self, message, style):
        self.lcd_byte(LCD_LINE_2, LCD_CMD)
        self.lcd_string(message, style)

    def set_line1(self):
        self.lcd_byte(LCD_LINE_1, LCD_CMD)

    def set_line2(self):
        self.lcd_byte(LCD_LINE_2, LCD_CMD)

    def lcd_string(self, message, style):
        # Send string to display
        # style=1 Left justified
        # style=2 Centred
        # style=3 Right justified

        if style == 0x01:
            message = message.ljust(LCD_WIDTH, ' ')
        elif style == 0x02:
            message = message.center(LCD_WIDTH, ' ')
        elif style == 3:
            message = message.rjust(LCD_WIDTH, ' ')

        for i in range(LCD_WIDTH):
            self.lcd_byte(ord(message[i]), LCD_CHR)

    def lcd_byte(self, bits, mode):

        # Send byte to data pins
        # bits = data
        # mode = True  for character
        #        False for command

        GPIO.output(LCD_RS, mode)  # RS

        # High bits

        GPIO.output(LCD_D4, False)
        GPIO.output(LCD_D5, False)
        GPIO.output(LCD_D6, False)
        GPIO.output(LCD_D7, False)
        if bits & 0x10 == 0x10:
            GPIO.output(LCD_D4, True)
        if bits & 0x20 == 0x20:
            GPIO.output(LCD_D5, True)
        if bits & 0x40 == 0x40:
            GPIO.output(LCD_D6, True)
        if bits & 0x80 == 0x80:
            GPIO.output(LCD_D7, True)

            # Toggle 'Enable' pin

        time.sleep(E_DELAY)
        GPIO.output(LCD_E, True)
        time.sleep(E_PULSE)
        GPIO.output(LCD_E, False)
        time.sleep(E_DELAY)

        # Low bits

        GPIO.output(LCD_D4, False)
        GPIO.output(LCD_D5, False)
        GPIO.output(LCD_D6, False)
        GPIO.output(LCD_D7, False)
        if bits & 0x01 == 0x01:
            GPIO.output(LCD_D4, True)
        if bits & 0x02 == 0x02:
            GPIO.output(LCD_D5, True)
        if bits & 0x04 == 0x04:
            GPIO.output(LCD_D6, True)
        if bits & 0x08 == 0x08:
            GPIO.output(LCD_D7, True)

            # Toggle 'Enable' pin

        time.sleep(E_DELAY)
        GPIO.output(LCD_E, True)
        time.sleep(E_PULSE)
        GPIO.output(LCD_E, False)
        time.sleep(E_DELAY)
 
def check_CPU_temp():
    temp = None
    err, msg = subprocess.getstatusoutput('vcgencmd measure_temp')
    if not err:
        m = re.search(r'-?\d\.?\d*', msg)   # a solution with a  regex
        try:
            temp = float(m.group())
        except ValueError: # catch only error needed
            pass
    return temp, msg
 

if __name__ == '__main__':
    lcd = LCD()
    # lcd.clear()
    # lcd.message('Hello Bhack\nHow are you?', 4)
    # lcd.clear()
    # lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
    # lcd.lcd_string("Raspberry PI", 2)
    # lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
    # lcd.lcd_string("HD44780 LCD", 2)
    lcd.clear()

    lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
    lcd.lcd_string(f"ATTEMPTING TO", 2)
    lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
    lcd.lcd_string("HACK FIRMWARE", 2)
    time.sleep(5)
    print("ATTEMPTING TO HACK FIRMWARE")
    main(lcd)
    print("HACKING FIRMWARE SUCCESSFUL")
    lcd.clear()

    # while True:
    #     voltage = getVoltage(channel0) #channel0.voltage
    #     current = voltage * 20
    #     lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
    #     lcd.lcd_string(f"Volt: {channel0.voltage:.6f}V", 2)
    #     lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
    #     lcd.lcd_string(f"Curr: {current:.6f}A", 2)
    #     #print(getVoltage(channel0))
    #     # Delay for 1 second
    #     time.sleep(1)

    for _ in range(120):
        voltage = getVoltage(channel0) #channel0.voltage
        current = voltage * 20
        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"Volt: {channel0.voltage:.6f}V", 2)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
        lcd.lcd_string(f"Curr: {current:.6f}A", 2)
        #print(getVoltage(channel0))
        # Delay for 1 second
        time.sleep(1)
    
    lcd.clear()
    lcd.message('THANK YOU\nFOR WAITING', 2)
    time.sleep(5)
    lcd.clear()
    lcd.message("HERE IS YOUR\nPI'S TEMPERATURE", 2)
    time.sleep(5)
    lcd.clear()
    # lcd.message('NO DATA\nTO DISPLAY', 2)

    for _ in range(120):
        temp, msg = check_CPU_temp()
        print(f"temperature {temp}°C")
        print(f"full message {msg}")
        str_temp = str(msg).replace("temp=", "")
        time.sleep(1)
        # lcd.message(f"Temp: {temp:.2f}C", 1)
        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"Temperature", 2)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)

        lcd.lcd_string(f"Exact: {str_temp}", 1)
    
    lcd.clear()
    lcd.message('GOODBYE.', 4, 0.5)
    time.sleep(5)
    lcd.clear()
