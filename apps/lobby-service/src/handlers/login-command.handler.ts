import {
  LoginCommandPayload,
  PLAYER_JOINED_EVENT,
  PLAYER_LIST_CHANGED_EVENT,
} from '@chess-logic';
import { loggerFactory, verifyToken } from '@api';
import { Socket } from 'socket.io';
import { PlayerRepository } from '../repository/player.repository';

export class LoginCommandHandler {
  private readonly logger = loggerFactory({
    service: LoginCommandHandler.name,
  });

  constructor(
    private readonly socket: Socket,
    private readonly playerRepository: PlayerRepository
  ) {}

  public handle(payload: LoginCommandPayload): void {
    const logger = this.logger;
    const socket = this.socket;

    const token = payload?.token;

    if (!token) {
      socket.disconnect(true);
      logger.error('A player tried to login without a token (disconnected).');
      return;
    }

    let username: string;

    try {
      username = verifyToken<{ username: string }>(token)?.username;
    } catch (e) {
      socket.disconnect(true);
      logger.error(
        `A player's auth token does not contain username property (disconnected).`,
        e
      );
      return;
    }

    if (username) {
      logger.info(`New player authenticated: ${username}`);
      const usernames = this.playerRepository.getUsernames();

      socket.data.username = username;
      this.playerRepository.add(username, socket);

      socket.broadcast.emit(PLAYER_JOINED_EVENT, { username });
      socket.emit(PLAYER_LIST_CHANGED_EVENT, { usernames });
    }
  }
}
