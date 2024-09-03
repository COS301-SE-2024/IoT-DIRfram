#!/usr/bin/python
# -*- coding: utf-8 -*-

# HD44780 LCD Script for Raspberry Pi

# Import
import RPi.GPIO as GPIO
import time
import board
import busio
import subprocess
import os
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# Constants
VOLTAGE_PER_AMP = 1 / 20  # Adjust this value based on your sensor's specifications
USB_CHECK_INTERVAL = 10  # Time in seconds between USB device checks

# Initialize the I2C interface
i2c = busio.I2C(board.SCL, board.SDA)

# Create an ADS1115 object
ads = ADS.ADS1115(i2c)
ads.gain = 1  # Set gain to ±4.096V

# Define the analog input channel
channel0 = AnalogIn(ads, ADS.P0)

def get_cpu_temperature():
    temp = subprocess.run(['vcgencmd', 'measure_temp'], capture_output=True)
    return float(temp.stdout.decode().replace("temp=", "").replace("'C\n", ""))

def getVoltage(pin):
    return (pin.value) / 65536 * 3.3

def list_usb_devices():
    """ Returns a list of currently connected USB devices """
    result = subprocess.run(['lsusb'], capture_output=True)
    return result.stdout.decode()

def detect_new_usb_device(prev_devices):
    """ Checks if there are new USB devices compared to the previous list """
    current_devices = list_usb_devices()
    if current_devices != prev_devices:
        return True
    return False

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

# Timing constants
E_PULSE = 0.00005
E_DELAY = 0.00005

class LCD(object):
    def __init__(self):
        GPIO.setwarnings(False)
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

        GPIO.output(LED_ON, False)  # Backlight enable
        # Initialise display
        self.lcd_byte(0x33, LCD_CMD)
        self.lcd_byte(0x32, LCD_CMD)
        self.lcd_byte(0x28, LCD_CMD)
        self.lcd_byte(0x0C, LCD_CMD)
        self.lcd_byte(0x06, LCD_CMD)
        self.lcd_byte(0x01, LCD_CMD)

    def message(self, message, style=1, speed=1):
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


if __name__ == '__main__':
    lcd = LCD()
    lcd.clear()

    # Store the initial list of USB devices
    prev_devices = list_usb_devices()

    while True:
        lcd.clear()
        # Check for new USB devices
        if detect_new_usb_device(prev_devices):
            lcd.clear()
            print("New USB device detected. Exiting...")
            lcd.clear()
            break

        voltage = getVoltage(channel0)
        current = voltage * 20
        temperature = get_cpu_temperature()

        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"Temp: {temperature:.2f}C", 1)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
        lcd.lcd_string(f"Curr: {current:.5f}A", 1)

        # Update the list of USB devices
        prev_devices = list_usb_devices()

        # Delay for 1 second
        time.sleep(1)
