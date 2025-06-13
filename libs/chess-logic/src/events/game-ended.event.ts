import { BaseEvent } from './base-event';

export type GameEndedEventPayload = string;

export class GameEndedEvent extends BaseEvent<GameEndedEventPayload> {
  constructor(payload: GameEndedEventPayload) {
    super(payload);
  }
}
