import {HardwareMessage} from "@elense/nestjs-serial-port/src/lib/hardware/hardware-message-decorators";
import {FromHardwareMessage} from "@elense/nestjs-serial-port/src/lib/hardware/from-hardware-message";

export const FROM_DEVICE_PIN_VALUE_CHANGED_EVENT = 'event-name'

@HardwareMessage(FROM_DEVICE_PIN_VALUE_CHANGED_EVENT)
export class PinValueChangedHardwareMessage implements FromHardwareMessage<PinValueChangedHardwareMessage> {
  constructor(readonly hardwareEventName: string, readonly pin: string, readonly value: string) {
  }
}
