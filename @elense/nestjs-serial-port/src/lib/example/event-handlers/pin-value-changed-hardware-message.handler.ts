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
