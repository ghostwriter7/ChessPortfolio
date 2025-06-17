import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Position } from '../../types/position';

/**
 * Finds the position of a king of specified color on the chess board.
 * The function searches through all board positions to locate the king piece
 * of the specified color. This is commonly used in chess game logic for
 * checking threats to the king and determining checkmate conditions.
 *
 * @param board - The current state of the chess board
 * @param color - The color of the king to find ('white' or 'black')
 * @returns The position of the king on the board (e.g., 'e1', 'e8')
 * @throws {Error} When the king of specified color is not found on the board
 * @example
 * ```TypeScript
 * const board = UntouchedBoard; // Initial chess board setup
 * const whiteKingPosition = findKingPosition(board, 'white'); // Returns 'e1'
 * const blackKingPosition = findKingPosition(board, 'black'); // Returns 'e8'
 * ```
 */
export function findKingPosition(board: Board, color: Color): Position {
  const position = Object.entries(board).find(
    ([, piece]) => piece?.name === 'king' && piece?.color === color
  )?.[0] as Position | undefined;

  if (!position) throw new Error(`${color} king not found on board`);

  return position;
}
