import {
  JoinGameCommand,
  JoinGameCommandPayload,
  LogCreatedEvent,
} from '@chess-logic';
import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { Game } from './models/game';
import { GameManager } from './services/game-manager';

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

const waitingPlayers: Socket[] = [];
const gameIdToGameManagers = new Map<string, GameManager>();
const socketToGameId = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('New connection');

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
      gameManager.unsubscribe();

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
  console.log('Server is running on port 3000');
});
