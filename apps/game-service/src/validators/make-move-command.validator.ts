import {
  Board,
  Color,
  getAvailablePositions,
  MakeMoveCommandPayload,
} from '@chess-logic';

/**
 * Validator class for checking if a move command in a chess game is valid, according to game rules.
 * Validates piece ownership, movement rules, and capture restrictions.
 */
export class MakeMoveCommandValidator {
  /**
   * Validates if a move command is legal, according to chess rules.
   * @param board - Current state of the chess board
   * @param playerColor - Color of the player making the move
   * @param command - Move command containing source and destination positions
   * @returns true if the move is valid, false otherwise
   */
  public static validate(
    board: Board,
    playerColor: Color,
    command: MakeMoveCommandPayload
  ): boolean {
    const { from, to } = command;
    const startPiece = board[from];

    const hasNoPieceAtStartPosition = startPiece === null;
    const pieceHasWrongColor = startPiece?.color !== playerColor;
    const isAttemptToCaptureOwnPiece = board[to]?.color === playerColor;
    const pieceCannotMoveToPosition = !getAvailablePositions({
      board,
      piecePosition: from,
    }).includes(to);

    return !(
      hasNoPieceAtStartPosition ||
      pieceHasWrongColor ||
      isAttemptToCaptureOwnPiece ||
      pieceCannotMoveToPosition
    );
  }
}
