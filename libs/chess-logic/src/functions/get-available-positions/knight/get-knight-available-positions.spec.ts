import { Board } from '../../../types/board';
import { EmptyBoard } from '../../../consts/empty-board';
import { Position } from '../../../types/position';
import { getKnightAvailablePositions } from './get-knight-available-positions';

describe('getKnightAvailablePositions', () => {
  test.each<{
    position: Position;
    board: Board;
    expectedPositions: Position[];
  }>([
    {
      position: 'b1',
      board: EmptyBoard,
      expectedPositions: ['a3', 'c3'],
    },
    {
      position: 'g1',
      board: EmptyBoard,
      expectedPositions: ['f3', 'h3'],
    },
    {
      position: 'b8',
      board: EmptyBoard,
      expectedPositions: ['a6', 'c6'],
    },
    {
      position: 'g8',
      board: EmptyBoard,
      expectedPositions: ['f6', 'h6'],
    },
    {
      position: 'c3',
      board: { ...EmptyBoard, c3: EmptyBoard.b1, b1: null },
      expectedPositions: ['b1', 'a4', 'b5', 'd5', 'e4'],
    },
    {
      position: 'd6',
      board: { ...EmptyBoard, d6: EmptyBoard.b1, b1: null },
      expectedPositions: ['b5', 'c4', 'e4', 'f5', 'f7', 'e8', 'c8', 'b7'],
    },
  ])(
    'should compute available positions for a knight piece',
    ({ position, board, expectedPositions }) => {
      const actualPositions = getKnightAvailablePositions(board, position);

      expect(actualPositions.length).toBe(expectedPositions.length);
      expect(actualPositions).toEqual(
        expect.arrayContaining(expectedPositions)
      );
    }
  );
});
