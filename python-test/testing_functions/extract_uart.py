import serial
import argparse
import time

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
        log_filename = f'log_{baudrate}.txt'

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

if __name__ == '__main__':
    main()
