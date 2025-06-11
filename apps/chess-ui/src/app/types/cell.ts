import { Color, Piece, Position } from '@chess-logic';

export type Cell = {
  color: Color;
  occupiedBy: Piece | null;
  index: number;
  position: Position;
}
