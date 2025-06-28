import { loggerFactory } from '@api';
import {
  ChallengePlayerCommand,
  LoginCommand,
  LoginCommandPayload,
  PlayerLeftEvent,
} from '@chess-logic';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { LoginCommandHandler } from './handlers/login-command.handler';
import { PlayerRepository } from './repository/player.repository';
import { ChallengePlayerCommandHandler } from './handlers/challenge-player-command.handler';

const logger = loggerFactory();

const playerRepository = new PlayerRepository();

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  socket.on(LoginCommand.name, (payload: LoginCommandPayload) => {
    const loginCommandHandler = new LoginCommandHandler(
      socket,
      playerRepository
    );
    if (loginCommandHandler.handle(payload)) {
      const challengePlayerCommandHandler = new ChallengePlayerCommandHandler(
        socket,
        playerRepository
      );

      socket.on(
        ChallengePlayerCommand.name,
        challengePlayerCommandHandler.handle.bind(challengePlayerCommandHandler)
      );
    }
  });

  socket.on('disconnect', async () => {
    const username = socket.data.username;
    if (username) {
      playerRepository.deleteByUsername(username);
      io.emit(PlayerLeftEvent.name, new PlayerLeftEvent({ username }));
      logger.info(`${username} removed from the player list`);
    }
  });
});

server.listen(PORT, () => {
  logger.info(`Lobby-Service is running on port ${PORT}`);
});
