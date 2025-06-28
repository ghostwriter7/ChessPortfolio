import { BaseEvent } from './base-event';

export type PlayerListChangedEventPayload = { usernames: string[] };

export class PlayerListChangedEvent extends BaseEvent<PlayerListChangedEventPayload> {
  constructor(payload: PlayerListChangedEventPayload) {
    super(payload);
  }
}
