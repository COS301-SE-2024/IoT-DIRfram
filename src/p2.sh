echo "start" > /home/aa/error.txt

/usr/bin/python /usr/local/bin/iot/test.py 2>> /home/aa/error.txt

echo "finish" >> /home/aa/error.txt
