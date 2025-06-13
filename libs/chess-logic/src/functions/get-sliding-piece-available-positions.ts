import { slidingPieceMovementFns } from '../consts/sliding-piece-movement-fns';
import { Board } from '../types/board';
import { SlidingPieceName } from '../types/piece-name';
import { Position } from '../types/position';
import { GetSiblingFn } from './get-sibling-position';
import { Color } from '../types/color';

const walkBoard = (
  board: Board,
  position: Position | null,
  nextPositionFn: GetSiblingFn,
  ownColor: Color,
  path: Position[]
): void => {
  if (!position || board[position]?.color === ownColor) return;

  if (board[position]) {
    path.push(position);
    return;
  }

  path.push(position);
  walkBoard(board, nextPositionFn(position), nextPositionFn, ownColor, path);
};

export const getSlidingPieceAvailablePositions = (
  board: Board,
  name: SlidingPieceName,
  position: Position
): Position[] => {
  const availablePositions: Position[] = [];
  const ownColor = board[position]?.color;

  if (!ownColor) throw new Error(`No piece at position ${position}`);

  slidingPieceMovementFns[name].forEach((directionFn) => {
    walkBoard(
      board,
      directionFn(position),
      directionFn,
      ownColor,
      availablePositions
    );
  });

  return availablePositions;
};
