import { Position } from '../../types/position';
import { Board } from '../../types/board';
import { EmptyBoard } from '../../consts/empty-board';
import { isPotentialCheck } from './is-potential-check';
import { getOppositeColor } from '../get-opposite-color/get-opposite-color';
import { Color } from '../../types/color';

type TestCase = {
  kingAt: Position;
  board: Board;
  expected: boolean;
  message: string;
};

const movePiece =
  (from: Position, to: Position): ((board: Board) => Board) =>
  (board: Board) => ({ ...board, [to]: board[from], [from]: null });

const pipe = (
  board: Board,
  ...movePieceFns: ReturnType<typeof movePiece>[]
): Board =>
  movePieceFns.reduce(
    (currentBoard, movePieceFn) => movePieceFn(currentBoard),
    board
  );

describe('isPotentialCheck', () => {
  test.each<TestCase>([
    {
      kingAt: 'e1',
      board: EmptyBoard,
      expected: false,
      message: 'White king is at its starting position on an empty board',
    },
    {
      kingAt: 'e8',
      board: EmptyBoard,
      expected: false,
      message: 'Black king is at its starting position on an empty board',
    },
    {
      kingAt: 'e6',
      board: pipe(EmptyBoard, movePiece('e1', 'e6')),
      expected: true,
      message: 'White king has pawns on both diagonals',
    },
    {
      kingAt: 'c5',
      board: pipe(EmptyBoard, movePiece('e8', 'c6'), movePiece('e1', 'c5')),
      expected: true,
      message: 'White king meets a Black King',
    },
    {
      kingAt: 'd4',
      board: pipe(EmptyBoard, movePiece('c7', 'e5'), movePiece('e1', 'd4')),
      expected: true,
      message: 'White king is threatened by black pawn',
    },
    {
      kingAt: 'e4',
      board: pipe(EmptyBoard, movePiece('g8', 'f6'), movePiece('e1', 'e4')),
      expected: true,
      message: 'White king is threatened by black knight',
    },
    {
      kingAt: 'f3',
      board: pipe(EmptyBoard, movePiece('c8', 'h5'), movePiece('e1', 'f3')),
      expected: true,
      message: 'White king is threatened by black bishop',
    },
    {
      kingAt: 'e4',
      board: pipe(EmptyBoard, movePiece('h8', 'h4'), movePiece('e1', 'e4')),
      expected: true,
      message: 'White king is threatened by black rook',
    },
    {
      kingAt: 'd5',
      board: pipe(EmptyBoard, movePiece('d8', 'h5'), movePiece('e1', 'd5')),
      expected: true,
      message: 'Black king is threatened by white queen',
    },
  ])('should return $expected when $message', ({ board, kingAt, expected }) => {
    const kingColor = board[kingAt]?.color as Color;
    const enemyColor = getOppositeColor(kingColor);

    const isCheck = isPotentialCheck(board, kingAt, enemyColor);

    expect(isCheck).toBe(expected);
  });
});
