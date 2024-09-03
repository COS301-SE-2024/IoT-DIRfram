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

# import
import RPi.GPIO as GPIO
import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

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

        
        self.create_custom_char(0, [
            0b00000,  # Row 1
            0b10001,  # Row 2
            0b10001,  # Row 3
            0b10001,  # Row 4
            0b11111,  # Row 5
            0b00000,  # Row 6
            0b00000,  # Row 7
            0b00000   # Row 8
        ])

    def create_custom_char(self, location, pattern):
        """ Create a custom character in CGRAM """
        location &= 0x07  # Keep location within 0-7
        self.lcd_byte(0x40 + (location * 8), LCD_CMD)  # Set CGRAM address
        for byte in pattern:
            self.lcd_byte(byte, LCD_CHR)  # Write character pattern

    def display_custom_char(self, location):
        """ Display a custom character """
        self.lcd_byte(location, LCD_CHR)  # Write custom character to display


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

    while True:
        voltage = getVoltage(channel0) #channel0.voltage
        current = voltage * 20
        lcd.lcd_byte(LCD_LINE_1, LCD_CMD)
        lcd.lcd_string(f"Volt: {channel0.voltage:.6f}V", 2)
        lcd.lcd_byte(LCD_LINE_2, LCD_CMD)
        lcd.lcd_string(f"Curr: {current:.6f}A", 2)
        #print(getVoltage(channel0))
        # Delay for 1 second
        time.sleep(1)