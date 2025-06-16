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
 * This function handles different piece types (pawn, knight, king, and sliding pieces)
 * and ensures moves don't put the player's own king in check when required.
 * @param board - The current state of the chess board
 * @param piecePosition - The position of the piece to calculate moves for
 * @param shouldCheckOwnKingSafety - When true, filters out moves that would put the player's own king in check
 * @param includeCaptureMovesOnly - When true, returns only moves that capture opponent's pieces
 * @returns An array of valid positions where the piece can move
 */
export function getAvailablePositions({
  board,
  piecePosition,
  shouldCheckOwnKingSafety = true,
  includeCaptureMovesOnly = false,
}: {
  board: Board;
  piecePosition: Position;
  shouldCheckOwnKingSafety?: boolean;
  includeCaptureMovesOnly?: boolean;
}): Position[] {
  const piece = board[piecePosition];

  if (!piece) return [];

  const { name, color } = piece;

  let availablePositions: Position[] = [];

  if (name === 'pawn') {
    availablePositions = getPawnAvailablePositions({
      board,
      position: piecePosition,
      isAttackOnly: includeCaptureMovesOnly,
    });
  } else if (isSlidingPiece(name)) {
    availablePositions = getSlidingPieceAvailablePositions(
      board,
      name,
      piecePosition
    );
  } else if (name === 'knight') {
    availablePositions = getKnightAvailablePositions(board, piecePosition);
  } else {
    return getKingAvailablePositions(board, piecePosition);
  }

  if (shouldCheckOwnKingSafety) {
    const isKingSafePredicate = (position: Position) =>
      !isKingThreatened(
        movePiece(piecePosition, position)({ ...board }),
        color
      );

    return availablePositions.filter(isKingSafePredicate);
  }

  return availablePositions;
}
