import time
import usb.core
import usb.util
import xml.etree.ElementTree as ET

def read_voltage_usage(device):
    try:
        # Change the endpoint and size to match your device specifics
        data = device.read(0x81, 0x7)  # Endpoint and size
        # Parse the data to match your device specifics
        voltage_usage = int.from_bytes(data[8:10], 'little')
        return voltage_usage
    except usb.core.USBError as e:
        print(f"USB error: {e}")
        return None

# Find all connected USB devices
devices = usb.core.find(find_all=True)

if devices is None:
    raise ValueError("No USB devices found")

for dev in devices:
    retry_count = 5
    while retry_count > 0:
        try:
            # Detach kernel driver if necessary
            if dev.is_kernel_driver_active(0):
                dev.detach_kernel_driver(0)

            # Set the active configuration
            dev.set_configuration()

            voltage_usage = read_voltage_usage(dev)
            if voltage_usage is not None:
                print(f"Voltage usage for device {dev}: {voltage_usage}")

                # Create the XML
                root = ET.Element("DeviceData")
                ET.SubElement(root, "VoltageUsage").text = str(voltage_usage)
                tree = ET.ElementTree(root)
                tree.write("device_data.xml")

                print("Voltage usage retrieved and saved to device_data.xml")
            else:
                print(f"Failed to retrieve voltage usage for device {dev}")

            # Reattach the kernel driver if necessary
            usb.util.dispose_resources(dev)
            if dev.is_kernel_driver_active(0):
                dev.attach_kernel_driver(0)
            
            break  # Exit the retry loop if successful

        except usb.core.USBError as e:
            print(f"Failed to set configuration for device {dev}: {e}")
            retry_count -= 1
            time.sleep(1)  # Wait for a second before retrying

    if retry_count == 0:
        print(f"Giving up on device {dev} after multiple attempts")

    # Sleep for 5 seconds before processing the next device
    time.sleep(5)
