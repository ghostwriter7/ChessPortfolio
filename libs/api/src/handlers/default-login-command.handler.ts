import { LoginCommandPayload } from '@chess-logic';
import { Socket } from 'socket.io';
import { PlayerRepository } from '../repository/player.repository';
import { loggerFactory } from '../logger/logger-factory';
import { verifyToken } from '../jwt/verify-token';

export class DefaultLoginCommandHandler {
  protected readonly logger = loggerFactory({
    service: DefaultLoginCommandHandler.name,
  });

  constructor(
    protected readonly socket: Socket,
    protected readonly playerRepository: PlayerRepository
  ) {}

  public handle(payload: LoginCommandPayload): boolean {
    const logger = this.logger;
    const socket = this.socket;

    const token = payload?.token;

    if (!token) {
      socket.disconnect(true);
      logger.error('A player tried to login without a token (disconnected).');
      return false;
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
      return false;
    }

    if (username) {
      const existingSocket =
        this.playerRepository.getSocketByUsername(username);
      if (existingSocket) {
        logger.warn(
          `Player ${username} tried to login again (existing socket disconnected).`
        );
        existingSocket.disconnect(true);
        this.playerRepository.deleteByUsername(username);
      }

      logger.info(`New player authenticated: ${username}`);
      socket.data.username = username;
      this.playerRepository.add(username, socket);

      return true;
    }

    return false;
  }
}
