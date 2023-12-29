import {OnEvent} from "@nestjs/event-emitter";
import {Injectable, Logger} from "@nestjs/common";
import {_BootstrapHardwareDashboardReceivedEvent} from "../events/_bootstrap-hardware-dashboard-received-event";
import {ArduinoSerialPortConnectionService} from "../hardware/arduino.serial.port.connection.service";

@Injectable()
export class _BootstrapHardwareDashboardEventHandler {

  constructor(readonly arduinoSerialPortConnectionService: ArduinoSerialPortConnectionService){
  }

  @OnEvent(_BootstrapHardwareDashboardReceivedEvent.appEventName, { async: true })
    async handle(event: _BootstrapHardwareDashboardReceivedEvent) {
      Logger.log(`Received event: ${JSON.stringify(event)}`)

      Logger.log(`Exchanging handshake...`)
      await this.arduinoSerialPortConnectionService.write({data: ["A"], name: "_bootstrap"})
      Logger.log(`Connection Established!`)
  }
}

