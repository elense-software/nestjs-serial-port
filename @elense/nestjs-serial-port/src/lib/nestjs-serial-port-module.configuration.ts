
export interface NestjsSerialPortModuleConfiguration {
  deviceInfo: DeviceInfo | DevicePath
  baudRate: number
  targetDeviceSerialPortBufferSize: number
  hardwareMessages: object[]
}

export interface DeviceInfo {
  vendorId: string
  productId: string
}

export interface DevicePath {
  devicePath: string
}

