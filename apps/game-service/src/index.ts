import {
  Board,
  BoardUpdatedEvent,
  Color,
  GameEndedEvent,
  GameStartedEvent,
  getOppositeColor,
  JoinGameCommand,
  JoinGameCommandPayload,
  LeaveGameCommand,
  LogCreatedEvent,
  MakeMoveCommand,
  MakeMoveCommandPayload,
  UntouchedBoard,
} from '@chess-logic';
import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { MakeMoveCommandValidator } from './validators/make-move-command.validator';

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

const waitingPlayers: Socket[] = [];
const games = new Map<
  string,
  {
    activeColor: Color;
    board: Board;
    white: Socket;
    black: Socket;
    players: Map<string, Socket>;
  }
>();
const socketToGameId = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('New connection');

  socket.on(LeaveGameCommand.name, () => {
    leaveGame(socket);
    socket.disconnect();
  });

  socket.on(MakeMoveCommand.name, (command: MakeMoveCommandPayload) => {
    const gameId = socketToGameId.get(socket.id);

    const game = games.get(gameId);
    const { activeColor, board } = game;

    if (!MakeMoveCommandValidator.validate(board, activeColor, command)) {
      console.error(`Invalid move command sent by ${socket.data.username}`);
      return;
    }

    const { from, to } = command;
    const startPiece = board[from];

    console.log(
      `A valid move was made: ${from} -> ${to} by ${socket.data.username} (${activeColor})`
    );

    const capturedPiece = board[to];
    const boardUpdate: Partial<Board> = {
      [to]: { ...startPiece, untouched: false },
      [from]: null,
    };
    game.board = { ...board, ...boardUpdate };
    game.activeColor = getOppositeColor(activeColor);

    // need to check if it is checkmate and dispatch the appropriate event if so
    // if (isCheckmate(board) { ... }

    io.to(gameId).emit(
      BoardUpdatedEvent.name,
      new BoardUpdatedEvent(boardUpdate)
    );
    io.to(gameId).emit(
      LogCreatedEvent.name,
      new LogCreatedEvent(
        `${socket.data.username} made a move from ${from} to ${to}. ${
          capturedPiece ? `Captured ${capturedPiece.name}.` : ''
        }`
      )
    );
  });

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
        const gameId = `game-${socket.id}-${opponent.id}`;

        const white = Math.random() > 0.5 ? socket : opponent;
        const black = white === socket ? opponent : socket;

        white.join(gameId);
        black.join(gameId);

        games.set(gameId, {
          activeColor: 'white',
          board: structuredClone(UntouchedBoard),
          white,
          black,
          players: new Map([
            [white.data.username, white],
            [black.data.username, black],
          ]),
        });

        socketToGameId.set(socket.id, gameId);
        socketToGameId.set(opponent.id, gameId);

        const blackPlayer = black.data.username;
        const whitePlayer = white.data.username;

        white.emit(
          GameStartedEvent.name,
          new GameStartedEvent({
            color: 'white',
            opponent: blackPlayer,
          })
        );
        black.emit(
          GameStartedEvent.name,
          new GameStartedEvent({
            color: 'black',
            opponent: whitePlayer,
          })
        );
        io.to(gameId).emit(
          LogCreatedEvent.name,
          new LogCreatedEvent(
            `The game has started! ${whitePlayer} (white) vs ${blackPlayer} (black). Fight!`
          )
        );

        console.log(
          `Game started: ${gameId} between ${white.data.username} and ${black.data.username}`
        );
      }
    }
  );

  socket.on('disconnect', () => {
    console.log(`${socket.data.username} disconnected`);

    const gameId = socketToGameId.get(socket.id);

    if (gameId && games.has(gameId)) {
      leaveGame(socket);
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

function leaveGame(socket: Socket): void {
  const gameId = socketToGameId.get(socket.id);

  const game = games.get(gameId);
  const opponent = game.white.id === socket.id ? game.black : game.white;

  opponent.emit(
    GameEndedEvent.name,
    new GameEndedEvent(`${socket.data.username} disconnected from the game`)
  );
  opponent.emit(
    LogCreatedEvent.name,
    new LogCreatedEvent(`${socket.data.username} left the game`)
  );
  opponent.leave(gameId);

  socketToGameId.delete(socket.id);
  socketToGameId.delete(opponent.id);
  games.delete(gameId);

  console.log(`Game ended: ${gameId}`);
}
