import usb.core
import usb.util

def read_voltage_usage(endpoint, size, device):
    try:
        # Change the endpoint and size to match your device specifics
        data = device.read(endpoint, size, 100)  # Endpoint and size
        # Parse the data to match your device specifics
        print(data)
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
    
    print(f"DEVICE ID {dev.idVendor:04x}:{dev.idProduct:04x} on Bus {dev.bus:03} Address {dev.address:03} =================")
    print(f"Manufacturer: {dev.bcdUsb:04x}, Product: {dev.bcdDevice:04x}, Serial: {dev.iSerialNumber:02x}")
    # Iterate over all configurations
    for cfg in dev:
        print(f" CONFIGURATION {cfg.bConfigurationValue} ==================================")
        
        # Iterate over all interfaces
        for intf in cfg:
            print(f"  INTERFACE {intf.bInterfaceNumber} ====================================")
            
            # Iterate over all endpoints
            for ep in intf:
                voltage = read_voltage_usage(ep.bEndpointAddress, ep.wMaxPacketSize, dev)
                print(f"   ENDPOINT {ep.bEndpointAddress:02x} ==========================")
                print(f"    bLength          : {ep.bLength:2}")
                print(f"    bDescriptorType  : {ep.bDescriptorType:2}")
                print(f"    bEndpointAddress : {ep.bEndpointAddress:2}")
                print(f"    bmAttributes     : {ep.bmAttributes:2}")
                print(f"    wMaxPacketSize   : {ep.wMaxPacketSize:4}")
                print(f"    bInterval        : {ep.bInterval:2}")
                print(f"    bRefresh         : {ep.bRefresh:2}")
                print(f"    bSynchAddress    : {ep.bSynchAddress:2}")
                print(f"    voltage          : {voltage}")


