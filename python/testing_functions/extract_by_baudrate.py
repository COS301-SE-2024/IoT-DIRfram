import serial
import argparse
import time

def main():
    # Parse command line arguments
    common_baudrates = [9600, 1200, 115200, 2400, 300, 19200]  # , 38400, 200, 75, 4800, 57600, 600]
    parser = argparse.ArgumentParser(description='UART to USB communication script')
    parser.add_argument('port', type=str, help='The serial port (e.g., /dev/ttyUSB0)')
    args = parser.parse_args()
    last_time = time.time()
    while time.time() - last_time < 30:
        for baudrate in common_baudrates:
            try:
                ser = serial.Serial(port=args.port, baudrate=baudrate, timeout=1)
                print(f'Opened {args.port} at {baudrate} baudrate.')

                last_received_time = time.time()
                last_success_time = None
                log_filename = f'log_{baudrate}.txt'

                with open(log_filename, 'a') as log_file:
                    while True:
                        if ser.in_waiting > 0:
                            data = ser.read(ser.in_waiting)
                            try:
                                decoded_data = data.decode()
                                print(f'Received: {decoded_data}')
                                log_file.write(decoded_data + '\n')
                                last_received_time = time.time()  # Update the last received time
                                last_success_time = last_received_time  # Update the last success time
                                last_time = last_success_time
                            except UnicodeDecodeError:
                                print(f'Error decoding data: {data}. Trying next baud rate.')
                                break

                        current_time = time.time()
                        
                        # Check if 2 seconds have passed since the last data received
                        if not last_success_time and current_time - last_received_time > 1:
                            print('No data received or undecodable data for 1 second. Closing the connection.')
                            break

                        # Check if 20 seconds have passed since the last successful data received
                        if last_success_time and current_time - last_success_time > 5:
                            print('No decodable data received for 5 seconds. Closing the connection.')
                            break

                        # Sleep for a short while to avoid busy-waiting
                        time.sleep(0.1)

                # Close the connection and try the next baud rate if needed
                ser.close()
                print('Serial port closed.')

            except serial.SerialException as e:
                print(f'Error: {e}')
                if ser.is_open:
                    ser.close()
                    print('Serial port closed due to error.')

if __name__ == '__main__':
    main()
