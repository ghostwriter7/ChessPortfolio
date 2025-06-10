import { Board } from "./types/board";
import { Color } from "./types/color";
import { PieceName, SlidingPieceName } from "./types/piece-name";
import { Letter, Position } from "./types/position";

type GetSiblingFn = (position: Position) => Position | null;

const isSlidingPiece = (name: PieceName): name is SlidingPieceName => ['queen', 'rook', 'bishop'].includes(name);

const letters: Letter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const knightOffsets = [
    [-2, 1],
    [-1, 2],
    [1, 2],
    [2, 1],
    [1, -2],
    [2, -1],
    [-1, -2],
    [-2, -1]
];

const isValidRowIndex = (index: number): boolean => index >= 1 && index <= 8;

const getSibling = (position: Position, columnOffset: number, rowOffset: number): Position | null => {
    const columnId = position[0] as Letter;
    const columnIndex = letters.indexOf(columnId);
    const rowIndex = parseInt(position[1]);

    const newLetter = letters[columnIndex + columnOffset];
    const newRowIndex = rowIndex + rowOffset;

    if (newLetter && isValidRowIndex(newRowIndex)) {
        return `${newLetter}${newRowIndex}` as Position;
    }

    return null;
}

const leftColumn = -1;
const rightColumn = 1;
const topRow = 1;
const bottomRow = -1;
const sameColumn = 0;
const sameRow = 0;

const getLeftSibling = (position: Position): Position | null => getSibling(position, leftColumn, sameRow);
const getLeftTopSibling = (position: Position): Position | null => getSibling(position, leftColumn, topRow);
const getLeftBottomSibling = (position: Position): Position | null => getSibling(position, leftColumn, bottomRow);
const getRightTopSibling = (position: Position): Position | null => getSibling(position, rightColumn, topRow);
const getRightBottomSibling = (position: Position): Position | null => getSibling(position, rightColumn, bottomRow);
const getRightSibling = (position: Position): Position | null => getSibling(position, rightColumn, sameRow);
const getTopSibling = (position: Position): Position | null => getSibling(position, sameColumn, topRow);
const getBottomSibling = (position: Position): Position | null => getSibling(position, sameColumn, bottomRow);

const getPawnPositions = (board: Board, position: Position, [leftFn, topFn, rightFn]: GetSiblingFn[], opposedColor: Color): Position[] => {
    const availablePositions: Position[] = [];
    const topPosition = topFn(position);
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

const getWhitePawnPositions = (board: Board, position: Position): Position[] =>
    getPawnPositions(board, position, [getLeftTopSibling, getTopSibling, getRightTopSibling], 'black');

const getBlackPawnPositions = (board: Board, position: Position): Position[] =>
    getPawnPositions(board, position, [getLeftBottomSibling, getBottomSibling, getRightBottomSibling], 'white');

const directions: Record<SlidingPieceName, GetSiblingFn[]> = {
    bishop: [getLeftTopSibling, getLeftBottomSibling, getRightBottomSibling, getRightTopSibling],
    rook: [getLeftSibling, getBottomSibling, getRightSibling, getTopSibling],
    queen: [
        getLeftTopSibling,
        getLeftSibling,
        getLeftBottomSibling,
        getBottomSibling,
        getRightBottomSibling,
        getRightSibling,
        getRightTopSibling,
        getTopSibling
    ]
}

const walkBoard = (board: Board, position: Position, nextPositionFn: GetSiblingFn, path: Position[]): void => {
    if (!position) return;

    if (board[position]) {
        path.push(position);
        return;
    }

    path.push(position);
    walkBoard(board, nextPositionFn(position), nextPositionFn, path);
}

const getAvailablePositions = (board: Board, name: SlidingPieceName, position: Position): Position[] => {
    const availablePositions: Position[] = [];

    directions[name].forEach((directionFn) => {
        walkBoard(board, directionFn(position), directionFn, availablePositions);
    });

    return availablePositions;
}

export function getAvailableMoves(board: Board, selectedPosition: Position): Position[] {
    const piece = board[selectedPosition];

    if (!piece) return [];

    const { color, name } = piece;
    const isWhite = color === 'white';

    if (name === 'pawn') {
        return isWhite ? getWhitePawnPositions(board, selectedPosition) : getBlackPawnPositions(board, selectedPosition);
    }

    if (isSlidingPiece(name)) {
        return getAvailablePositions(board, name, selectedPosition);
    }

    if (name === 'knight') {
        return knightOffsets
            .map(([columnOffset, rowOffset]) => getSibling(selectedPosition, columnOffset, rowOffset))
            .filter(Boolean);
    }
}
