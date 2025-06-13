import { BaseCommand } from './base-command';

type LeaveGameCommandPayload = { reason: string };

export class LeaveGameCommand extends BaseCommand<LeaveGameCommandPayload> {
  constructor(payload: LeaveGameCommandPayload) {
    super(payload);
  }
}
