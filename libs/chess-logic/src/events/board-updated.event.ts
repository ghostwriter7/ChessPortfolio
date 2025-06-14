import { BaseEvent } from './base-event';
import { Piece } from '../types/piece';
import { Position } from '../types/position';

type BoardUpdatedEventPayload = Record<Position, Piece | null>;

export class BoardUpdatedEvent extends BaseEvent<BoardUpdatedEventPayload> {
  constructor(payload: BoardUpdatedEventPayload) {
    super(payload);
  }
}
