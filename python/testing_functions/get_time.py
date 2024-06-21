import time

# Get the current time
last_received_time = time.time()

# Format the current time as a human-readable string
formatted_time = time.strftime('%Y/%m/%d-%H:%M:%S', time.localtime(last_received_time))

# Create the log filename using the formatted time
log_filename = f'log_{formatted_time}.txt'

print(log_filename)  # Example output: log_2024-06-14-13-45-30.txt
