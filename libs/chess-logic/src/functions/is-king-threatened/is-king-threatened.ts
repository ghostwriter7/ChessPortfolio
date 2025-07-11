import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Piece } from '../../types/piece';
import { Position } from '../../types/position';
import { getAvailablePositions } from '../get-available-positions/get-available-positions';
import { getOppositeColor } from '../get-opposite-color/get-opposite-color';
import { findKingPosition } from '../find-king-position/find-king-position';

/**
 * Determines if a given position could be under check from enemy pieces.
 * @param board - The current state of the chess board
 * @param kingColor - The color of the king to check
 * @returns True if the position is under check, false otherwise
 */
export function isKingThreatened(board: Board, kingColor: Color): boolean {
  const kingPosition = findKingPosition(board, kingColor);

  const enemyColor = getOppositeColor(kingColor);

  return (Object.entries(board) as [Position, Piece | null][])
    [Symbol.iterator]()
    .filter(
      ([, piece]) => piece?.color === enemyColor && piece?.name !== 'king'
    )
    .some(([position, _]) =>
      getAvailablePositions({
        board,
        piecePosition: position,
        shouldCheckOwnKingSafety: false,
        includeCaptureMovesOnly: true,
      }).includes(kingPosition)
    );
}
