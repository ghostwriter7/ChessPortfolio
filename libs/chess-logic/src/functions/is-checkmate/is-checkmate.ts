import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { isKingThreatened } from '../is-king-threatened/is-king-threatened';
import { getKingAvailablePositions } from '../get-available-positions/king/get-king-available-positions';
import { findKingPosition } from '../find-king-position/find-king-position';

/**
 * Determines if the specified player's king is in checkmate position.
 * A checkmate occurs when the king is threatened and has no available moves to escape.
 *
 * @param board - The current state of the chess board
 * @param playerColor - The color of the player whose king is being checked for checkmate
 * @returns True if the player's king is in checkmate, false otherwise
 * @throws {Error} When the king of specified color is not found on the board
 */
export function isCheckmate(board: Board, playerColor: Color): boolean {
  const kingPosition = findKingPosition(board, playerColor);

  return (
    isKingThreatened(board, playerColor) &&
    getKingAvailablePositions(board, kingPosition).length === 0
  );
}
