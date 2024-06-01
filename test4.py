import usb.core

# Find all USB devices
devices = usb.core.find(find_all=True)

# Loop through each device
for device in devices:
    # Print device information
    print(device)
