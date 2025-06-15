import { BaseCommand } from './base-command';
import { Position } from '../types/position';

export type MakeMoveCommandPayload = {
  from: Position;
  to: Position;
};

export class MakeMoveCommand extends BaseCommand<MakeMoveCommandPayload> {
  constructor(payload: MakeMoveCommandPayload) {
    super(payload);
  }
}
