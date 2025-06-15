import { Game } from '../models/game';
import {
  Board,
  BoardUpdatedEvent,
  GameEndedEvent,
  GameStartedEvent,
  getOppositeColor,
  LeaveGameCommand,
  LogCreatedEvent,
  MakeMoveCommand,
  MakeMoveCommandPayload,
} from '@chess-logic';
import { Server, Socket } from 'socket.io';
import { MakeMoveCommandValidator } from '../validators/make-move-command.validator';

export class GameManager {
  private get white(): Socket {
    return this.game.white;
  }

  private get black(): Socket {
    return this.game.black;
  }

  private get whiteName(): string {
    return this.white.data.username;
  }

  private get blackName(): string {
    return this.black.data.username;
  }

  private get gameId(): string {
    return this.game.gameId;
  }

  constructor(private game: Game, private readonly io: Server) {}

  public getOpponent(player: Socket): Socket {
    return player === this.white ? this.black : this.white;
  }

  public handlePlayerDisconnect(player: Socket): void {
    const opponent = this.getOpponent(player);
    this.notifyOpponentAboutPlayerLeave(opponent, player.data.username);
  }

  public startGame(): void {
    const gameId = this.gameId;

    const white = this.white;
    const black = this.black;
    const whiteName = this.whiteName;
    const blackName = this.blackName;

    white.join(gameId);
    black.join(gameId);

    white.emit(
      GameStartedEvent.name,
      new GameStartedEvent({
        color: 'white',
        opponent: blackName,
      })
    );
    black.emit(
      GameStartedEvent.name,
      new GameStartedEvent({
        color: 'black',
        opponent: whiteName,
      })
    );
    this.io
      .to(gameId)
      .emit(
        LogCreatedEvent.name,
        new LogCreatedEvent(
          `The game has started! ${whiteName} (white) vs ${blackName} (black). Fight!`
        )
      );

    console.log(
      `Game started: ${gameId} between ${whiteName} and ${blackName}`
    );

    this.listenToLeaveGameEvent();
    this.listenToMakeMoveEvent();
  }

  /**
   * Unsubscribes all event listeners and cleans up game resources
   * Should be called when the game is terminated
   */
  public unsubscribe(): void {
    this.game.players.forEach((player) => {
      player.removeAllListeners(LeaveGameCommand.name);
      player.removeAllListeners(MakeMoveCommand.name);
    });
  }

  private listenToLeaveGameEvent(): void {
    this.game.players.forEach((player) => {
      player.on(LeaveGameCommand.name, () => {
        const opponent = this.getOpponent(player);
        const gameId = this.gameId;
        const playerName = player.data.username;
        this.notifyOpponentAboutPlayerLeave(opponent, playerName);

        console.log(`Game ended: ${gameId}`);
        player.disconnect(true);
        opponent.disconnect(true);
        this.unsubscribe();
      });
    });
  }

  private notifyOpponentAboutPlayerLeave(
    opponent: Socket,
    playerName: string
  ): void {
    opponent.emit(
      GameEndedEvent.name,
      new GameEndedEvent(`${playerName} disconnected from the game`)
    );
    opponent.emit(
      LogCreatedEvent.name,
      new LogCreatedEvent(`${playerName} left the game`)
    );
    opponent.leave(this.gameId);
  }

  private listenToMakeMoveEvent(): void {
    this.game.players.forEach((player) => {
      const game = this.game;
      const gameId = game.gameId;
      const playerName = player.data.username;

      player.on(MakeMoveCommand.name, (command: MakeMoveCommandPayload) => {
        const { activeColor, board } = game;

        if (!MakeMoveCommandValidator.validate(board, activeColor, command)) {
          console.error(`Invalid move command sent by ${playerName}`);
          return;
        }

        const { from, to } = command;
        const startPiece = board[from];

        console.log(
          `A valid move was made: ${from} -> ${to} by ${playerName} (${activeColor})`
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

        this.io
          .to(gameId)
          .emit(BoardUpdatedEvent.name, new BoardUpdatedEvent(boardUpdate));
        this.io
          .to(gameId)
          .emit(
            LogCreatedEvent.name,
            new LogCreatedEvent(
              `${playerName} made a move from ${from} to ${to}. ${
                capturedPiece ? `Captured ${capturedPiece.name}.` : ''
              }`
            )
          );
      });
    });
  }
}
