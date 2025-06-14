import { Position } from '../../types/position';
import { parsePosition } from '../parse-position/parse-position';
import { letters } from '../../consts/letters';

/**
 * Calculates the offset between two chess board positions.
 * First calculates column offset, then row offset.
 * Returns a tuple containing both offsets.
 *
 * @param startPosition - The starting position on the chess board (e.g., 'e2')
 * @param endPosition - The target position on the chess board (e.g., 'e4')
 * @returns A tuple [columnOffset, rowOffset] where:
 *   - columnOffset: Negative means left, positive means right
 *   - rowOffset: Negative means down, positive means up
 *
 * @example
 * // Moving from e2 to e4 (two squares up)
 * getPositionOffset('e2', 'e4') // returns [0, 2]
 *
 * @example
 * // Moving from c3 to e4 (two squares right and one up)
 * getPositionOffset('c3', 'e4') // returns [2, 1]
 *
 * @example
 * // Moving from f6 to d4 (two squares left and two down)
 * getPositionOffset('f6', 'd4') // returns [-2, -2]
 */
export function getPositionOffset(
  startPosition: Position,
  endPosition: Position
): [number, number] {
  const [startColumn, startRow] = parsePosition(startPosition);
  const [endColumn, endRow] = parsePosition(endPosition);

  const columnOffset =
    letters.indexOf(endColumn) - letters.indexOf(startColumn);
  const rowOffset = endRow - startRow;

  return [columnOffset, rowOffset];
}
