export class UnrecognizedHardwareDashboardEventPayload {

  constructor(
    readonly error: unknown,
    readonly value: unknown
  ) {
  }
}

export class _UnrecognizedHardwareDashboardReceivedEvent {
  static appEventName = 'from-device._unrecognized'

  payload: UnrecognizedHardwareDashboardEventPayload

  constructor(payload: UnrecognizedHardwareDashboardEventPayload) {
    this.payload = payload
  }
}
