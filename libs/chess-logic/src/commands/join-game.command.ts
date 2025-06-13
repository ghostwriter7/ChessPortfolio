import { BaseCommand } from './base-command';

export type JoinGameCommandPayload = { name: string };

export class JoinGameCommand extends BaseCommand<JoinGameCommandPayload> {
  constructor(payload: JoinGameCommandPayload) {
    super(payload);
  }
}
