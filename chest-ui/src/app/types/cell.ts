import { Color, Figure } from '@chess-logic';

export type Cell = {
  color: Color;
  occupiedBy: Figure | null;
  index: number;
  position: string;
}
