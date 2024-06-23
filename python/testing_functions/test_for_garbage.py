import re

# Regex to identify garbage lines
garbage_regex = re.compile(r"[^\x00-\x7F]")

# Path to the text file
file_path = 'log_115200.txt'

# Read the file and check each line
with open(file_path, 'r', encoding='utf-8') as file:
    for line_num, line in enumerate(file, start=1):
        if garbage_regex.search(line):
            print(f"Garbage detected in line {line_num}: {line.strip()}")
        # else:
        #     print(f"Normal text in line {line_num}: {line.strip()}")
