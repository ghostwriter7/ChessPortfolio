import { Board } from "./types/board";
import { Letter, Position } from "./types/position";

const letters: Letter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function getAvailableMoves(board: Board, selectedPosition: Position): Position[] {
    const figure = board[selectedPosition];

    if (!figure) return [];

    const { color, name } = figure;
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

    if (name === 'rook') {
        // can move any number of cells either horizontally or vertically (until there's a figure on its path)
        const availablePositions: Position[] = [];

        const walkBoard = (position: Position, nextPositionFn: (position: Position) => Position, path: Position[]): boolean => {
            // occupied by another figure
            if (board[position]) {
                path.push(position);
                return false;
            }

            // off the board
            if (!board.hasOwnProperty(position)) return false;

            return walkBoard(nextPositionFn(position), nextPositionFn, path);
        }

        walkBoard(selectedPosition, getTopSibling, availablePositions);
        walkBoard(selectedPosition, getBottomSibling, availablePositions);
        walkBoard(selectedPosition, getLeftSibling, availablePositions);
        walkBoard(selectedPosition, getRightSibling, availablePositions);

        return availablePositions;
    }

    if (name === 'bishop') {
        // can move any number of cells diagonally (until there's a figure on its path)

    }

}

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