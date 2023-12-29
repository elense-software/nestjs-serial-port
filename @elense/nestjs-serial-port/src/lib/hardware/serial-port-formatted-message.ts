import {AppMessage, DefaultAppMessage} from "./app-message";

export class SerialPortFormattedMessage {
  static startMessageDelimiter = '<'
  static endMessageDelimiter = '>'

  readonly content: string

  static ofString(message: string): SerialPortFormattedMessage {
    const messageContentBetweenBraces = message.slice(1, message.indexOf(SerialPortFormattedMessage.endMessageDelimiter))

    return new SerialPortFormattedMessage(new DefaultAppMessage(messageContentBetweenBraces.split(',')))
  }

  constructor(readonly appMessage: AppMessage) {
    const content = this.appMessage.data.join(',')
    this.content = `${SerialPortFormattedMessage.startMessageDelimiter}${content}${SerialPortFormattedMessage.endMessageDelimiter}`
  }

  sizeInBytes(): number {
    return Buffer.byteLength(this.content, 'utf-8')
  }
}
