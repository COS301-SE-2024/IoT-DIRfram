import unittest
# import os
# import sys

# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from get_vendor_product_name import get_vendor_product_name

class TestGetVendorProductName(unittest.TestCase):
    def test_get_vendor_product_name(self):
        usb_ids = {
            '2109': {
                'name': 'VIA Labs, Inc.',
                'products': {
                    '3431': 'Hub'
                }
            }
        }
        vendor_name, product_name = get_vendor_product_name('2109', '3431', usb_ids)
        self.assertEqual(vendor_name, 'VIA Labs, Inc.')
        self.assertEqual(product_name, 'Hub')

        vendor_name, product_name = get_vendor_product_name('5678', 'ijkl', usb_ids)
        self.assertEqual(vendor_name, 'Unknown Vendor')
        self.assertEqual(product_name, 'Unknown Product')

if __name__ == '__main__':
    unittest.main()
