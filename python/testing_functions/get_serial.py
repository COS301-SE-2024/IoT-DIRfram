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

# Example usage
serial_number = get_raspberry_pi_serial_number()
print(f"Raspberry Pi Serial Number: {serial_number}")
