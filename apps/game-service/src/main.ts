import {
  JOIN_GAME_COMMAND,
  JoinGameCommandCallback,
  JoinGameCommandPayload,
  LOG_CREATED_EVENT,
  LOGIN_COMMAND,
  LoginCommandPayload,
} from '@chess-logic';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { GameManager } from './services/game-manager';
import {
  createSubscriberService,
  DefaultLoginCommandHandler,
  loggerFactory,
  PlayerRepository,
  PLAYERS_MATCHED,
  PlayersMatchedPayload,
} from '@api';
import {
  GameId,
  GameMetadata,
  GameRepository,
} from './repository/game.repository';

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);
const logger = loggerFactory();
const gameRepository = new GameRepository();

const subscriberService = await createSubscriberService();
await subscriberService.subscribe(PLAYERS_MATCHED);
await subscriberService.run(async ({ topic, message, partition }) => {
  logger.info(`Received message from ${topic} [${partition}]`);

  try {
    const { gameId, playerA, playerB } = JSON.parse(
      message.value.toString()
    ) as PlayersMatchedPayload;

    if (gameId && playerA && playerB) {
      const white = Math.random() > 0.5 ? playerA : playerB;
      const black = white === playerA ? playerB : playerA;
      gameRepository.addGame(gameId, { gameId, white, black });
      logger.info(
        `Game ${gameId} created for players ${white} (white) and ${black} (black)`
      );
    }
  } catch (e) {
    logger.error(`Failed to handle ${PLAYERS_MATCHED} event`, e);
  }
});

const gameIdToGameManagers = new Map<GameId, GameManager>();
const socketToGameId = new Map<string, GameId>();

const playerRepository = new PlayerRepository();

io.on('connection', (socket) => {
  logger.info('New connection');

  const loginCommandHandler = new DefaultLoginCommandHandler(
    socket,
    playerRepository
  );
  socket.on(LOGIN_COMMAND, (payload: LoginCommandPayload) =>
    loginCommandHandler.handle(payload)
  );

  socket.on(
    JOIN_GAME_COMMAND,
    async (
      { gameId }: JoinGameCommandPayload,
      callback: JoinGameCommandCallback
    ) => {
      const { username } = socket.data;

      if (!username) {
        callback('You must be logged in to join a game', 'AUTH_ERROR');
        return;
      }

      let game: GameMetadata;
      for (let i = 0; i < 3; i++) {
        game = gameRepository.getGameById(gameId);

        if (game) break;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        logger.info(`Game ${gameId} not found, retrying in 1s...`);
      }

      if (!game) {
        logger.error(`Game ${gameId} not found`);
        callback('Game not found', 'GAME_NOT_FOUND');
        return;
      }

      const color = game.white === username ? 'white' : 'black';
      socketToGameId.set(socket.id, gameId);

      if (!gameIdToGameManagers.has(gameId)) {
        const newGameManager = new GameManager(gameId, io);
        gameIdToGameManagers.set(gameId, newGameManager);
        newGameManager.setSocket(color, socket);
        socket.emit(
          LOG_CREATED_EVENT,
          'Game is about to start, waiting for your opponent to join...'
        );
      } else {
        const gameManager = gameIdToGameManagers.get(gameId);
        gameManager.setSocket(color, socket);
        gameManager.startGame();
      }
    }
  );

  socket.on('disconnect', () => {
    logger.info(`${socket.data.username} disconnected`);

    const gameId = socketToGameId.get(socket.id);

    if (gameId && gameIdToGameManagers.has(gameId)) {
      const gameManager = gameIdToGameManagers.get(gameId);
      gameManager.handlePlayerDisconnect(socket);

      const opponent = gameManager.getOpponent(socket);

      socketToGameId.delete(socket.id);
      socketToGameId.delete(opponent.id);
      gameIdToGameManagers.delete(gameId);
      gameManager.destroy();

      logger.info(
        `Game ended: ${gameId}} due to ${socket.data.username} disconnect`
      );
    }
  });
});

server.listen(PORT, () => {
  logger.info(`Game-Service is running on port ${PORT}`);
});
