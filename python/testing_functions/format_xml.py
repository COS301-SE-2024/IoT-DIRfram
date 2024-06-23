import re
import xml.etree.ElementTree as ET

def sanitize_text(text):
    # Define a regex pattern to match invalid XML characters
    invalid_xml_chars = re.compile(
        '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uD800-\uDFFF\uFDD0-\uFDEF\uFFFE\uFFFF]'
        '|[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD]', 
        re.UNICODE
    )
    return invalid_xml_chars.sub('', text)

# Read the input text from a file
with open('log_115200_uart.txt', 'r') as file:
    data = file.read()

# Sanitize the entire input data
data = sanitize_text(data)

# Split the data into sections based on two or more consecutive newlines
sections = re.split(r'\n{3,}', data.strip())

# Create the root XML element
root = ET.Element("root")

# Add each section as a child element to the root
for i, section in enumerate(sections):
    section_element = ET.SubElement(root, f"section_{i + 1}")
    section_element.text = section

# Create an ElementTree object and write it to an XML file
tree = ET.ElementTree(root)
tree.write("output.xml", encoding='utf-8', xml_declaration=True)

print("XML file 'output.xml' has been created.")
