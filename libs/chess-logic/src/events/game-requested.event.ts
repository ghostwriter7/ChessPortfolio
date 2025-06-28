import { BaseEvent } from './base-event';

export type GameRequestedEventPayload = {
  opponent: string;
};

export class GameRequestedEvent extends BaseEvent<GameRequestedEventPayload> {
  constructor(payload: GameRequestedEventPayload) {
    super(payload);
  }
}
