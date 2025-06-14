import { BaseCommand } from './base-command';
import { Position } from '../types/position';

type MakeMovePayload = {
  from: Position;
  to: Position;
};

export class MakeMoveCommand extends BaseCommand<MakeMovePayload> {
  constructor(payload: MakeMovePayload) {
    super(payload);
  }
}
