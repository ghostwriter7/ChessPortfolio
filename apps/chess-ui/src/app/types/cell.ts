import { Color, Piece, Position } from '@chess-logic';
import { CellClass } from './cell-class';
import { Signal } from '@angular/core';

export type Cell = {
  color: Color;
  modifierClasses: Signal<CellClass[]>;
  occupiedBy: Signal<Piece | null>;
  index: number;
  position: Position;
};
