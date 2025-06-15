import { Color, UntouchedBoard } from '@chess-logic';
import { Socket } from 'socket.io';

export class Game {
  public activeColor: Color = 'white';
  public board = structuredClone(UntouchedBoard);
  public readonly players: Map<string, Socket>;
  public readonly gameId: string;

  constructor(public readonly white: Socket, public readonly black: Socket) {
    this.gameId = `game-${white.id}-${black.id}`;
    this.players = new Map([
      [white.data.username, white],
      [black.data.username, black],
    ]);
  }
}
