import { createBrokerService, loggerFactory, PlayerRepository } from '@api';
import {
  CHALLENGE_PLAYER_COMMAND,
  ChallengePlayerCommandPayload,
  LOGIN_COMMAND,
  LoginCommandPayload,
  PLAYER_LEFT_EVENT,
} from '@chess-logic';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { LoginCommandHandler } from './handlers/login-command.handler';
import { ChallengePlayerCommandHandler } from './handlers/challenge-player-command.handler';

const logger = loggerFactory();

const playerRepository = new PlayerRepository();
const broker = await createBrokerService();

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  const loginCommandHandler = new LoginCommandHandler(socket, playerRepository);
  socket.on(LOGIN_COMMAND, (payload: LoginCommandPayload) =>
    loginCommandHandler.handle(payload)
  );

  const challengePlayerCommandHandler = new ChallengePlayerCommandHandler(
    socket,
    playerRepository,
    broker
  );
  socket.on(
    CHALLENGE_PLAYER_COMMAND,
    (payload: ChallengePlayerCommandPayload, ack) =>
      challengePlayerCommandHandler.handle(payload, ack)
  );

  socket.on('disconnect', async () => {
    const username = socket.data.username;
    if (username) {
      playerRepository.deleteByUsername(username);
      io.emit(PLAYER_LEFT_EVENT, { username });
      logger.info(`${username} removed from the player list`);
    }
  });
});

server.listen(PORT, () => {
  logger.info(`Lobby-Service is running on port ${PORT}`);
});
