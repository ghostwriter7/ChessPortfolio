import {
  JoinGameCommand,
  JoinGameCommandPayload,
  LogCreatedEvent,
  LOGIN_COMMAND,
  LoginCommandPayload,
} from '@chess-logic';
import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { Game } from './models/game';
import { GameManager } from './services/game-manager';
import {
  createSubscriberService,
  DefaultLoginCommandHandler,
  loggerFactory,
  PlayerRepository,
  PLAYERS_MATCHED,
  PlayersMatchedPayload,
} from '@api';
import { GameRepository } from './repository/game.repository';

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
      gameRepository.addGame(gameId, { white, black });
      logger.info(
        `Game ${gameId} created for players ${white} (white) and ${black} (black)`
      );
    }
  } catch (e) {
    logger.error(`Failed to handle ${PLAYERS_MATCHED} event`, e);
  }
});

const waitingPlayers: Socket[] = [];
const gameIdToGameManagers = new Map<string, GameManager>();
const socketToGameId = new Map<string, string>();

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
    JoinGameCommand.name,
    ({ name }: JoinGameCommandPayload, callback) => {
      console.log(name);
      socket.data.username = name;

      if (waitingPlayers.length === 0) {
        waitingPlayers.push(socket);
        socket.emit(
          LogCreatedEvent.name,
          new LogCreatedEvent('Waiting for another player...')
        );
        callback();
      } else {
        callback();
        socket.emit(
          LogCreatedEvent.name,
          new LogCreatedEvent('Game is about to begin...')
        );
        const opponent = waitingPlayers.shift()!;

        const white = Math.random() > 0.5 ? socket : opponent;
        const black = white === socket ? opponent : socket;

        const game = new Game(white, black);
        const gameManager = new GameManager(game, io);
        const { gameId } = game;
        gameIdToGameManagers.set(gameId, gameManager);

        gameManager.startGame();

        socketToGameId.set(socket.id, gameId);
        socketToGameId.set(opponent.id, gameId);
      }
    }
  );

  socket.on('disconnect', () => {
    console.log(`${socket.data.username} disconnected`);

    const gameId = socketToGameId.get(socket.id);

    if (gameId && gameIdToGameManagers.has(gameId)) {
      const gameManager = gameIdToGameManagers.get(gameId);
      gameManager.handlePlayerDisconnect(socket);

      const opponent = gameManager.getOpponent(socket);

      socketToGameId.delete(socket.id);
      socketToGameId.delete(opponent.id);
      gameIdToGameManagers.delete(gameId);
      gameManager.destroy();

      console.log(`Game ended: ${gameId}}`);
    } else {
      const index = waitingPlayers.findIndex(({ id }) => id === socket.id);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Game-Service is running on port ${PORT}`);
});
