import { Piece } from "./piece";
import { Position } from "./position";

export type Board = Record<Position, Piece | null>;
