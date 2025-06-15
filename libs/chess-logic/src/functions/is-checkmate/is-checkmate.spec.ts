import { Board } from '../../types/board';
import { isCheckmate } from './is-checkmate';
import { Color } from '../../types/color';
import { movePiece, mutateBoard } from '../mutate-board/mutate-board';
import { UntouchedBoard } from '../../consts/untouched-board';

type TestCase = {
  kingColor: Color;
  board: Board;
  expected: boolean;
  message: string;
};

describe('isCheckmate', () => {
  test.each<TestCase>([
    {
      kingColor: 'white',
      board: UntouchedBoard,
      expected: false,
      message: 'White king is at its starting position on an untouched board',
    },
    {
      kingColor: 'black',
      board: UntouchedBoard,
      expected: false,
      message: 'Black king is at its starting position on an untouched board',
    },
    {
      kingColor: 'white',
      board: mutateBoard(
        movePiece('f2', 'f3'), // Pawn
        movePiece('e7', 'e5'), // Pawn
        movePiece('g2', 'g4'), // Pawn
        movePiece('d8', 'h4') // Queen
      ),
      expected: true,
      message: 'The Fool`s Mate is performed by Black queen',
    },
    {
      kingColor: 'black',
      board: mutateBoard(
        movePiece('e2', 'e4'), // Pawn
        movePiece('e7', 'e5'), // Pawn
        movePiece('d1', 'h5'), // Queen
        movePiece('b8', 'c6'), // Knight
        movePiece('f1', 'c4'), // Bishop
        movePiece('a7', 'a6'), // Pawn
        movePiece('h5', 'f7') // Queen checkmates
      ),
      expected: true,
      message: 'Scholar`s Mate is performed by White queen and bishop',
    },
    {
      kingColor: 'white',
      board: mutateBoard(
        movePiece('e2', 'e4'), // Pawn
        movePiece('d7', 'd6'), // Pawn
        movePiece('d1', 'd3'), // Queen pinning f7
        movePiece('e8', 'e7') // King move
      ),
      expected: false,
      message: 'White queen pins black pawn but no checkmate',
    },
  ])(
    'should return $expected when $message',
    ({ board, kingColor, expected }) => {
      const result = isCheckmate(board, kingColor);

      expect(result).toBe(expected);
    }
  );
});
