import { BaseCommand } from './base-command';

export type ChallengePlayerCommandPayload = { opponent: string };

export class ChallengePlayerCommand extends BaseCommand<ChallengePlayerCommandPayload> {
  constructor(payload: ChallengePlayerCommandPayload) {
    super(payload);
  }
}
