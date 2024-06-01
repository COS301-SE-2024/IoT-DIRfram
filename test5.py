import usb.core
import pyudev
import serial.tools.list_ports
import psutil
import os

def parse_usb_ids(file_path):
    vendor_dict = {}
    with open('usb.ids', 'r', encoding='ISO-8859-1') as file:
        current_vendor_id = None
        for line in file:
            empty = line.strip()
            if not empty or line.startswith('#'):
                continue
            if not line.startswith('\t'):  # Vendor ID
                vendor_id, vendor_name = line.split(' ', 1)
                current_vendor_id = vendor_id
                vendor_dict[current_vendor_id] = {'name': vendor_name.strip(), 'products': {}}
            elif line.startswith('\t') and current_vendor_id:  # Product ID
                product_id, product_name = line.strip().split(' ', 1)
                vendor_dict[current_vendor_id]['products'][product_id] = product_name.strip()
    return vendor_dict

def get_vendor_product_name(vendor_id, product_id, usb_ids):
    vendor_info = usb_ids.get(vendor_id, {'name': 'Unknown Vendor', 'products': {}})
    vendor_name = vendor_info['name']
    product_name = vendor_info['products'].get(product_id, 'Unknown Product')
    return vendor_name, product_name

def get_usb_info_pyudev(usb_ids):
    try:
        context = pyudev.Context()
        devices = []
        for device in context.list_devices(subsystem='usb', DEVTYPE='usb_device'):
            vendor_name, product_name = get_vendor_product_name(device.get('ID_VENDOR_ID', "N/A"), device.get('ID_MODEL_ID', "N/A"), usb_ids)
            devices.append({
                "Device Node": device.device_node or "N/A",
                "Device Path": device.device_path or "N/A",
                "Vendor ID": device.get('ID_VENDOR_ID', "N/A"),
                "Product ID": device.get('ID_MODEL_ID', "N/A"),
                "Manufacturer": device.get('ID_VENDOR', "N/A"),
                "Product": device.get('ID_MODEL', "N/A"),
                "Serial": device.get('ID_SERIAL_SHORT', "N/A"),
                "Vendor Name": vendor_name,
                "Product Name": product_name,
            })

        return devices
    except Exception as e:
        return str(e)

def main():
    print("USB Info from pyudev:")
    usb_ids = parse_usb_ids('usb.txt')
    pyudev_info = get_usb_info_pyudev(usb_ids)
    if isinstance(pyudev_info, str):
        print(f"Error: {pyudev_info}")
    else:
        for device in pyudev_info:
            for key, value in device.items():
                print(f"{key}: {value}")
            print("-" * 20)

if __name__ == "__main__":
    main()
