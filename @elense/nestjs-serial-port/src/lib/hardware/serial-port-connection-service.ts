import {ReadlineParser} from "@serialport/parser-readline";
import {AppMessage} from "./app-message";
import {SerialPortStream} from "@serialport/stream";

export interface SerialPortConnectionService {
  connect(): Promise<void>
  disconnect(): Promise<void>
  write(appMessage: AppMessage): Promise<any>
  readline: {port: SerialPortStream, readlineParser: ReadlineParser}
}

