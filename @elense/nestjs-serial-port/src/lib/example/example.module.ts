import {Module} from '@nestjs/common';
import {NestjsSerialPortModule} from "@elense/nestjs-serial-port";
import {PinValueChangedHardwareMessage} from "./events/pin-value-changed-hardware.message";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {PinValueChangedHardwareMessageHandler} from "./event-handlers/pin-value-changed-hardware-message.handler";

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    NestjsSerialPortModule.register({
      baudRate: 250000,
      deviceInfo: {devicePath: '/dev/tty.usbserial-1410'}, // Original Arduino: {vendorId: '2341', productId: '0043'};
      targetDeviceSerialPortBufferSize: 64,
      hardwareMessages: [
        PinValueChangedHardwareMessage
      ]
    })
  ],
  providers: [
    PinValueChangedHardwareMessageHandler
  ]
})
export class ExampleModule {

}
