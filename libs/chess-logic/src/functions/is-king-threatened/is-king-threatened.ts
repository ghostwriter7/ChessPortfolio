import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Piece } from '../../types/piece';
import { Position } from '../../types/position';
import { getAvailablePositions } from '../get-available-positions/get-available-positions';
import { isSiblingOf } from '../is-sibling-of/is-sibling-of';
import { getPositionOffset } from '../get-position-offset/get-position-offset';
import { DIAGONAL_DIRECTION_OFFSETS } from '../../consts/diagonal-direction-offsets';
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
    .filter(([, piece]) => piece?.color === enemyColor)
    .some(([position, piece]) => {
      if (piece?.name === 'pawn') {
        const [columnOffset, rowOffset] = getPositionOffset(
          position,
          kingPosition
        );
        return (
          DIAGONAL_DIRECTION_OFFSETS.includes(columnOffset) &&
          (piece.color === 'white' ? rowOffset === 1 : rowOffset === -1)
        );
      }

      if (piece?.name === 'king') {
        return isSiblingOf(position, kingPosition);
      }

      return getAvailablePositions(board, position).includes(kingPosition);
    });
}
