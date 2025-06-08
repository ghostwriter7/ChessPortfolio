import { Color } from "@app/types/color";
import { Figure } from '@app/types/figure';

export type Cell = {
  color: Color;
  occupiedBy: Figure | null;
  index: number;
  position: string;
}
