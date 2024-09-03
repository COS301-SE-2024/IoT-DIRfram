#!/usr/bin/python
# -*- coding: utf-8 -*-

import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import time
import RPi.GPIO as GPIO

# Define GPIO to LCD mapping
LCD_RS = 26
LCD_E = 19
LCD_D4 = 13
LCD_D5 = 6
LCD_D6 = 5
LCD_D7 = 11
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

        GPIO.output(LED_ON, False)  # Backlight enable
        # Initialise display
        self.lcd_byte(0x33, LCD_CMD)
        self.lcd_byte(0x32, LCD_CMD)
        self.lcd_byte(0x28, LCD_CMD)
        self.lcd_byte(0x0C, LCD_CMD)
        self.lcd_byte(0x06, LCD_CMD)
        self.lcd_byte(0x01, LCD_CMD)

    def lcd_string(self, message, style):
        # Send string to display
        if style == 0x01:
            message = message.ljust(LCD_WIDTH, ' ')
        elif style == 0x02:
            message = message.center(LCD_WIDTH, ' ')
        elif style == 3:
            message = message.rjust(LCD_WIDTH, ' ')

        for i in range(LCD_WIDTH):
            self.lcd_byte(ord(message[i]), LCD_CHR)

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

    def lcd_byte(self, bits, mode):
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
    while True:
        voltage = getVoltage(channel0)
        current = voltage * 20
        lcd.clear()
        # Format messages
        voltage_msg = f"Volt: {voltage:.2f}V"
        print(f"Analog Value 0: {channel0.value / 65536:.6f}, Voltage: {channel0.voltage:.6f}V, Current: {current:.6f}A")
        current_msg = f"Curr: {current:.2f}A"
        lcd.write_line1(voltage_msg, 1)
        lcd.write_line2(current_msg, 1)
        time.sleep(1)
