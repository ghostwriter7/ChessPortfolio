import { letters } from '../../consts/letters';
import { Position } from '../../types/position';
import { parsePosition } from '../parse-position';

/**
 * Determines if two chess board positions are adjacent (siblings) to each other.
 * Two positions are considered siblings if they are directly adjacent horizontally, vertically, or diagonally.
 * @param position - The first position to compare
 * @param anotherPosition - The second position to compare
 * @returns True if the positions are adjacent, false otherwise. Returns false if the positions are identical.
 */
export function isSiblingOf(position: Position, anotherPosition: Position) {
  if (position === anotherPosition) return false;

  const [letterA, rowA] = parsePosition(position);
  const [letterB, rowB] = parsePosition(anotherPosition);

  const indexOfLetterA = letters.indexOf(letterA);
  const indexOfLetterB = letters.indexOf(letterB);

  const isSameOrAdjacentRow = rowA === rowB || Math.abs(+rowA - +rowB) === 1;
  const isSameOrAdjacentLetter =
    indexOfLetterA === indexOfLetterB ||
    Math.abs(indexOfLetterA - indexOfLetterB) === 1;
  return isSameOrAdjacentLetter && isSameOrAdjacentRow;
}
