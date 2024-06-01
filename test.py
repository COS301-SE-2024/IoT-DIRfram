import usb.core
import usb.util

def get_string_safe(device, index):
    try:
        return usb.util.get_string(device, index)
    except (usb.core.USBError, ValueError):
        return None

def get_voltage(device):
    # Define USB request parameters for voltage retrieval
    REQUEST_TYPE = usb.util.CTRL_TYPE_VENDOR | usb.util.CTRL_IN
    REQUEST = 0x01
    VALUE = 0x0000
    INDEX = 0x0000
    LENGTH = 2  # Assuming the voltage is represented by a 2-byte value

    try:
        # Perform a control transfer to request voltage information
        result = device.ctrl_transfer(REQUEST_TYPE, REQUEST, VALUE, INDEX, LENGTH)
        # Convert the result to voltage (assuming it's a 16-bit unsigned integer)
        voltage = result[0] + (result[1] << 8)  # Little-endian format
        return voltage
    except usb.core.USBError as e:
        return None

def get_usb_device_info():
    # Open a file to store device information
    with open("usb_device_info.txt", "w") as file:
        # Find all USB devices
        dev = usb.core.find(find_all=True)

        if dev is None:
            file.write("No USB devices found")
            return

        # Iterate over all USB devices
        for device in dev:
            # Get device information safely
            device_info = {}
            device_info['manufacturer'] = get_string_safe(device, device.iManufacturer)
            device_info['product'] = get_string_safe(device, device.iProduct)
            device_info['serial'] = get_string_safe(device, device.iSerialNumber)
            device_info['vendor_id'] = hex(device.idVendor)
            device_info['product_id'] = hex(device.idProduct)
            device_info['device_version'] = f"{device.bcdDevice >> 8}.{device.bcdDevice & 0xFF}"

            # Attempt to get additional details
            try:
                # Chip model
                device_info['chip_model'] = device.usb_driver
            except AttributeError:
                device_info['chip_model'] = "Not available"

            try:
                # Device name
                device_info['device_name'] = device.device.bus, device.device.address
            except AttributeError:
                device_info['device_name'] = "Not available"

            # Attempt to get voltage information
            voltage = get_voltage(device)
            device_info['voltage'] = voltage if voltage is not None else "Not available"

            # Write device information to the file
            file.write("Device Info:\n")
            file.write(f"Manufacturer: {device_info['manufacturer']}\n")
            file.write(f"Product: {device_info['product']}\n")
            file.write(f"Serial Number: {device_info['serial']}\n")
            file.write(f"Vendor ID: {device_info['vendor_id']}\n")
            file.write(f"Product ID: {device_info['product_id']}\n")
            file.write(f"Device Version: {device_info['device_version']}\n")
            file.write(f"Chip Model: {device_info['chip_model']}\n")
            file.write(f"Device Name: {device_info['device_name']}\n")
            file.write(f"Voltage: {device_info['voltage']}\n\n")

if __name__ == "__main__":
    get_usb_device_info()
