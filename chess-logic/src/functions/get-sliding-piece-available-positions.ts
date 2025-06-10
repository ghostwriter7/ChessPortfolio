import { slidingPieceMovementFns } from "../consts/sliding-piece-movement-fns";
import { Board } from "../types/board";
import { SlidingPieceName } from "../types/piece-name";
import { Position } from "../types/position";
import { GetSiblingFn } from "./get-sibling-position";

const walkBoard = (board: Board, position: Position, nextPositionFn: GetSiblingFn, path: Position[]): void => {
    if (!position) return;

    if (board[position]) {
        path.push(position);
        return;
    }

    path.push(position);
    walkBoard(board, nextPositionFn(position), nextPositionFn, path);
}

export const getSlidingPieceAvailablePositions = (board: Board, name: SlidingPieceName, position: Position): Position[] => {
    const availablePositions: Position[] = [];

    slidingPieceMovementFns[name].forEach((directionFn) => {
        walkBoard(board, directionFn(position), directionFn, availablePositions);
    });

    return availablePositions;
}