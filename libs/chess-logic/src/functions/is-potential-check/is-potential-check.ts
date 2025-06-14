import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Piece } from '../../types/piece';
import { Position } from '../../types/position';
import { getAvailablePositions } from '../get-available-positions/get-available-positions';
import { getPawnAvailablePositions } from '../get-available-positions/pawn/get-pawn-available-positions';
import { isSiblingOf } from '../is-sibling-of/is-sibling-of';

/**
 * Determines if a given position could be under check from enemy pieces.
 * @param board - The current state of the chess board
 * @param targetPosition - The position to check for potential check
 * @param enemyColor - The color of the opposing pieces
 * @returns True if the position is under potential check, false otherwise
 */
export function isPotentialCheck(
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
