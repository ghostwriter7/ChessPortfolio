import { Board } from '../../../types/board';
import { Position } from '../../../types/position';
import { KingMovementOffsets } from '../../../consts/king-movement-offsets';
import { getSiblingPosition } from '../../get-sibling-position/get-sibling-position';
import { isKingThreatened } from '../../is-king-threatened/is-king-threatened';
import { movePiece } from '../../mutate-board/mutate-board';

export function getKingAvailablePositions(
  board: Board,
  position: Position
): Position[] {
  const king = board[position];

  if (king?.name !== 'king') throw new Error('Not a king');

  const { color } = king;

  return KingMovementOffsets.reduce((positions, [columnOffset, rowOffset]) => {
    const potentialPosition = getSiblingPosition(
      position,
      columnOffset,
      rowOffset
    );

    const isEmptyOrOccupiedByEnemyButNotKing =
      potentialPosition &&
      board[potentialPosition]?.color !== color &&
      board[potentialPosition]?.name !== 'king';

    if (
      isEmptyOrOccupiedByEnemyButNotKing &&
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
