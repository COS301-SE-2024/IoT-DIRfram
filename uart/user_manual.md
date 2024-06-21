# User Manual for Setting Up a Project on Raspberry Pi

## Overview
This manual provides detailed steps for setting up a project on a Raspberry Pi. The setup involves placing a repository in the `/usr/local/bin` directory, creating a udev rule, installing necessary packages and services, granting appropriate permissions, and ensuring required Python dependencies are installed.

## Prerequisites
- A Raspberry Pi running a Linux-based OS
- Sudo privileges on the Raspberry Pi
- Network access for installing packages

## Step-by-Step Instructions

### 1. Place the Repository in /usr/local/bin
Copy or clone your project repository to the `/usr/local/bin` directory:

```bash
sudo git clone https://github.com/COS301-SE-2024/IoT-DIRfram.git /usr/local/bin/
```

### 2. Create the udev Rule
Create a udev rule to trigger a script when a USB device is added. Create the file /etc/udev/rules.d/99-usb-logger.rules with the following content:

```bash
sudo nano /etc/udev/rules.d/99-usb-logger.rules
```

Add the following line to the file:

```bash
ACTION=="add", SUBSYSTEM=="tty", RUN+="/bin/sh -c '/usr/local/bin/p1.sh %k | at now'"
```

Save and close the file.

### 3. Install Necessary Packages and Services
Install the at package and ensure the atd service is enabled and started:

```bash
sudo apt update
sudo apt install --no-install-recommends at
sudo systemctl enable atd
sudo systemctl start atd
```

### 4. Grant Permissions
Ensure the script p1.sh and the Python script uart.py have the necessary permissions:

```bash
sudo chmod +x /usr/local/bin/p1.sh
sudo chmod +x /usr/local/bin/iot/uart.py
```

###5. Install Python Dependencies
Ensure the necessary Python dependencies are installed. These dependencies include pyserial, argparse, pymongo, and others.

Install the dependencies in requirements.txt using pip:

```bash
pip install -r /usr/local/bin/requirements.txt
```

### 6. Verify Installation
To verify the installation, connect a USB device and ensure that the p1.sh script is triggered and runs correctly. Check the logs to confirm that there are no errors.

The log file is in /usr/local/bin/usb_devices.log

Troubleshooting
Permission Issues: Ensure all scripts have the correct execute permissions.
Service Issues: Ensure the atd service is running by checking its status: sudo systemctl status atd.
Dependency Issues: Ensure all Python dependencies are installed correctly.
Conclusion
Following these steps will set up your project on the Raspberry Pi, enabling it to automatically execute scripts upon USB device connection. Ensure all steps are followed carefully and verify each component to ensure proper setup and functionality.