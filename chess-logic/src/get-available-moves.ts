import { Board } from "./types/board";
import { PieceName } from "./types/piece-name";
import { Letter, Position } from "./types/position";

type SlidingPiece = 'queen' | 'rook' | 'bishop';

const isSlidingPiece = (name: PieceName): name is SlidingPiece => ['queen', 'rook', 'bishop'].includes(name);

const letters: Letter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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


const directions: Record<SlidingPiece, ((position: Position) => Position | null)[]> = {
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

const walkBoard = (board: Board, position: Position, nextPositionFn: (position: Position) => Position, path: Position[]): void => {
    if (!position) return;

    if (board[position]) {
        path.push(position);
        return;
    }

    path.push(position);
    walkBoard(board, nextPositionFn(position), nextPositionFn, path);
}

const getAvailablePositions = (board: Board, name: SlidingPiece, position: Position): Position[] => {
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
    const rowIndex = parseInt(selectedPosition[1]);
    const columnId = selectedPosition[0] as Letter;
    const columnIndex = letters.indexOf(columnId);

    if (name === 'pawn') {
        const availableColumnIndexes = [columnIndex - 1, columnIndex, columnIndex + 1]
            .filter((index) => index >= 0 && index < 8);
        const nextRowIndex = isWhite ? rowIndex + 1 : rowIndex - 1;

        return availableColumnIndexes.map((columnIndex) =>
            `${letters[columnIndex]}${nextRowIndex}` as Position);
    }

    if (isSlidingPiece(name)) {
        return getAvailablePositions(board, name, selectedPosition);
    }
}
