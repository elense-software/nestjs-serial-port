import {Module, OnApplicationBootstrap} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {NestjsSerialPortModule} from "@elense/nestjs-serial-port";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {PinValueChangedHardwareMessage} from "./events/pin-value-changed-hardware.message";
import {PinValueChangedHardwareMessageHandler} from "./event-handlers/pin-value-changed-hardware-message.handler";
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
        deviceInfo: {devicePath: '/dev/ttys011'}, // Original Arduino: {vendorId: '2341', productId: '0043'};
        targetDeviceSerialPortBufferSize: 64,
        hardwareMessages: [
          PinValueChangedHardwareMessage
        ]
      })
    ],
      providers: [
      AppService,
      PinValueChangedHardwareMessageHandler
    ],
  controllers: [AppController],
})
export class AppModule implements OnApplicationBootstrap {

  constructor(readonly service: ArduinoSerialPortConnectionService) {
  }

  async onApplicationBootstrap(): Promise<any> {
    await this.service.connect()
  }
}

