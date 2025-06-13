import { KingMovementOffsets } from '../../consts/king-movement-offsets';
import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Piece } from '../../types/piece';
import { Position } from '../../types/position';
import { isSlidingPiece } from '../../types/piece-name';
import { getPawnAvailablePositions } from './pawn/get-pawn-available-positions';
import { getSiblingPosition } from '../get-sibling-position/get-sibling-position';
import { getSlidingPieceAvailablePositions } from './sliding-piece/get-sliding-piece-available-positions';
import { isSiblingOf } from '../is-sibling-of/is-sibling-of';
import { getKnightAvailablePositions } from './knight/get-knight-available-positions';

/**
 * Determines all valid moves for a chess piece at the specified position on the board.
 * @param board - The current state of the chess board
 * @param selectedPosition - The position of the piece to calculate moves for
 * @returns An array of valid positions where the piece can move
 */
export function getAvailablePositions(
  board: Board,
  selectedPosition: Position
): Position[] {
  const piece = board[selectedPosition];

  if (!piece) return [];

  if (piece.threatenedPositions) return piece.threatenedPositions;

  const { color, name } = piece;
  const isWhite = color === 'white';
  const enemyColor = isWhite ? 'black' : 'white';

  if (name === 'pawn') {
    return getPawnAvailablePositions({ board, position: selectedPosition });
  }

  if (isSlidingPiece(name)) {
    return getSlidingPieceAvailablePositions(board, name, selectedPosition);
  }

  if (name === 'knight') {
    return getKnightAvailablePositions(board, selectedPosition);
  }

  return KingMovementOffsets.map(([columnOffset, rowOffset]) =>
    getSiblingPosition(selectedPosition, columnOffset, rowOffset)
  ).filter(
    (position) =>
      position &&
      board[position]?.color !== color &&
      isPotentialCheck(board, position, enemyColor)
  ) as Position[];
}

/**
 * Determines if a given position could be under check from enemy pieces.
 * @param board - The current state of the chess board
 * @param targetPosition - The position to check for potential check
 * @param enemyColor - The color of the opposing pieces
 * @returns True if the position is under potential check, false otherwise
 */
function isPotentialCheck(
  board: Board,
  targetPosition: Position,
  enemyColor: Color
): boolean {
  return (Object.entries(board) as [Position, Piece | null][])
    .filter(([, piece]) => piece?.color === enemyColor)
    .some(([position, piece]) => {
      if (piece?.name === 'pawn') {
        return getPawnAvailablePositions({
          board,
          position,
          isAttackOnly: true,
        }).includes(targetPosition);
      }

      if (piece?.name === 'king') {
        return isSiblingOf(position, targetPosition);
      }

      return getAvailablePositions(board, position).includes(targetPosition);
    });
}
