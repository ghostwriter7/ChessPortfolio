import { Color } from './color';
import { PieceName } from './piece-name';
import { Position } from './position';

export type Piece = {
  name: PieceName;
  color: Color;
  threatenedPositions?: Position[];
  untouched: boolean;
};
