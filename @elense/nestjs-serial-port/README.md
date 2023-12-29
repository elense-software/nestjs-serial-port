# nestjs-serial-port

# Overview
This library is a NestJS wrapper around [serialport](https://serialport.io/) library.
Messages received from device are emitted as NestJS events. 
Messages sent to the device can be sent via ArduinoSerialPortConnectionService or via CQRS SendMessageCommand

The message sent to device is put between <>, for example:
<dp,10,1>
- dp - hardwareEventName - the only required field, it's used to identify the message type and determine proper event to be sent in NestJS app
- 10,1 - payload of the event
- Message elements are divided by comma, payload is optional, valid messages are:
- <dp,10,1>, <dp>, <dp,Some name,Another name,12,123.9>, <dp,10,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15>
- Receiving the message from device is done by ReadlineParser which expects the message to be terminated by \n

# How to
- Connect your Serial Device to your machine
- Upload the Arduino code listed below
- Find the device path with `npx @serialport/list` or any other command line tool. Mine is: '/dev/tty.usbserial-1420'
- Specify the configuration params: baudRate and targetDeviceSerialPortBufferSize (for Arduino it's 64)
- Send messages to the device via ArduinoSerialPortConnectionService. Receive messages via NestJS event handlers by defining proper HardwareMessages using @HardwareMessage annotation.


# Example: (Based on empty NestJS project)
- Create the `pin-value-changed-hardware.message` and `pin-value-changed-hardware-message.handler`. 
- Register the `pin-value-changed-hardware-message.handler` as provider
- Register the `pin-value-changed-hardware.message` into the hardwareMessages array in NestjsSerialPortModule config.
- Add calling the arduinoSerialPortConnectionService.connect() in the AppModule constructor
- Add calling the ardu in the AppController

- Calling the controller sends message to the Device <dp,7> which in Arduino code is interpreted as 'Read the digital pin nr 7'. 
- Arduino responds with a hardcoded <dp,7,1> which is interpreted as 'The value of the digital pin nr 7 is 1'. The message is received by the NestJS app and sent to the handler which logs the message.

```typescript
import {Module, OnModuleInit} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import {NestjsSerialPortModule} from "@elense/nestjs-serial-port";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {PinValueChangedHardwareMessage} from "./message/events/pin-value-changed-hardware.message";
import {
  PinValueChangedHardwareMessageHandler
} from "./message/event-handlers/pin-value-changed-hardware-message.handler";
import {
  ArduinoSerialPortConnectionService
} from "@elense/nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    NestjsSerialPortModule.register({
      baudRate: 9600,
      deviceInfo: {devicePath: '/dev/tty.usbserial-1420'}, // Original Arduino: {vendorId: '2341', productId: '0043'};
      targetDeviceSerialPortBufferSize: 64,
      hardwareMessages: [
        PinValueChangedHardwareMessage
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService, PinValueChangedHardwareMessageHandler],
})
export class AppModule implements OnModuleInit {
  constructor(readonly service: ArduinoSerialPortConnectionService) {
  }

  async onModuleInit(): Promise<void> {
    await this.service.connect()
  }
}
```

Message Definition:
```typescript
import {HardwareMessage} from "@elense/nestjs-serial-port/src/lib/hardware/hardware-message-decorators";
import {FromHardwareMessage} from "@elense/nestjs-serial-port/src/lib/hardware/from-hardware-message";

export const FROM_DEVICE_PIN_VALUE_CHANGED_EVENT = 'from-device.pin-value-changed'

@HardwareMessage('dp', FROM_DEVICE_PIN_VALUE_CHANGED_EVENT, "<dp,10,1>")
export class PinValueChangedHardwareMessage implements FromHardwareMessage<PinValueChangedHardwareMessage> {
  constructor(readonly hardwareEventName: string, readonly pin: string, readonly value: string) {
  }
}
```

Message handler:
```typescript
import {OnEvent} from "@nestjs/event-emitter";
import {Injectable, Logger} from "@nestjs/common";
import {
  FROM_DEVICE_PIN_VALUE_CHANGED_EVENT,
  PinValueChangedHardwareMessage
} from "../events/pin-value-changed-hardware.message";

@Injectable()
export class PinValueChangedHardwareMessageHandler {

  constructor() {
  }

  @OnEvent(FROM_DEVICE_PIN_VALUE_CHANGED_EVENT, {async: true})
  async handle(event: PinValueChangedHardwareMessage) {
    Logger.log(`Received event about hardware pin value changed: ${JSON.stringify(event)}`, 'from-device')
  }
}
```

```typescript
import { Controller, Get } from '@nestjs/common';

import {
  ArduinoSerialPortConnectionService
} from "@elense/nestjs-serial-port/src/lib/hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "@elense/nestjs-serial-port/src/lib/hardware/app-message";

@Controller()
export class AppController {
  constructor(private readonly service: ArduinoSerialPortConnectionService) {}

  @Get()
  getData() {
    return this.service.write(new DefaultAppMessage(['dp', '7']))
  }
}

```

Arduino code:

```text
// Example 5 - Receive with start- and end-markers combined with parsing

const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];        // temporary array for use when parsing

      // variables to hold the parsed data
char messageFromPC[numChars] = {0};
int integerFromPC = 0;

boolean newData = false;

//============

void setup() {
    Serial.begin(9600);
    establishContact();
}

//============

void loop() {
    recvWithStartEndMarkers();
    if (newData == true) {
        strcpy(tempChars, receivedChars);
            // this temporary copy is necessary to protect the original data
            //   because strtok() used in parseData() replaces the commas with \0
        parseData();
        showParsedData();
        newData = false;
    }
}

// ===========

void establishContact() {
  while (Serial.available() <= 0) {
      Serial.print("<_bootstrap,Awaiting handshake bootstrap message from server...>");
      Serial.println();

      delay(1000);
  }

  while (Serial.available() > 0) {
      Serial.read();
  }
}

//============

void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;

    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

//============

void parseData() {      // split the data into its parts

    char * strtokIndx; // this is used by strtok() as an index

    strtokIndx = strtok(tempChars,",");      // get the first part - the string
    strcpy(messageFromPC, strtokIndx); // copy it to messageFromPC
 
    strtokIndx = strtok(NULL, ","); // this continues where the previous call left off
    integerFromPC = atoi(strtokIndx);     // convert this part to an integer
}

//============

void showParsedData() {
    Serial.println(String("<dp,") + String(integerFromPC) + String(",") + String(1) + String('>'));
}

```
