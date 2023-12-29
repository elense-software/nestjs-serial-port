import {Inject} from "@nestjs/common";
import {NESTJS_SERIAL_PORT_MODULE_CONFIGURATION} from "./nestjs-serial-port-module.configuration.token";

export const InjectSerialPortConfig = () => Inject(NESTJS_SERIAL_PORT_MODULE_CONFIGURATION) // {vendorId: '1a86', productId: '7523'}
