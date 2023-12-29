import {OnEvent} from "@nestjs/event-emitter";
import {Injectable, Logger} from "@nestjs/common";
import {_UnrecognizedHardwareDashboardReceivedEvent} from "../events/_unrecognized-hardware-dashboard-received-event";

@Injectable()
export class _UnrecognizedHardwareDashboardEventHandler {

  constructor() {
  }

  @OnEvent(_UnrecognizedHardwareDashboardReceivedEvent.appEventName, {async: true})
  async handle(event: _UnrecognizedHardwareDashboardReceivedEvent) {
    Logger.error(`Received event: ${JSON.stringify(event)}`)
  }
}
