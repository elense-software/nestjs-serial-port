import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";
import {PortInfo} from "@serialport/bindings-interface"
import {Injectable, Logger} from "@nestjs/common";
import {SerialPortStream} from "@serialport/stream";
import {MockBinding, MockBindingInterface} from "@serialport/binding-mock";
import {AutoDetectTypes} from "@serialport/bindings-cpp";
const { autoDetect } = require('@serialport/bindings-cpp')

@Injectable()
export class SerialPortListenerService {

  async listDevices(): Promise<PortInfo[]> {
    return SerialPort.list()
  }

  async findDevice(findBy: {vendorId: string, productId: string}): Promise<PortInfo | undefined> {
    Logger.log(`Looking for device with vendorId: ${findBy.vendorId} and productId: ${findBy.productId}...`)

    return (await this.listDevices()).find((device: PortInfo) => device.vendorId === findBy.vendorId && device.productId === findBy.productId)
  }

  listen(
    devicePath: string,
    baudRate: number = 9600,
  ): {port: SerialPortStream, readlineParser: ReadlineParser} {

    let binding: AutoDetectTypes | MockBindingInterface = autoDetect()

    if (process.env["NODE_SERIAL_PORT_TEST"]) {
      binding = MockBinding
    }

    const port = new SerialPortStream({ binding, path: devicePath, baudRate: baudRate })

    port.on('readable', function () {
      port.read();
    });

    const readlineParser = port.pipe(new ReadlineParser())

    return {port: port, readlineParser: readlineParser}
  }
}
