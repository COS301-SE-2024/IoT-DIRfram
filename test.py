import usb.core
import usb.util

def get_string_safe(device, index):
    try:
        return usb.util.get_string(device, index)
    except (usb.core.USBError, ValueError):
        return None

def get_usb_device_info():
    # Find all USB devices
    dev = usb.core.find(find_all=True)

    if dev is None:
        print("No USB devices found")
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

        # Print device information
        print("Device Info:")
        print("Manufacturer:", device_info['manufacturer'])
        print("Product:", device_info['product'])
        print("Serial Number:", device_info['serial'])
        print("Vendor ID:", device_info['vendor_id'])
        print("Product ID:", device_info['product_id'])
        print("Device Version:", device_info['device_version'])
        print("")

if __name__ == "__main__":
    get_usb_device_info()
