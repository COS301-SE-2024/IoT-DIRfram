import pyudev
import serial.tools.list_ports
import psutil
import os

def read_sysfs_voltage(device_path):
    try:
        voltage_file = os.path.join(device_path, 'power', 'voltage_now')
        if os.path.exists(voltage_file):
            with open(voltage_file, 'r') as file:
                voltage = int(file.read().strip()) / 1000  # Convert µV to mV
                return f"{voltage} mV"
        return "N/A"
    except Exception as e:
        return f"Error reading voltage: {e}"

def get_usb_info_pyudev():
    try:
        context = pyudev.Context()
        devices = []
        for device in context.list_devices(subsystem='usb', DEVTYPE='usb_device'):
            voltage = read_sysfs_voltage(device.device_path)
            devices.append({
                "Device Node": device.device_node or "N/A",
                "Device Path": device.device_path or "N/A",
                "Vendor ID": device.get('ID_VENDOR_ID', "N/A"),
                "Product ID": device.get('ID_MODEL_ID', "N/A"),
                "Manufacturer": device.get('ID_VENDOR', "N/A"),
                "Product": device.get('ID_MODEL', "N/A"),
                "Serial": device.get('ID_SERIAL_SHORT', "N/A"),
                "Voltage": voltage
            })
        return devices
    except Exception as e:
        return str(e)

def get_usb_info_pyserial():
    try:
        ports = serial.tools.list_ports.comports()
        devices = []
        for port in ports:
            devices.append({
                "Device": port.device or "N/A",
                "Name": port.name or "N/A",
                "Description": port.description or "N/A",
                "HWID": port.hwid or "N/A",
                "VID": port.vid or "N/A",
                "PID": port.pid or "N/A",
                "Serial Number": port.serial_number or "N/A",
                "Location": port.location or "N/A",
                "Manufacturer": port.manufacturer or "N/A",
                "Product": port.product or "N/A",
                "Interface": port.interface or "N/A",
                "Voltage": "N/A"  # pyserial doesn't provide voltage info
            })
        return devices
    except Exception as e:
        return str(e)

def get_usb_info_psutil():
    try:
        partitions = psutil.disk_partitions()
        devices = []
        for partition in partitions:
            if 'usb' in partition.opts:
                devices.append({
                    "Device": partition.device or "N/A",
                    "Mountpoint": partition.mountpoint or "N/A",
                    "File System Type": partition.fstype or "N/A",
                    "Voltage": "N/A"  # psutil doesn't provide voltage info
                })
        return devices
    except Exception as e:
        return str(e)

def main():
    print("USB Info from pyudev:")
    pyudev_info = get_usb_info_pyudev()
    if isinstance(pyudev_info, str):
        print(f"Error: {pyudev_info}")
    else:
        for device in pyudev_info:
            for key, value in device.items():
                print(f"{key}: {value}")
            print("-" * 20)

    print("\nUSB Info from pyserial:")
    pyserial_info = get_usb_info_pyserial()
    if isinstance(pyserial_info, str):
        print(f"Error: {pyserial_info}")
    else:
        for device in pyserial_info:
            for key, value in device.items():
                print(f"{key}: {value}")
            print("-" * 20)

    print("\nUSB Info from psutil:")
    psutil_info = get_usb_info_psutil()
    if isinstance(psutil_info, str):
        print(f"Error: {psutil_info}")
    else:
        for device in psutil_info:
            for key, value in device.items():
                print(f"{key}: {value}")
            print("-" * 20)

if __name__ == "__main__":
    main()
