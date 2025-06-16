import { Board } from '../../types/board';
import { UntouchedBoard } from '../../consts/untouched-board';
import { isKingThreatened } from './is-king-threatened';
import { Color } from '../../types/color';
import { movePiece, mutateBoard } from '../mutate-board/mutate-board';

type TestCase = {
  color: Color;
  board: Board;
  expected: boolean;
  message: string;
};

describe('isKingThreatened', () => {
  test.each<TestCase>([
    {
      color: 'white',
      board: UntouchedBoard,
      expected: false,
      message: 'White king is at its starting position on an empty board',
    },
    {
      color: 'white',
      board: UntouchedBoard,
      expected: false,
      message: 'Black king is at its starting position on an empty board',
    },
    {
      color: 'white',
      board: mutateBoard(movePiece('e1', 'e6')),
      expected: true,
      message: 'White king has pawns on both diagonals',
    },
    {
      color: 'white',
      board: mutateBoard(movePiece('e8', 'c6'), movePiece('e1', 'c5')),
      expected: true,
      message: 'White king meets a Black King',
    },
    {
      color: 'white',
      board: mutateBoard(movePiece('c7', 'e5'), movePiece('e1', 'd4')),
      expected: true,
      message: 'White king is threatened by black pawn',
    },
    {
      color: 'white',
      board: mutateBoard(movePiece('g8', 'f6'), movePiece('e1', 'e4')),
      expected: true,
      message: 'White king is threatened by black knight',
    },
    {
      color: 'white',
      board: mutateBoard(movePiece('c8', 'h5'), movePiece('e1', 'f3')),
      expected: true,
      message: 'White king is threatened by black bishop',
    },
    {
      color: 'white',
      board: mutateBoard(movePiece('h8', 'h4'), movePiece('e1', 'e4')),
      expected: true,
      message: 'White king is threatened by black rook',
    },
    {
      color: 'white',
      board: mutateBoard(movePiece('d8', 'h5'), movePiece('e1', 'd5')),
      expected: true,
      message: 'Black king is threatened by white queen',
    },
  ])('should return $expected when $message', ({ board, color, expected }) => {
    const isCheck = isKingThreatened(board, color);

    expect(isCheck).toBe(expected);
  });
});
