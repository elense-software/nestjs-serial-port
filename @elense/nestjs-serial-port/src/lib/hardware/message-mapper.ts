import {SerialPortFormattedMessage} from "./serial-port-formatted-message";
import {Inject, Injectable} from "@nestjs/common";
import {AppMessage} from "./app-message";
import {
  NestjsSerialPortModuleConfiguration
} from "../nestjs-serial-port-module.configuration";
import {NESTJS_SERIAL_PORT_MODULE_CONFIGURATION} from "../nestjs-serial-port-module.configuration.token";

@Injectable()
export class MessageMapper {
  constructor(@Inject(NESTJS_SERIAL_PORT_MODULE_CONFIGURATION) readonly config: NestjsSerialPortModuleConfiguration) {
  }

  toSerialPortFormattedMessage(message: AppMessage): SerialPortFormattedMessage {
    const serialPortMessage = new SerialPortFormattedMessage(message)

    if (serialPortMessage.sizeInBytes() > this.config.targetDeviceSerialPortBufferSize) {
      throw new Error(`Message size in bytes ${serialPortMessage.sizeInBytes()} exceeds the target device serial port buffer size ${this.config.targetDeviceSerialPortBufferSize}!`)
    }

    return serialPortMessage
  }

  fromRawString(value: string): SerialPortFormattedMessage {
    return SerialPortFormattedMessage.ofString(value)
  }
}
