import { BLACK_PAWN_START_ROW, WHITE_PAWN_START_ROW } from "../consts/starting-positions";
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

type PawnMovementParams = {
    board: Board,
    position: Position,
    isAttackOnly?: boolean;
}

const PawnPositionFns: Record<Color, { attack: [GetSiblingFn, GetSiblingFn], move: GetSiblingFn }> = {
    white: { attack: [getLeftTopSibling, getRightTopSibling], move: getTopSibling },
    black: { attack: [getLeftBottomSibling, getRightBottomSibling], move: getBottomSibling }
};

export const getPawnAvailablePositions = (
    { board, isAttackOnly = false, position }: PawnMovementParams): Position[] => {
    const pawnColor = board[position]?.color;

    if (!pawnColor) throw new Error('Position must be occupied by a pawn piece');

    const enemyColor = pawnColor === 'white' ? 'black' : 'white';
    const { attack, move } = PawnPositionFns[pawnColor];

    const availablePositions: Position[] = attack.reduce((positions, fn) => {
        const siblingPosition = fn(position);
        if (siblingPosition && board[siblingPosition]?.color === enemyColor) {
            positions.push(siblingPosition);
        }

        return positions;
    }, [] as Position[]);

    if (!isAttackOnly) {
        const siblingPosition = move(position);
        if (siblingPosition && !board[siblingPosition]) {
            availablePositions.push(siblingPosition);

            const rowIndex = position[1];
            const hasNotMoved = pawnColor === 'white' && rowIndex === WHITE_PAWN_START_ROW
                || pawnColor === 'black' && rowIndex === BLACK_PAWN_START_ROW;

            if (hasNotMoved) {
                const secondTopPosition = move(siblingPosition);
                if (secondTopPosition && !board[secondTopPosition]) {
                    availablePositions.push(secondTopPosition);
                }
            }
        }
    }

    return availablePositions;
}
