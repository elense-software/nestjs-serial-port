import {DynamicModule, Logger} from '@nestjs/common';
import {NestjsSerialPortModuleConfiguration} from "./nestjs-serial-port-module.configuration";
import {NESTJS_SERIAL_PORT_MODULE_CONFIGURATION} from "./nestjs-serial-port-module.configuration.token";
import {ArduinoSerialPortConnectionService} from "./hardware/arduino.serial.port.connection.service";
import {SerialPortListenerService} from "./hardware/serial-port-listener.service";
import {CqrsModule} from "@nestjs/cqrs";
import {MessageMapper} from "./hardware/message-mapper";
import {SendMessageHandler} from "./commands/send-message.handler";
import {_BootstrapHardwareDashboardEventHandler} from "./event-handlers/_bootstrap-hardware-dashboard-event.handler";
import {_BootstrapHardwareDashboardReceivedEvent} from "./events/_bootstrap-hardware-dashboard-received-event";
import {_UnrecognizedHardwareDashboardReceivedEvent} from "./events/_unrecognized-hardware-dashboard-received-event";
import {
  _UnrecognizedHardwareDashboardEventHandler
} from "./event-handlers/_unrecognized-hardware-dashboard-event.handler";

export class NestjsSerialPortModule {
  static register(configuration: NestjsSerialPortModuleConfiguration): DynamicModule {
    const defaultEvents = [
      _BootstrapHardwareDashboardReceivedEvent,
      _UnrecognizedHardwareDashboardReceivedEvent
    ]

    return {
      module: NestjsSerialPortModule,
      imports: [
        CqrsModule
      ],
      providers: [
        {
          provide: NESTJS_SERIAL_PORT_MODULE_CONFIGURATION, useValue: {
            ...configuration,
            hardwareMessages: [...configuration.hardwareMessages, ...defaultEvents]
          }
        },
        ArduinoSerialPortConnectionService,
        SerialPortListenerService,
        SendMessageHandler,
        MessageMapper,
        _BootstrapHardwareDashboardEventHandler,
        _UnrecognizedHardwareDashboardEventHandler
      ],
      exports: [
        NESTJS_SERIAL_PORT_MODULE_CONFIGURATION,
        ArduinoSerialPortConnectionService
      ]
    };
  }
}
