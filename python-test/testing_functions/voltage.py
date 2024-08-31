import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import time

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

# Loop to read the analog input continuously
while True:
        voltage = getVoltage(channel0) #channel0.voltage
        current = voltage * 20
        print(f"Analog Value 0: {channel0.value / 65536:.6f}, Voltage: {channel0.voltage:.6f}V, Current: {current:.6f}A")
        #print(getVoltage(channel0))
        # Delay for 1 second
        time.sleep(1)