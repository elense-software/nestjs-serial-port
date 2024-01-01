import {HardwareMessage} from "./hardware-message-decorators";
import {SerialPortFormattedMessage} from "./serial-port-formatted-message";

export const APP_EVENT_NAME_PROP = 'appEventName'
export const HARDWARE_EVENT_NAME_PROP = 'hardwareEventName'
export const CREATE_EVENT_FUNC = 'create'

@HardwareMessage('hardware-message', 'app-test-message', "<dp,10,1>")
class TestHardwareMessage {
  readonly prop: string

  constructor(readonly firstComponent: string, readonly secondComponent: string, readonly thirdComponent: string) {
    this.prop = "This value was set in original message constructor"
  }
}

describe('Hardware Message Decorators', function () {
  describe('HardwareMessage', function () {
    it('should set app event name', function () {

      // @ts-ignore
      const appEventName = TestHardwareMessage[APP_EVENT_NAME_PROP]

      expect(appEventName).toEqual("app-test-message")
    });

    it('should set hardware message name', function () {

      // @ts-ignore
      const appEventName = TestHardwareMessage[HARDWARE_EVENT_NAME_PROP]

      expect(appEventName).toEqual("hardware-message")
    });

    it('should generate proper factory method', function () {

      // @ts-ignore
      const instance: TestHardwareMessage = TestHardwareMessage[CREATE_EVENT_FUNC](SerialPortFormattedMessage.ofString("<dp,10,1>"))

      expect(instance.prop).toEqual("This value was set in original message constructor")
      expect(instance.firstComponent).toEqual("dp")
      expect(instance.secondComponent).toEqual("10")
      expect(instance.thirdComponent).toEqual("1")
    });
  });
});
