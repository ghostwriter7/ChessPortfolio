import {
  Board,
  BOARD_UPDATED_EVENT,
  Color,
  GAME_ENDED_EVENT,
  GAME_STARTED_EVENT,
  getOppositeColor,
  isCheckmate,
  LEAVE_GAME_COMMAND,
  LOG_CREATED_EVENT,
  MAKE_MOVE_COMMAND,
  MakeMoveCommandPayload,
  UntouchedBoard,
} from '@chess-logic';
import { Server, Socket } from 'socket.io';
import { MakeMoveCommandValidator } from '../validators/make-move-command.validator';
import { GameId } from '../repository/game.repository';

export class GameManager {
  private readonly players = new Map<Color, Socket>();

  private activeColor: Color = 'white';
  private board = structuredClone(UntouchedBoard);

  private get white(): Socket {
    return this.players.get('white');
  }

  private get black(): Socket {
    return this.players.get('black');
  }

  private get whiteName(): string {
    return this.white.data.username;
  }

  private get blackName(): string {
    return this.black.data.username;
  }

  constructor(private readonly gameId: GameId, private readonly io: Server) {}

  public setSocket(color: Color, socket: Socket): void {
    this.players.set(color, socket);
  }

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

    this.io.to(gameId).emit(GAME_STARTED_EVENT, {
      white: whiteName,
      black: blackName,
    });

    this.io
      .to(gameId)
      .emit(
        LOG_CREATED_EVENT,
        `The game has started! ${whiteName} vs ${blackName}. Fight!`
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
  public destroy(): void {
    this.players.forEach((player) => {
      player.removeAllListeners(LEAVE_GAME_COMMAND);
      player.removeAllListeners(MAKE_MOVE_COMMAND);
    });
  }

  private listenToLeaveGameEvent(): void {
    this.players.forEach((player) => {
      player.on(LEAVE_GAME_COMMAND, () => {
        const opponent = this.getOpponent(player);
        const gameId = this.gameId;
        const playerName = player.data.username;
        this.notifyOpponentAboutPlayerLeave(opponent, playerName);

        console.log(`Game ended: ${gameId}`);
        player.disconnect(true);
        opponent.disconnect(true);
        this.destroy();
      });
    });
  }

  private notifyOpponentAboutPlayerLeave(
    opponent: Socket,
    playerName: string
  ): void {
    opponent.emit(GAME_ENDED_EVENT, `${playerName} disconnected from the game`);
    opponent.emit(LOG_CREATED_EVENT, `${playerName} left the game`);
    opponent.leave(this.gameId);
  }

  private listenToMakeMoveEvent(): void {
    this.players.forEach((player) => {
      const gameId = this.gameId;
      const playerName = player.data.username;

      player.on(MAKE_MOVE_COMMAND, (command: MakeMoveCommandPayload) => {
        const { activeColor, board } = this;

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
        this.board = { ...board, ...boardUpdate };

        if (isCheckmate(board, activeColor)) {
          // this.io.to(gameId).emit(GameEndedEvent.name, new GameEndedEvent());
        }

        this.activeColor = getOppositeColor(activeColor);

        this.io.to(gameId).emit(BOARD_UPDATED_EVENT, boardUpdate);
        this.io
          .to(gameId)
          .emit(
            LOG_CREATED_EVENT,
            `${playerName} made a move from ${from} to ${to}. ${
              capturedPiece ? `Captured ${capturedPiece.name}.` : ''
            }`
          );
      });
    });
  }
}
