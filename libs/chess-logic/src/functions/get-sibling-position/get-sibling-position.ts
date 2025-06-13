import { letters } from '../../consts/letters';
import { isValidRowIndex, Letter, Position } from '../../types/position';

export type GetSiblingFn = (position: Position) => Position | null;

export const getSiblingPosition = (
  position: Position,
  columnOffset: number,
  rowOffset: number
): Position | null => {
  const columnId = position[0] as Letter;
  const columnIndex = letters.indexOf(columnId);
  const rowIndex = parseInt(position[1]);

  const newLetter = letters[columnIndex + columnOffset];
  const newRowIndex = rowIndex + rowOffset;

  if (newLetter && isValidRowIndex(newRowIndex)) {
    return `${newLetter}${newRowIndex}` as Position;
  }

  return null;
};

const leftColumn = -1;
const rightColumn = 1;
const topRow = 1;
const bottomRow = -1;
const sameColumn = 0;
const sameRow = 0;

export const getLeftSibling = (position: Position): Position | null =>
  getSiblingPosition(position, leftColumn, sameRow);
export const getLeftTopSibling = (position: Position): Position | null =>
  getSiblingPosition(position, leftColumn, topRow);
export const getLeftBottomSibling = (position: Position): Position | null =>
  getSiblingPosition(position, leftColumn, bottomRow);
export const getRightTopSibling = (position: Position): Position | null =>
  getSiblingPosition(position, rightColumn, topRow);
export const getRightBottomSibling = (position: Position): Position | null =>
  getSiblingPosition(position, rightColumn, bottomRow);
export const getRightSibling = (position: Position): Position | null =>
  getSiblingPosition(position, rightColumn, sameRow);
export const getTopSibling = (position: Position): Position | null =>
  getSiblingPosition(position, sameColumn, topRow);
export const getBottomSibling = (position: Position): Position | null =>
  getSiblingPosition(position, sameColumn, bottomRow);
