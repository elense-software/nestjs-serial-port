import {FromHardwareMessage} from "../../hardware/from-hardware-message";
import {HardwareMessage} from "../../hardware/hardware-message-decorators";

export const FROM_DEVICE_PIN_VALUE_CHANGED_EVENT = 'from-device.pin-value-changed'

@HardwareMessage('dp', FROM_DEVICE_PIN_VALUE_CHANGED_EVENT, "<dp,10,1>")
export class PinValueChangedHardwareMessage implements FromHardwareMessage<PinValueChangedHardwareMessage> {
  constructor(readonly hardwareEventName: string, readonly pin: string, readonly value: string) {
  }
}
