import { Board } from '../../types/board';
import { isSlidingPiece } from '../../types/piece-name';
import { Position } from '../../types/position';
import { isKingThreatened } from '../is-king-threatened/is-king-threatened';
import { movePiece } from '../mutate-board/mutate-board';
import { getKingAvailablePositions } from './king/get-king-available-positions';
import { getKnightAvailablePositions } from './knight/get-knight-available-positions';
import { getPawnAvailablePositions } from './pawn/get-pawn-available-positions';
import { getSlidingPieceAvailablePositions } from './sliding-piece/get-sliding-piece-available-positions';

/**
 * Determines all valid moves for a chess piece at the specified position on the board.
 * @param board - The current state of the chess board
 * @param selectedPosition - The position of the piece to calculate moves for
 * @returns An array of valid positions where the piece can move
 */
export function getAvailablePositions(
  board: Board,
  selectedPosition: Position
): Position[] {
  const piece = board[selectedPosition];

  if (!piece) return [];

  if (piece.threatenedPositions) return piece.threatenedPositions;

  const { name, color } = piece;

  const isKingSafePredicate = (position: Position) =>
    !isKingThreatened(
      movePiece(selectedPosition, position)({ ...board }),
      color
    );

  if (name === 'pawn') {
    return getPawnAvailablePositions({
      board,
      position: selectedPosition,
    }).filter(isKingSafePredicate);
  }

  if (isSlidingPiece(name)) {
    return getSlidingPieceAvailablePositions(
      board,
      name,
      selectedPosition
    ).filter(isKingSafePredicate);
  }

  if (name === 'knight') {
    return getKnightAvailablePositions(board, selectedPosition).filter(
      isKingSafePredicate
    );
  }

  return getKingAvailablePositions(board, selectedPosition);
}
