import { Board } from '../../../types/board';
import { Position } from '../../../types/position';
import { KingMovementOffsets } from '../../../consts/king-movement-offsets';
import { getSiblingPosition } from '../../get-sibling-position/get-sibling-position';
import { isKingThreatened } from '../../is-king-threatened/is-king-threatened';
import { movePiece } from '../../mutate-board/mutate-board';
import { getOppositeColor } from '../../get-opposite-color/get-opposite-color';
import { findKingPosition } from '../../find-king-position/find-king-position';
import { isSiblingOf } from '../../is-sibling-of/is-sibling-of';

export function getKingAvailablePositions(
  board: Board,
  position: Position
): Position[] {
  const king = board[position];

  if (king?.name !== 'king') throw new Error('Not a king');

  const { color } = king;

  const enemyKingPosition = findKingPosition(board, getOppositeColor(color));

  return KingMovementOffsets.reduce((positions, [columnOffset, rowOffset]) => {
    const potentialPosition = getSiblingPosition(
      position,
      columnOffset,
      rowOffset
    );

    if (!potentialPosition) return positions;

    const piece = board[potentialPosition];
    const isEmptyOrOccupiedByEnemyButNotKing =
      !piece || (piece.color !== color && piece.name !== 'king');
    const isNotAdjacentToEnemyKing = !isSiblingOf(
      potentialPosition,
      enemyKingPosition
    );

    if (
      isEmptyOrOccupiedByEnemyButNotKing &&
      isNotAdjacentToEnemyKing &&
      !isKingThreatened(
        movePiece(position, potentialPosition)({ ...board }),
        color
      )
    ) {
      return [...positions, potentialPosition];
    }

    return positions;
  }, [] as Position[]);
}
