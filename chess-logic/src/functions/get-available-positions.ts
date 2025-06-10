import { KingMovementOffsets } from "../consts/king-movement-offsets";
import { KnightMovementOffsets } from "../consts/knight-movement-offsets";
import { Board } from "../types/board";
import { Color } from "../types/color";
import { Piece } from "../types/piece";
import { isSlidingPiece } from "../types/piece-name";
import { Position } from "../types/position";
import { getBlackPawnAvailablePositions, getWhitePawnAvailablePositions } from "./get-pawn-available-positions";
import { getSiblingPosition } from "./get-sibling-position";
import { getSlidingPieceAvailablePositions } from "./get-sliding-piece-available-positions";

/**
 * Determines all valid moves for a chess piece at the specified position on the board.
 * @param board - The current state of the chess board
 * @param selectedPosition - The position of the piece to calculate moves for
 * @returns An array of valid positions where the piece can move
 */
export function getAvailablePositions(board: Board, selectedPosition: Position): Position[] {
    const piece = board[selectedPosition];

    if (!piece) return [];

    const { color, name } = piece;
    const isWhite = color === 'white';
    const enemyColor = isWhite ? 'black' : 'white';

    if (name === 'pawn') {
        return isWhite ? getWhitePawnAvailablePositions(board, selectedPosition) : getBlackPawnAvailablePositions(board, selectedPosition);
    }

    if (isSlidingPiece(name)) {
        return getSlidingPieceAvailablePositions(board, name, selectedPosition);
    }

    if (name === 'knight') {
        return KnightMovementOffsets
            .map(([columnOffset, rowOffset]) => getSiblingPosition(selectedPosition, columnOffset, rowOffset))
            .filter(Boolean);
    }

    return KingMovementOffsets
        .map(([columnOffset, rowOffset]) => getSiblingPosition(selectedPosition, columnOffset, rowOffset))
        .filter((position) => position && board[position]?.color !== color && isPotentialCheck(board, position, enemyColor));
}


/**
 * Determines if a given position could be under check from enemy pieces.
 * @param board - The current state of the chess board
 * @param targetPosition - The position to check for potential check
 * @param enemyColor - The color of the opposing pieces
 * @returns True if the position is under potential check, false otherwise
 */
function isPotentialCheck(board: Board, targetPosition: Position, enemyColor: Color): boolean {
    // TODO Fix issue with pawns, the forward move might appear in available moves but it is not a threat (they attack diagonally only)
    // It will loop infinitely, need to handle enemy king!!!
    return (Object.entries(board) as [Position, Piece | null][])
        .filter(([_, piece]) => piece?.color === enemyColor)
        .some(([position, _]) => getAvailablePositions(board, position).includes(targetPosition))
}
