Here is the entire content in a single markdown file:

```markdown
# Steps to Run the Script

## Ensure pyusb is installed:
```bash
sudo pip install pyusb
```
or
```bash
sudo /usr/bin/python -m pip install pyusb
```

## Ensure script has the appropriate permissions:
```bash
sudo chmod +x test9.py
```

## Run the script with appropriate permissions:
If you face permission issues, run the script with sudo:
```bash
sudo python test9.py
```

## To set up run permissions:
Open the rules file:
```bash
sudo nano /etc/udev/rules.d/99-usb.rules
```
Insert the following line:
```bash
ACTION=="add", SUBSYSTEM=="usb", RUN+="/bin/bash /path/to/p2.sh"
```
Close the file and enter the following into the console:
```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

## Set up the .sh file: `p2.sh`
Ensure the file location for logging is a valid location.

## Ensure the .sh is world executable:
```bash
sudo chmod +x p2.sh
```
```
