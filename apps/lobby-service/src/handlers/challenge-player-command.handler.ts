import { Socket } from 'socket.io';
import { loggerFactory } from '@api';
import { PlayerRepository } from '../repository/player.repository';
import {
  ChallengePlayerCommandPayload,
  GAME_REQUESTED_EVENT,
  PLAYERS_MATCHED_EVENT,
  PlayersMatchedEventPayload,
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

  public async handle(
    payload: ChallengePlayerCommandPayload,
    ack: (result: { response: boolean; message?: string }) => void
  ): Promise<void> {
    const username = this.socket.data.username;
    const logger = this.logger;

    if (!username) {
      logger.error('ChallengePlayerCommand emitted before authentication');
      return;
    }

    const opponent = payload?.opponent;

    if (!opponent) {
      logger.error('Invalid payload: opponent is missing');
      return;
    }

    logger.info(`Player ${username} challenged ${opponent}`);

    const opponentSocket = this.playerRepository.getSocketByUsername(opponent);

    try {
      const result = await opponentSocket
        .timeout(10000)
        .emitWithAck(GAME_REQUESTED_EVENT, { opponent: username });

      if (result) {
        ack({ response: true });
        const payload: PlayersMatchedEventPayload = {
          gameId: randomUUID(),
          playerA: username,
          playerB: opponent,
        };
        this.socket.emit(PLAYERS_MATCHED_EVENT, payload);
        opponentSocket.emit(PLAYERS_MATCHED_EVENT, payload);
        logger.info(`Players ${username} and ${opponent} matched for a game`);
      } else {
        ack({ response: false, message: 'Opponent refused your challenge.' });
        logger.info(`${opponent} refused the challenge from ${username}`);
      }
    } catch {
      ack({ response: false, message: 'Opponent timed out.' });
      logger.error(
        `Timeout or failure when challenging ${opponent} by ${username}`
      );
    }
  }
}
