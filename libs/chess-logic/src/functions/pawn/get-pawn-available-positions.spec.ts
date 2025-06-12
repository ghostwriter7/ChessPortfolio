import { EmptyBoard } from '../../consts/empty-board';
import { getPawnAvailablePositions } from './get-pawn-available-positions';
import { Board } from '../../types/board';
import { Position } from '../../types/position';

type TestCase = {
  board: () => Board;
  position: Position;
  expectedPositions: Position[];
  message: string;
};

describe('getPawnAvailablePositions', () => {
  test.each<TestCase>([
    {
      board: () => EmptyBoard,
      position: 'a2',
      expectedPositions: ['a3', 'a4'],
      message: 'white pawn is at a start position and the board is pristine',
    },
    {
      board: () => EmptyBoard,
      position: 'd7',
      expectedPositions: ['d6', 'd5'],
      message: 'black pawn is at a start position and the board is pristine',
    },
    {
      board: () => {
        const board = structuredClone(EmptyBoard);
        board['c3'] = board['b1'];
        board['b1'] = null;
        return board;
      },
      position: 'c2',
      expectedPositions: [],
      message: 'white knight jumped on a square in front of a pawn',
    },
  ])(
    'should compute positions when $message',
    ({ board, expectedPositions, position }) => {
      const actualPositions = getPawnAvailablePositions({
        board: board(),
        position,
      });

      expect(actualPositions).toEqual(
        expect.arrayContaining(expectedPositions)
      );
    }
  );
});
