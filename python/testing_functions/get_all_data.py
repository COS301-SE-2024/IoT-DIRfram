import usb.core
import usb.util

def parse_usb_ids():
    vendor_dict = {}
    with open('usb.ids', 'r', encoding='ISO-8859-1') as file:
        current_vendor_id = None
        current_product_id = None
        for line in file:
            empty = line.strip()
            if not empty or line.startswith('#'):
                continue
            if not line.startswith('\t'):  # Vendor ID
                vendor_id, vendor_name = line.split(' ', 1)
                current_vendor_id = vendor_id
                vendor_dict[current_vendor_id] = {'name': vendor_name.strip(), 'products': {}}
            elif line.startswith('\t') and not line.startswith('\t\t'):  # Product ID
                line = line.strip()
                product_id, product_name = line.split(' ', 1)
                current_product_id = product_id
                vendor_dict[current_vendor_id]['products'][current_product_id] = product_name.strip()
    return vendor_dict

def get_vendor_product_name(vendor_id, product_id, usb_ids):
    vendor_info = usb_ids.get(vendor_id, 'Unknown Vendor')
    vendor_name = vendor_info['name']
    product_name = 'Unknown Product'
    if vendor_id in usb_ids:
        products = vendor_info['products']
        product_name = products.get(product_id, 'Unknown Product')
    return vendor_name, product_name

def print_device_info(dev):
    print(f"DEVICE ID {dev.idVendor:04x}:{dev.idProduct:04x} on Bus {dev.bus:03} Address {dev.address:03} =================")
    print(f" bLength                :   {dev.bLength:#04x} ({dev.bLength} bytes)")
    print(f" bDescriptorType        :    {dev.bDescriptorType:#04x} Device")
    print(f" bcdUSB                 :  {dev.bcdUSB:#06x} USB {dev.bcdUSB >> 8}.{dev.bcdUSB & 0xFF}")
    print(f" bDeviceClass           :    {dev.bDeviceClass:#04x}")
    print(f" bDeviceSubClass        :    {dev.bDeviceSubClass:#04x}")
    print(f" bDeviceProtocol        :    {dev.bDeviceProtocol:#04x}")
    print(f" bMaxPacketSize0        :   {dev.bMaxPacketSize0:#04x} ({dev.bMaxPacketSize0} bytes)")
    print(f" idVendor               : {dev.idVendor:#06x}")
    print(f" idProduct              : {dev.idProduct:#06x}")
    print(f" bcdDevice              :  {dev.bcdDevice:#06x} Device {dev.bcdDevice >> 8}.{dev.bcdDevice & 0xFF}")
    print(f" iManufacturer          :    {dev.iManufacturer:#04x} {usb.util.get_string(dev, dev.iManufacturer)}")
    print(f" iProduct               :    {dev.iProduct:#04x} {usb.util.get_string(dev, dev.iProduct)}")
    print(f" iSerialNumber          :    {dev.iSerialNumber:#04x} {usb.util.get_string(dev, dev.iSerialNumber)}")
    vendor_name, product_name = get_vendor_product_name(format(dev.idVendor, '04x'), format(dev.idProduct, '04x'), usb_ids)
    print(f" Manufacturer           :    {vendor_name}")
    print(f" Product                :    {product_name}")
    print(f" bNumConfigurations     :    {dev.bNumConfigurations:#04x}")

def print_endpoint_info(ep):
    print(f"   ENDPOINT {ep.bEndpointAddress:02x} ==========================")
    print(f"    bLength          : {ep.bLength:2}")
    print(f"    bDescriptorType  : {ep.bDescriptorType:2}")
    print(f"    bEndpointAddress : {ep.bEndpointAddress:2}")
    print(f"    bmAttributes     : {ep.bmAttributes:2}")
    print(f"    wMaxPacketSize   : {ep.wMaxPacketSize:4}")
    print(f"    bInterval        : {ep.bInterval:2}")
    print(f"    bRefresh         : {ep.bRefresh:2}")
    print(f"    bSynchAddress    : {ep.bSynchAddress:2}")

def print_configuration_info(cfg):
    print(f" CONFIGURATION {cfg.bConfigurationValue}: {cfg.bMaxPower * 2} mA ==================================")
    print(f"   bLength              :    {cfg.bLength:#04x} ({cfg.bLength} bytes)")
    print(f"   bDescriptorType      :    {cfg.bDescriptorType:#04x} Configuration")
    print(f"   wTotalLength         :   {cfg.wTotalLength:#06x} ({cfg.wTotalLength} bytes)")
    print(f"   bNumInterfaces       :    {cfg.bNumInterfaces:#04x}")
    print(f"   bConfigurationValue  :    {cfg.bConfigurationValue:#04x}")
    print(f"   iConfiguration       :    {cfg.iConfiguration:#04x}")
    print(f"   bmAttributes         :   {cfg.bmAttributes:#04x} {get_bm_attributes_str(cfg.bmAttributes)}")
    print(f"   bMaxPower            :   {cfg.bMaxPower:#04x} ({cfg.bMaxPower * 2} mA)")

def get_bm_attributes_str(attributes):
    attributes_str = ""
    # if attributes & 0x80:
    #     attributes_str += "Reserved, "
    if attributes & 0x40:
        attributes_str += "Self Powered, "
    if attributes & 0x20:
        attributes_str += "Remote Wakeup, "
    if attributes & 0x10:
        attributes_str += "Battery Powered, "
    if attributes & 0x08:
        attributes_str += "Supports Settable Wakeup, "
    if attributes & 0x04:
        attributes_str += "Supports Remote Wakeup, "
    if attributes & 0x03:
        attributes_str += "Reserved"
    return attributes_str.rstrip(", ")

def read_voltage_usage(endpoint, size, device):
    try:
        data = device.read(endpoint, size, 100)
        voltage_usage = int.from_bytes(data[8:10], 'little')
        return voltage_usage
    except usb.core.USBError as e:
        print(f"USB error: {e}")
        return None

devices = usb.core.find(find_all=True)

if devices is None:
    raise ValueError("No USB devices found")

usb_ids = parse_usb_ids()

for dev in devices:
    print_device_info(dev)
    
    for cfg in dev:
        print_configuration_info(cfg)
        
        for intf in cfg:
            print(f"  INTERFACE {intf.bInterfaceNumber} ====================================")
            
            for ep in intf:
                # voltage = read_voltage_usage(ep.bEndpointAddress, ep.wMaxPacketSize, dev)
                print_endpoint_info(ep)
                # print(f"    voltage          : {voltage}")
