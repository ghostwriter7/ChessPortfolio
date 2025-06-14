import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Piece } from '../../types/piece';
import { Position } from '../../types/position';
import { getAvailablePositions } from '../get-available-positions/get-available-positions';
import { isSiblingOf } from '../is-sibling-of/is-sibling-of';
import { getPositionOffset } from '../get-position-offset/get-position-offset';
import { DIAGONAL_DIRECTION_OFFSETS } from '../../consts/diagonal-direction-offsets';

/**
 * Determines if a given position could be under check from enemy pieces.
 * @param board - The current state of the chess board
 * @param targetPosition - The position to check for potential check
 * @param enemyColor - The color of the opposing pieces
 * @returns True if the position is under potential check, false otherwise
 */
export function isKingThreatened(
  board: Board,
  targetPosition: Position,
  enemyColor: Color
): boolean {
  return (Object.entries(board) as [Position, Piece | null][])
    .filter(([, piece]) => piece?.color === enemyColor)
    .some(([position, piece]) => {
      if (piece?.name === 'pawn') {
        const [columnOffset, rowOffset] = getPositionOffset(
          position,
          targetPosition
        );
        return (
          DIAGONAL_DIRECTION_OFFSETS.includes(columnOffset) &&
          (piece.color === 'white' ? rowOffset === 1 : rowOffset === -1)
        );
      }

      if (piece?.name === 'king') {
        return isSiblingOf(position, targetPosition);
      }

      return getAvailablePositions(board, position).includes(targetPosition);
    });
}
