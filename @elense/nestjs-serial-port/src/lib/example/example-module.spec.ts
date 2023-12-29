import {Test, TestingModule} from '@nestjs/testing'
import {MockBinding, MockPortBinding} from '@serialport/binding-mock'
import {Injectable, Logger, Module} from "@nestjs/common";
import {EventEmitterModule, OnEvent} from "@nestjs/event-emitter";
import {NestjsSerialPortModule} from "@elense/nestjs-serial-port";
import {
  FROM_DEVICE_PIN_VALUE_CHANGED_EVENT,
  PinValueChangedHardwareMessage
} from "./events/pin-value-changed-hardware.message";
import {ArduinoSerialPortConnectionService} from "../hardware/arduino.serial.port.connection.service";
import {DefaultAppMessage} from "../hardware/app-message";
import {CqrsModule} from "@nestjs/cqrs";

const devicePath = '/dev/example'

@Injectable()
export class TestPinValueChangedHardwareMessageHandler {
  readonly events: PinValueChangedHardwareMessage[] = []

  constructor() {
  }

  @OnEvent(FROM_DEVICE_PIN_VALUE_CHANGED_EVENT, {async: true})
  async handle(event: PinValueChangedHardwareMessage) {
    this.events.push(event)
    Logger.log(`Received event about hardware pin value changed: ${JSON.stringify(event)}`, 'from-device')
  }
}

@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    NestjsSerialPortModule.register({
      baudRate: 250000,
      deviceInfo: {devicePath: devicePath}, // Original Arduino: {vendorId: '2341', productId: '0043'};
      targetDeviceSerialPortBufferSize: 64,
      hardwareMessages: [
        PinValueChangedHardwareMessage
      ]
    })
  ],
    providers: [
      TestPinValueChangedHardwareMessageHandler
  ]
})
export class ExampleTestModule {
}

describe('Test', function () {

  let arduinoSerialPortConnectionService: ArduinoSerialPortConnectionService
  let testPinValueChangedHardwareMessageHandler: TestPinValueChangedHardwareMessageHandler

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ExampleTestModule,
      ],
    }).compile()

    await moduleFixture.init()

    arduinoSerialPortConnectionService = moduleFixture.get(ArduinoSerialPortConnectionService)
    testPinValueChangedHardwareMessageHandler = moduleFixture.get(TestPinValueChangedHardwareMessageHandler)

    process.env["NODE_SERIAL_PORT_TEST"] = 'true'

    MockBinding.reset()
    MockBinding.createPort(devicePath, {echo: true, record: true})
  })

  describe('Ok ', function () {
    it('writing should work', async function () {
      await arduinoSerialPortConnectionService.connect()

      await arduinoSerialPortConnectionService.write(new DefaultAppMessage(["dp", "1", "1"]))
      await arduinoSerialPortConnectionService.write(new DefaultAppMessage(["dp", "2", "1"]))

      const port: MockPortBinding = arduinoSerialPortConnectionService.readline.port.port as unknown as MockPortBinding

      const messages = port.recording.toString()

      expect(messages).toEqual('<dp,1,1><dp,2,1>')
    })

    it('receiving should work', async function () {
      await arduinoSerialPortConnectionService.connect()
      await arduinoSerialPortConnectionService.write(new DefaultAppMessage(["dp", 1, 1]))

      const port: MockPortBinding = arduinoSerialPortConnectionService.readline.port.port as unknown as MockPortBinding

      port.emitData('<dp,1,1>\n')
      port.emitData('<dp,3,0>\n')

      let events = []
      do {
        events = testPinValueChangedHardwareMessageHandler.events

        await sleep(10)
      } while (events.length < 2)

      expect(events[0]).toEqual(new PinValueChangedHardwareMessage("dp", "1", "1"))
      expect(events[1]).toEqual(new PinValueChangedHardwareMessage("dp", "3", "0"))
    })
  })
})

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
