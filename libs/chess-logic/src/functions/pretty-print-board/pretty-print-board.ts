import { Board } from '../../types/board';
import { parsePosition } from '../parse-position/parse-position';
import { Position } from '../../types/position';
import { letters } from '../../consts/letters';
import * as process from 'node:process';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { styleText } from 'node:util';

const placeholder = '-'.repeat(6);

export function prettyPrintBoard(board: Board): void {
  const formattedRows = Object.entries(board).reduce(
    (rows, [position, piece]) => {
      const [column, row] = parsePosition(position as Position);
      const zeroBasedRow = row - 1;

      const rowArray = rows[zeroBasedRow];

      const cellContent = piece?.name
        ? styleText(
            piece.color === 'white'
              ? ['black', 'bgWhite']
              : ['white', 'bgBlack'],
            piece.name.padEnd(6, ' ')
          )
        : placeholder;

      rows[zeroBasedRow] = rowArray.with(
        letters.indexOf(column),
        `${position}: ${cellContent}`
      );

      return rows;
    },
    new Array(8).fill(new Array(8)) as string[][]
  );

  for (const row of formattedRows) {
    process.stdout.write(row.join(' | ') + '\n');
  }
}
