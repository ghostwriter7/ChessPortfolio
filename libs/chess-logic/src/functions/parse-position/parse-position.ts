import {
  isValidLetter,
  isValidRowIndex,
  Letter,
  Position,
  RowNumber,
} from '../../types/position';

export function parsePosition(position: Position): [Letter, RowNumber] {
  if (position.length !== 2)
    throw new Error(`Position must be 2 characters long: ${position}`);

  const [letter, row] = position;
  const rowIndex = +row;

  if (!isValidRowIndex(rowIndex)) throw new Error(`Invalid row index: ${row}`);

  if (!isValidLetter(letter)) throw new Error(`Invalid letter: ${letter}`);

  return [letter, rowIndex];
}
