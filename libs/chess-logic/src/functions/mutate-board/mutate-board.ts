import { Board } from '../../types/board';
import { Position } from '../../types/position';
import { UntouchedBoard } from '../../consts/untouched-board';

export const movePiece =
  (from: Position, to: Position): ((board: Board) => Board) =>
  (board: Board) => ({
    ...board,
    [to]: { ...board[from], untouched: false },
    [from]: null,
  });

export const mutateBoard = (
  ...movePieceFns: ReturnType<typeof movePiece>[]
): Board =>
  movePieceFns.reduce(
    (currentBoard, movePieceFn) => movePieceFn(currentBoard),
    UntouchedBoard
  );
