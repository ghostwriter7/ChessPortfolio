import { Board } from '../../../types/board';
import { Position } from '../../../types/position';
import { KnightMovementOffsets } from '../../../consts/knight-movement-offsets';
import { getSiblingPosition } from '../../get-sibling-position/get-sibling-position';

export function getKnightAvailablePositions(
  board: Board,
  position: Position
): Position[] {
  const knight = board[position];

  if (knight?.name !== 'knight') throw new Error('Not a knight');

  const { color } = knight;

  return KnightMovementOffsets.reduce(
    (positions, [columnOffset, rowOffset]) => {
      const siblingPosition = getSiblingPosition(
        position,
        columnOffset,
        rowOffset
      );

      if (siblingPosition && board[siblingPosition]?.color !== color) {
        return [...positions, siblingPosition];
      }
      return positions;
    },
    [] as Position[]
  );
}
