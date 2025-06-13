import { Color, Piece, Position } from '@chess-logic';
import { CellClass } from './cell-class';

export type Cell = {
  color: Color;
  modifierClasses?: CellClass[];
  occupiedBy: Piece | null;
  index: number;
  position: Position;
};
