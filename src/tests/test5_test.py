import unittest
from unittest.mock import patch, mock_open, MagicMock
import pyudev
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from test5 import parse_usb_ids, get_vendor_product_name, get_usb_info_pyudev

sample_usb_ids_content = """
1234  SmartHome Inc.
    abcd  Smart Home Hub
    efgh  Smart Light Bulb
"""

class TestMyModule(unittest.TestCase):
    # Unit test for parse_usb_ids function
    @patch('builtins.open', new_callable=mock_open, read_data=sample_usb_ids_content)
    def test_parse_usb_ids(self, mock_file):
        expected_output = {
            '1234': {
                'name': 'SmartHome Inc.',
                'products': {
                    'abcd': 'Smart Home Hub',
                    'efgh': 'Smart Light Bulb'
                }
            }
        }
        
        usb_ids = parse_usb_ids('usb.ids')
        self.assertEqual(usb_ids, expected_output)

    # Unit test for get_vendor_product_name function
    def test_get_vendor_product_name(self):
        usb_ids = {
            '1234': {
                'name': 'SmartHome Inc.',
                'products': {
                    'abcd': 'Smart Home Hub'
                }
            }
        }
        
        vendor_name, product_name = get_vendor_product_name('1234', 'abcd', usb_ids)
        self.assertEqual(vendor_name, 'SmartHome Inc.')
        self.assertEqual(product_name, 'Smart Home Hub')
        
        vendor_name, product_name = get_vendor_product_name('5678', 'ijkl', usb_ids)
        self.assertEqual(vendor_name, 'Unknown Vendor')
        self.assertEqual(product_name, 'Unknown Product')

    # Integration test for get_usb_info_pyudev function
    @patch('pyudev.Context')
    def test_get_usb_info_pyudev(self, mock_context):
        mock_device = MagicMock()
        mock_device.device_node = '/dev/bus/usb/001/002'
        mock_device.device_path = '/devices/pci0000:00/0000:00:1d.0/usb1/1-1'
        mock_device.get.side_effect = lambda key, default: {
            'ID_VENDOR_ID': '1234',
            'ID_MODEL_ID': 'abcd',
            'ID_VENDOR': 'SmartHome',
            'ID_MODEL': 'Smart Home Hub',
            'ID_SERIAL_SHORT': 'SH123456'
        }.get(key, default)
        
        mock_context.return_value.list_devices.return_value = [mock_device]
        
        usb_ids = {
            '1234': {
                'name': 'SmartHome Inc.',
                'products': {
                    'abcd': 'Smart Home Hub'
                }
            }
        }
        
        expected_output = [{
            "Device Node": '/dev/bus/usb/001/002',
            "Device Path": '/devices/pci0000:00/0000:00:1d.0/usb1/1-1',
            "Vendor ID": '1234',
            "Product ID": 'abcd',
            "Manufacturer": 'SmartHome',
            "Product": 'Smart Home Hub',
            "Serial": 'SH123456',
            "Vendor Name": 'SmartHome Inc.',
            "Product Name": 'Smart Home Hub'
        }]
        
        devices = get_usb_info_pyudev(usb_ids)
        self.assertEqual(devices, expected_output)


if __name__ == '__main__':
    unittest.main()
