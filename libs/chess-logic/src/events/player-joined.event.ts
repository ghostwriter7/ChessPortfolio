import { BaseEvent } from './base-event';

export type PlayerJoinedEventPayload = { username: string };

export class PlayerJoinedEvent extends BaseEvent<PlayerJoinedEventPayload> {
  constructor(payload: PlayerJoinedEventPayload) {
    super(payload);
  }
}
