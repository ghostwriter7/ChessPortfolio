import {
  LoginCommandPayload,
  PLAYER_JOINED_EVENT,
  PLAYER_LIST_CHANGED_EVENT,
} from '@chess-logic';
import {
  DefaultLoginCommandHandler,
  loggerFactory,
  PlayerRepository,
} from '@api';
import { Socket } from 'socket.io';

export class LoginCommandHandler extends DefaultLoginCommandHandler {
  protected override readonly logger = loggerFactory({
    service: LoginCommandHandler.name,
  });

  constructor(socket: Socket, playerRepository: PlayerRepository) {
    super(socket, playerRepository);
  }

  public override handle(payload: LoginCommandPayload): boolean {
    if (!super.handle(payload)) return false;

    const usernames = this.playerRepository.getUsernames();

    const socket = this.socket;
    const username = socket.data.username;
    socket.broadcast.emit(PLAYER_JOINED_EVENT, { username });
    socket.emit(PLAYER_LIST_CHANGED_EVENT, { usernames });
    return true;
  }
}
