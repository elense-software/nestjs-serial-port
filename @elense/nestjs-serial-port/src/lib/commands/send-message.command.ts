import {AppMessage} from "../hardware/app-message";

export class SendMessageCommand {
  constructor(readonly message: AppMessage) {
  }
}

