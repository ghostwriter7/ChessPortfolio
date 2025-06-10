import { Board } from "../types/board";
import { Color } from "../types/color";
import { Position } from "../types/position";
import { getAvailablePositions } from "./get-available-positions";
import {
    getBottomSibling,
    getLeftBottomSibling,
    getLeftTopSibling, getRightBottomSibling,
    getRightTopSibling,
    GetSiblingFn,
    getTopSibling
} from "./get-sibling-position";

const getPawnAvailablePositions = (board: Board, position: Position, [leftFn, topFn, rightFn]: GetSiblingFn[], opposedColor: Color): Position[] => {
    const availablePositions: Position[] = [];
    const topPosition = topFn?.(position);
    const rowIndex = position[1];

    if (topPosition && !board[topPosition]) {
        availablePositions.push(topPosition);

        const currentPosition = board[position];
        const hasNotMoved = currentPosition.color === 'white' && rowIndex === '2'
            || currentPosition.color === 'black' && rowIndex === '7';

        if (hasNotMoved) {
            const secondTopPosition = topFn(topPosition);
            if (secondTopPosition && !board[secondTopPosition]) {
                availablePositions.push(secondTopPosition);
            }
        }
    }

    const leftPosition = leftFn(position);
    if (leftPosition && board[leftPosition]?.color === opposedColor) {
        availablePositions.push(leftPosition);
    }

    const rightPosition = rightFn(position);
    if (rightPosition && board[rightPosition]?.color === opposedColor) {
        availablePositions.push(rightPosition);
    }

    return availablePositions;
}

/**
 * Gets all available positions for a white pawn at the specified position
 * @param board - Current state of the chess board
 * @param position - Current position of the white pawn
 * @returns Array of available positions where the white pawn can move
 */
export const getWhitePawnAvailablePositions = (board: Board, position: Position): Position[] =>
    getPawnAvailablePositions(board, position, [getLeftTopSibling, getTopSibling, getRightTopSibling], 'black');

/**
 * Gets all available positions for a black pawn at the specified position
 * @param board - Current state of the chess board
 * @param position - Current position of the black pawn
 * @returns Array of available positions where the black pawn can move
 */
export const getBlackPawnAvailablePositions = (board: Board, position: Position): Position[] =>
    getPawnAvailablePositions(board, position, [getLeftBottomSibling, getBottomSibling, getRightBottomSibling], 'white');

export const getWhitePawnAvailableAttackPositions = (board: Board, position: Position): Position[] =>
    getPawnAvailablePositions(board, position, [getLeftTopSibling, null, getRightTopSibling], 'black');

export const getBlackPawnAvailableAttackPositions = (board: Board, position: Position): Position[] =>
    getPawnAvailablePositions(board, position, [getLeftBottomSibling, null, getRightBottomSibling], 'white');