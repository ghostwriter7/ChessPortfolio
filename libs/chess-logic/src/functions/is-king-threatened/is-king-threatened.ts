import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Piece } from '../../types/piece';
import { Position } from '../../types/position';
import { getAvailablePositions } from '../get-available-positions/get-available-positions';
import { getOppositeColor } from '../get-opposite-color/get-opposite-color';

/**
 * Determines if a given position could be under check from enemy pieces.
 * @param board - The current state of the chess board
 * @param kingColor - The color of the king to check
 * @returns True if the position is under check, false otherwise
 */
export function isKingThreatened(board: Board, kingColor: Color): boolean {
  const kingPosition = Object.entries(board).find(
    ([_, piece]) => piece?.color === kingColor && piece?.name === 'king'
  )?.[0] as Position | undefined;

  if (!kingPosition) throw new Error(`${kingColor} king not found on board`);

  const enemyColor = getOppositeColor(kingColor);

  return (Object.entries(board) as [Position, Piece | null][])
    [Symbol.iterator]()
    .filter(
      ([, piece]) => piece?.color === enemyColor && piece?.name !== 'king'
    )
    .some(([position, _]) =>
      getAvailablePositions({
        board,
        selectedPosition: position,
        shouldCheckOwnKingSafety: false,
        includeCaptureMovesOnly: true,
      }).includes(kingPosition)
    );
}
