#!/bin/bash

# Get the USB device name from the argument
USB_DEVICE=$1

# Define the log file
LOG_FILE="/usr/local/bin/usb_devices.log"

# Log the USB device name with a timestamp
echo "$(date): USB device $USB_DEVICE plugged in" >> $LOG_FILE

/usr/bin/python /usr/local/bin/iot/uart.py $USB_DEVICE 2>> $LOG_FILE

echo "Finished" >> $LOG_FILE
