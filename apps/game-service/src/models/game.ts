import { Color, UntouchedBoard } from '@chess-logic';
import { Socket } from 'socket.io';
import { GameId } from '../repository/game.repository';

export class Game {
  public activeColor: Color = 'white';
  public board = structuredClone(UntouchedBoard);
  public readonly players: Map<string, Socket>;

  constructor(
    public readonly white: Socket,
    public readonly black: Socket,
    public readonly gameId: GameId
  ) {
    this.players = new Map([
      [white.data.username, white],
      [black.data.username, black],
    ]);
  }
}
