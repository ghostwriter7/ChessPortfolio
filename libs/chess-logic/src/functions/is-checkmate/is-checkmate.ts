import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { isKingThreatened } from '../is-king-threatened/is-king-threatened';
import { Position } from '../../types/position';
import { getOppositeColor } from '../get-opposite-color/get-opposite-color';
import { getKingAvailablePositions } from '../get-available-positions/king/get-king-available-positions';

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
  const kingPosition = Object.entries(board).find(
    ([, piece]) => piece?.color === playerColor && piece?.name === 'king'
  )?.[0] as Position | undefined;

  if (!kingPosition) throw new Error(`${playerColor} king not found on board`);

  return (
    isKingThreatened(board, kingPosition, getOppositeColor(playerColor)) &&
    getKingAvailablePositions(board, kingPosition).length === 0
  );
}
