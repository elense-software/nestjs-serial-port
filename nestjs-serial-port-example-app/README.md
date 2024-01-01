Setup Virtual Serial Port
socat -d -d pty,raw,echo=0,ospeed=9600,ispeed=9600 pty,raw,echo=0,ospeed=9600,ispeed=9600

Send messages:
echo "text" > /dev/device-identifier
