import { Board } from "../types/board";
import { Color } from "../types/color";
import { Position } from "../types/position";
import {
    getBottomSibling,
    getLeftBottomSibling,
    getLeftTopSibling, getRightBottomSibling,
    getRightTopSibling,
    GetSiblingFn,
    getTopSibling
} from "./get-sibling-position";

const WhitePawnAttackPositionFns = [getLeftTopSibling, getRightTopSibling];
const BlackPawnAttackPositionFns = [getLeftBottomSibling, getRightBottomSibling];
const WhitePawnAllMoveFns = [getLeftTopSibling, getTopSibling, getRightTopSibling];
const BlackPawnAllMoveFns = [getLeftBottomSibling, getBottomSibling, getRightBottomSibling];

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
    getPawnAvailablePositions(board, position, WhitePawnAllMoveFns, 'black');

/**
 * Gets all available positions for a black pawn at the specified position
 * @param board - Current state of the chess board
 * @param position - Current position of the black pawn
 * @returns Array of available positions where the black pawn can move
 */
export const getBlackPawnAvailablePositions = (board: Board, position: Position): Position[] =>
    getPawnAvailablePositions(board, position, BlackPawnAllMoveFns, 'white');

export const getWhitePawnAvailableAttackPositions = (board: Board, position: Position): Position[] =>
    getPawnAvailablePositions(board, position, WhitePawnAttackPositionFns, 'black');

export const getBlackPawnAvailableAttackPositions = (board: Board, position: Position): Position[] =>
    getPawnAvailablePositions(board, position, BlackPawnAttackPositionFns, 'white');