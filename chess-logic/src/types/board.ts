import { Figure } from "./figure";
import { Position } from "./position";

export type Board = Record<Position, Figure | null>;
