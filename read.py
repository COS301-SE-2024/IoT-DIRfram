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

def main():
    print("USB Info from pyudev:")
    usb_ids = parse_usb_ids()
    vendor_name, product_name = get_vendor_product_name('058f', '6387', usb_ids)
    print(vendor_name)
    print(product_name)
if __name__ == "__main__":
    main()