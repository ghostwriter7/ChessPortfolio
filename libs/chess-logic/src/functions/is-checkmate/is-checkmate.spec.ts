import { Board } from '../../types/board';
import { UntouchedBoard } from '../../consts/untouched-board';
import { isCheckmate } from './is-checkmate';
import { Color } from '../../types/color';

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
  ])(
    'should return $expected when $message',
    ({ board, kingColor, expected }) => {
      const result = isCheckmate(board, kingColor);

      expect(result).toBe(expected);
    }
  );
});
