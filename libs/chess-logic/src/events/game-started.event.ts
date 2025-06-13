import { BaseEvent } from './base-event';
import { Color } from '../types/color';

type GameStartedEventPayload = { color: Color; opponent: string };

export class GameStartedEvent extends BaseEvent<GameStartedEventPayload> {
  constructor(payload: GameStartedEventPayload) {
    super(payload);
  }
}
