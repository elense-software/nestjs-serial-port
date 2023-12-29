import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SendMessageCommand} from "./send-message.command";
import {ArduinoSerialPortConnectionService} from "../hardware/arduino.serial.port.connection.service";
import {Logger} from "@nestjs/common";

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {

  constructor(readonly arduinoService: ArduinoSerialPortConnectionService) {
  }

  async execute(command: SendMessageCommand): Promise<any> {
    Logger.log(`Sending message: ${JSON.stringify(command.message)} to device`, 'to-device')

    return this.arduinoService.write(command.message)
  }
}
