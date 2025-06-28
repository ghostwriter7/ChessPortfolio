import { BaseEvent } from './base-event';

export type PlayersMatchedEventPayload = {
  playerA: string;
  playerB: string;
  gameId: string;
};

export class PlayersMatchedEvent extends BaseEvent<PlayersMatchedEventPayload> {
  constructor(payload: PlayersMatchedEventPayload) {
    super(payload);
  }
}
