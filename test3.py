import usb.util

# Find a specific USB device by Vendor ID and Product ID
dev = usb.core.find(idVendor=0x29da, idProduct=0x000a)

# Check if the device is found
if dev is None:
    raise ValueError('Device not found')

# Get device descriptor
dev_desc = dev.get_device_descriptor()

# Print device information
print("Device ID: {:04x}:{:04x} on Bus {:03d} Address {:03d}".format(
    dev_desc.idVendor, dev_desc.idProduct, dev.bus, dev.address))
print("bcdUSB:", hex(dev_desc.bcdUSB))
print("bDeviceClass:", hex(dev_desc.bDeviceClass))
print("bDeviceSubClass:", hex(dev_desc.bDeviceSubClass))
print("bDeviceProtocol:", hex(dev_desc.bDeviceProtocol))
print("bMaxPacketSize0:", dev_desc.bMaxPacketSize0)
print("iManufacturer:", dev_desc.iManufacturer)
print("iProduct:", dev_desc.iProduct)
print("iSerialNumber:", dev_desc.iSerialNumber)
print("bNumConfigurations:", dev_desc.bNumConfigurations)

# Detach kernel driver if active
if dev.is_kernel_driver_active(0):
    dev.detach_kernel_driver(0)

# Reset the device
dev.reset()

# Reattach the kernel driver
usb.util.dispose_resources(dev)
