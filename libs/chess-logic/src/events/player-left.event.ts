import { BaseEvent } from './base-event';

export type PlayerLeftEventPayload = { username: string };

export class PlayerLeftEvent extends BaseEvent<PlayerLeftEventPayload> {
  constructor(payload: PlayerLeftEventPayload) {
    super(payload);
  }
}
