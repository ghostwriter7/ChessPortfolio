import { Cell } from './cell';

export type Row = {
  cells: Cell[];
  index: number;
};

export type Rows = Row[] | null;
