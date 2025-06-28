import { Socket } from 'socket.io';
import { loggerFactory } from '@api';
import { PlayerRepository } from '../repository/player.repository';
import {
  ChallengePlayerCommandPayload,
  GameRequestedEvent,
  OpponentRefusedEvent,
  OpponentTimeoutEvent,
  PlayersMatchedEvent,
} from '@chess-logic';
import { randomUUID } from 'node:crypto';

export class ChallengePlayerCommandHandler {
  private readonly logger = loggerFactory({
    service: ChallengePlayerCommandHandler.name,
  });

  constructor(
    private readonly socket: Socket,
    private readonly playerRepository: PlayerRepository
  ) {}

  public async handle(payload: ChallengePlayerCommandPayload): Promise<void> {
    const opponent = payload?.opponent;
    const logger = this.logger;
    const username = this.socket.data.username;

    if (!opponent) {
      logger.error('Invalid payload: opponent is missing');
      return;
    }

    logger.info(`Player ${username} challenged ${opponent}`);

    const opponentSocket = this.playerRepository.getSocketByUsername(opponent);

    try {
      const result = await opponentSocket
        .timeout(10000)
        .emitWithAck(
          GameRequestedEvent.name,
          new GameRequestedEvent({ opponent: username })
        );

      if (result) {
        const event = new PlayersMatchedEvent({
          gameId: randomUUID(),
          playerA: username,
          playerB: opponent,
        });
        this.socket.emit(PlayersMatchedEvent.name, event);
        opponentSocket.emit(PlayersMatchedEvent.name, event);
        logger.info(`Players ${username} and ${opponent} matched for a game`);
      } else {
        this.socket.emit(OpponentRefusedEvent.name);
        logger.info(`${opponent} refused the challenge from ${username}`);
      }
    } catch {
      this.socket.emit(OpponentTimeoutEvent.name);
      logger.error(
        `Timeout or failure when challenging ${opponent} by ${username}`
      );
    }
  }
}
