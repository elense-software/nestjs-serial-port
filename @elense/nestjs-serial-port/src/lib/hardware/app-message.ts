export interface AppMessage {
  readonly data: any[]
  readonly name: string
}

export class DefaultAppMessage implements AppMessage {
  readonly name: string;

  constructor(readonly data: any[]) {
    this.name = data[0]
  }
}
