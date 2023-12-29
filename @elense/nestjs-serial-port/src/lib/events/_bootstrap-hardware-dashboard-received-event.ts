import {FromHardwareMessage} from "../hardware/from-hardware-message";
import {SerialPortFormattedMessage} from "../hardware/serial-port-formatted-message";

export class _BootstrapHardwareDashboardReceivedEvent implements FromHardwareMessage<_BootstrapHardwareDashboardReceivedEvent> {
  static appEventName = 'from-device._bootstrap'
  static hardwareEventName = '_bootstrap'

  readonly appEventName: string = _BootstrapHardwareDashboardReceivedEvent.appEventName
  readonly hardwareEventName: string = _BootstrapHardwareDashboardReceivedEvent.hardwareEventName;
  readonly exampleMessage: string = "<_bootstrap,button-checkout-master,1>"

  static create(hardwareMessage: SerialPortFormattedMessage): _BootstrapHardwareDashboardReceivedEvent {
    return new _BootstrapHardwareDashboardReceivedEvent()
  }
}
