import time
import usb.core
import usb.util
import xml.etree.ElementTree as ET

def read_voltage_usage(endpoint, size, device):
    try:
        data = device.read(endpoint, size, 100)
        print(data)
        voltage_usage = int.from_bytes(data[8:10], 'little')
        return voltage_usage
    except usb.core.USBError as e:
        print(f"USB error: {e}")
        return None

def process_devices(devices):
    if devices is None:
        raise ValueError("No USB devices found")

    for dev in devices:
        retry_count = 5
        while retry_count > 0:
            try:
                if dev.is_kernel_driver_active(0):
                    dev.detach_kernel_driver(0)

                dev.set_configuration()

                for cfg in dev:
                    for intf in cfg:
                        for ep in intf:
                            voltage = read_voltage_usage(ep.bEndpointAddress, ep.wMaxPacketSize, dev)
                            print(f"Voltage: {voltage}V")
                            # print(f"   ENDPOINT {ep.bEndpointAddress:02x} ==========================")
                            # print(f"    bLength          : {ep.bLength:2}")
                            # print(f"    bDescriptorType  : {ep.bDescriptorType:2}")
                            # print(f"    bEndpointAddress : {ep.bEndpointAddress:2}")
                            # print(f"    bmAttributes     : {ep.bmAttributes:2}")
                            # print(f"    wMaxPacketSize   : {ep.wMaxPacketSize:4}")
                            # print(f"    bInterval        : {ep.bInterval:2}")
                            # print(f"    bRefresh         : {ep.bRefresh:2}")
                            # print(f"    bSynchAddress    : {ep.bSynchAddress:2}")
                            # print(f"    voltage          : {voltage}")

                            # You can add further processing here as needed
                            
                usb.util.dispose_resources(dev)
                if dev.is_kernel_driver_active(0):
                    dev.attach_kernel_driver(0)
                
                break  # Exit the retry loop if successful

            except usb.core.USBError as e:
                print(f"Failed to set configuration for device {dev}: {e}")
                retry_count -= 1
                time.sleep(1)

        if retry_count == 0:
            print(f"Giving up on device {dev} after multiple attempts")

        time.sleep(5)

def main():
    devices = usb.core.find(find_all=True)
    process_devices(devices)

if __name__ == "__main__":
    main()
