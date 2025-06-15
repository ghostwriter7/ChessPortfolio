import { BaseEvent } from './base-event';
import { Board } from '../types/board';

type BoardUpdatedEventPayload = Partial<Board>;

export class BoardUpdatedEvent extends BaseEvent<BoardUpdatedEventPayload> {
  constructor(payload: BoardUpdatedEventPayload) {
    super(payload);
  }
}
