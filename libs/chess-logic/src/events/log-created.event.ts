import { BaseEvent } from './base-event';

export class LogCreatedEvent extends BaseEvent<string> {
  constructor(payload: string) {
    super(payload);
  }
}
