def get_vendor_product_name(vendor_id, product_id, usb_ids):
    vendor_info = usb_ids.get(vendor_id, {'name': 'Unknown Vendor', 'products': {}})
    vendor_name = vendor_info['name']
    product_name = vendor_info['products'].get(product_id, 'Unknown Product')
    return vendor_name, product_name
