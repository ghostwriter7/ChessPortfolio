import { Board } from '../../../types/board';
import { Position } from '../../../types/position';
import { KingMovementOffsets } from '../../../consts/king-movement-offsets';
import { getSiblingPosition } from '../../get-sibling-position/get-sibling-position';
import { getOppositeColor } from '../../get-opposite-color/get-opposite-color';
import { isKingThreatened } from '../../is-king-threatened/is-king-threatened';

export function getKingAvailablePositions(
  board: Board,
  position: Position
): Position[] {
  const king = board[position];

  if (king?.name !== 'king') throw new Error('Not a king');

  const { color } = king;
  const enemyColor = getOppositeColor(color);

  return KingMovementOffsets.reduce((positions, [columnOffset, rowOffset]) => {
    const siblingPosition = getSiblingPosition(
      position,
      columnOffset,
      rowOffset
    );

    if (
      siblingPosition &&
      board[siblingPosition]?.color !== color &&
      !isKingThreatened(board, siblingPosition, enemyColor)
    ) {
      return [...positions, siblingPosition];
    }

    return positions;
  }, [] as Position[]);
}
