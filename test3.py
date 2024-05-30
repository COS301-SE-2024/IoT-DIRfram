import pyudev
import os
import usb.core
import usb.util
import serial.tools.list_ports

def get_usb_device_info(vid, pid):
    try:
        # Find the device
        dev = usb.core.find(idVendor=vid, idProduct=pid)
        if dev is None:
            return "Device not found"
        
        # Get device descriptor
        descriptor = dev.get_active_configuration().bDescriptorRaw

        # Parse the descriptor
        device_info = {}
        device_info['bLength'] = hex(descriptor[0])
        device_info['bDescriptorType'] = hex(descriptor[1])
        device_info['bcdUSB'] = hex(descriptor[2] << 8 | descriptor[3])
        device_info['bDeviceClass'] = hex(descriptor[4])
        device_info['bDeviceSubClass'] = hex(descriptor[5])
        device_info['bDeviceProtocol'] = hex(descriptor[6])
        device_info['bMaxPacketSize0'] = hex(descriptor[7])
        device_info['idVendor'] = hex(dev.idVendor)
        device_info['idProduct'] = hex(dev.idProduct)
        device_info['bcdDevice'] = hex(dev.bcdDevice)
        device_info['iManufacturer'] = hex(descriptor[14])
        device_info['iProduct'] = hex(descriptor[15])
        device_info['iSerialNumber'] = hex(descriptor[16])
        device_info['bNumConfigurations'] = hex(descriptor[17])
        device_info['bMaxPower'] = hex(descriptor[8])  # bMaxPower is at index 8 in the descriptor

        return device_info
    except Exception as e:
        return f"Error: {e}"



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
        print(context.list_devices(subsystem='usb', DEVTYPE='usb_device'))
        for device in context.list_devices(subsystem='usb', DEVTYPE='usb_device'):
            voltage = read_sysfs_voltage(device.device_path)
            max_power = device.get('POWER_SUPPLY_USB_MAXPOWER', "N/A")
            devices.append({
                "Device": device,
                "Device Node": device.device_node or "N/A",
                "Device Path": device.device_path or "N/A",
                "Vendor ID": device.get('ID_VENDOR_ID', "N/A"),
                "Product ID": device.get('ID_MODEL_ID', "N/A"),
                "Manufacturer": device.get('ID_VENDOR', "N/A"),
                "Product": device.get('ID_MODEL', "N/A"),
                "Serial": device.get('ID_SERIAL_SHORT', "N/A"),
                "Voltage": voltage,
                "Max Power (mA)": max_power
            })
            device_info = get_usb_device_info(device.get('ID_VENDOR_ID', "N/A"), device.get('ID_MODEL_ID', "N/A"))
            if isinstance(device_info, dict):
                for key, value in device_info.items():
                    print(f"{key}: {value}")
            else:
                print(device_info)
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

if __name__ == "__main__":
    main()




