import {DynamicModule} from '@nestjs/common';
import {NestjsSerialPortModuleConfiguration} from "./nestjs-serial-port-module.configuration";
import {NESTJS_SERIAL_PORT_MODULE_CONFIGURATION} from "./nestjs-serial-port-module.configuration.token";
import {ArduinoSerialPortConnectionService} from "./hardware/arduino.serial.port.connection.service";
import {SerialPortListenerService} from "./hardware/serial-port-listener.service";
import {CqrsModule} from "@nestjs/cqrs";
import {MessageMapper} from "./hardware/message-mapper";

export class NestjsSerialPortModule {
  static register(configuration: NestjsSerialPortModuleConfiguration): DynamicModule {
    return {
      module: NestjsSerialPortModule,
      imports: [
        CqrsModule
      ],
      providers: [
        {
          provide: NESTJS_SERIAL_PORT_MODULE_CONFIGURATION, useValue: {
            ...configuration,
            hardwareMessages: configuration.hardwareMessages
          }
        },
        ArduinoSerialPortConnectionService,
        SerialPortListenerService,
        MessageMapper,
      ],
      exports: [
        NESTJS_SERIAL_PORT_MODULE_CONFIGURATION,
        ArduinoSerialPortConnectionService
      ]
    };
  }
}
