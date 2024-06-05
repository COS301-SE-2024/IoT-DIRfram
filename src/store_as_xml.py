import xml.etree.ElementTree as ET
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
    device_elem = ET.Element("Device")
    device_elem.set("idVendor", f"{dev.idVendor:04x}")
    device_elem.set("idProduct", f"{dev.idProduct:04x}")
    device_elem.set("bus", f"{dev.bus:03}")
    device_elem.set("address", f"{dev.address:03}")
    
    ET.SubElement(device_elem, "bLength").text = f"{dev.bLength:#04x}"
    ET.SubElement(device_elem, "bDescriptorType").text = f"{dev.bDescriptorType:#04x}"
    ET.SubElement(device_elem, "bcdUSB").text = f"{dev.bcdUSB:#06x}"
    ET.SubElement(device_elem, "bDeviceClass").text = f"{dev.bDeviceClass:#04x}"
    ET.SubElement(device_elem, "bDeviceSubClass").text = f"{dev.bDeviceSubClass:#04x}"
    ET.SubElement(device_elem, "bDeviceProtocol").text = f"{dev.bDeviceProtocol:#04x}"
    ET.SubElement(device_elem, "bMaxPacketSize0").text = f"{dev.bMaxPacketSize0:#04x}"
    ET.SubElement(device_elem, "bcdDevice").text = f"{dev.bcdDevice:#06x}"
    ET.SubElement(device_elem, "iManufacturer").text = f"{dev.iManufacturer:#04x} {usb.util.get_string(dev, dev.iManufacturer)}"
    ET.SubElement(device_elem, "iProduct").text = f"{dev.iProduct:#04x} {usb.util.get_string(dev, dev.iProduct)}"
    ET.SubElement(device_elem, "iSerialNumber").text = f"{dev.iSerialNumber:#04x} {usb.util.get_string(dev, dev.iSerialNumber)}"
    vendor_name, product_name = get_vendor_product_name(format(dev.idVendor, '04x'), format(dev.idProduct, '04x'), usb_ids)
    ET.SubElement(device_elem, "Manufacturer").text = vendor_name
    ET.SubElement(device_elem, "Product").text = product_name
    ET.SubElement(device_elem, "bNumConfigurations").text = f"{dev.bNumConfigurations:#04x}"
    
    return device_elem

def print_configuration_info(cfg):
    configuration_elem = ET.Element("Configuration")
    configuration_elem.set("bConfigurationValue", f"{cfg.bConfigurationValue:#04x}")
    configuration_elem.set("bMaxPower", f"{cfg.bMaxPower * 2}")
    
    ET.SubElement(configuration_elem, "bLength").text = f"{cfg.bLength:#04x}"
    ET.SubElement(configuration_elem, "bDescriptorType").text = f"{cfg.bDescriptorType:#04x}"
    ET.SubElement(configuration_elem, "wTotalLength").text = f"{cfg.wTotalLength:#06x}"
    ET.SubElement(configuration_elem, "bNumInterfaces").text = f"{cfg.bNumInterfaces:#04x}"
    ET.SubElement(configuration_elem, "iConfiguration").text = f"{cfg.iConfiguration:#04x}"
    ET.SubElement(configuration_elem, "bmAttributes").text = f"{cfg.bmAttributes:#04x}"
    ET.SubElement(configuration_elem, "bMaxPower").text = f"{cfg.bMaxPower:#04x} ({cfg.bMaxPower * 2} mA)"
    
    return configuration_elem

def print_endpoint_info(ep):
    endpoint_elem = ET.Element("Endpoint")
    endpoint_elem.set("bEndpointAddress", f"{ep.bEndpointAddress:02x}")
    
    ET.SubElement(endpoint_elem, "bLength").text = f"{ep.bLength:2}"
    ET.SubElement(endpoint_elem, "bDescriptorType").text = f"{ep.bDescriptorType:2}"
    ET.SubElement(endpoint_elem, "bmAttributes").text = f"{ep.bmAttributes:2}"
    ET.SubElement(endpoint_elem, "wMaxPacketSize").text = f"{ep.wMaxPacketSize:4}"
    ET.SubElement(endpoint_elem, "bInterval").text = f"{ep.bInterval:2}"
    ET.SubElement(endpoint_elem, "bRefresh").text = f"{ep.bRefresh:2}"
    ET.SubElement(endpoint_elem, "bSynchAddress").text = f"{ep.bSynchAddress:2}"
    
    return endpoint_elem

def write_to_xml(devices):
    root = ET.Element("Devices")
    for dev in devices:
        device_elem = print_device_info(dev)
        root.append(device_elem)
        
        for cfg in dev:
            configuration_elem = print_configuration_info(cfg)
            device_elem.append(configuration_elem)
            
            for intf in cfg:
                interface_elem = ET.Element("Interface")
                interface_elem.set("bInterfaceNumber", f"{intf.bInterfaceNumber}")
                configuration_elem.append(interface_elem)
                
                for ep in intf:
                    endpoint_elem = print_endpoint_info(ep)
                    interface_elem.append(endpoint_elem)
                    
    tree = ET.ElementTree(root)
    tree.write("device_data.xml", encoding="utf-8", xml_declaration=True)

devices = usb.core.find(find_all=True)

if devices is None:
    raise ValueError("No USB devices found")

usb_ids = parse_usb_ids()

write_to_xml(devices)
