import { BaseCommand } from './base-command';

export type LoginCommandPayload = { token: string };

export class LoginCommand extends BaseCommand<LoginCommandPayload> {
  constructor(payload: LoginCommandPayload) {
    super(payload);
  }
}
