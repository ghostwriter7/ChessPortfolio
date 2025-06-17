import { Board } from '../../types/board';
import { Color } from '../../types/color';
import { Position } from '../../types/position';
import { UntouchedBoard } from '../../consts/untouched-board';
import { findKingPosition } from './find-king-position';
import { movePiece, mutateBoard } from '../mutate-board/mutate-board';

describe('findKingPosition', () => {
  test.each<{ board: Board; color: Color; expectedPosition: Position }>([
    {
      board: UntouchedBoard,
      color: 'white',
      expectedPosition: 'e1',
    },
    {
      board: UntouchedBoard,
      color: 'black',
      expectedPosition: 'e8',
    },
    {
      board: mutateBoard(movePiece('e1', 'f5')),
      color: 'white',
      expectedPosition: 'f5',
    },
    {
      board: mutateBoard(movePiece('e8', 'c4')),
      color: 'black',
      expectedPosition: 'c4',
    },
  ])(
    'should return $expectedPosition when $color king is found on the board',
    ({ board, color, expectedPosition }) => {
      const actualPosition = findKingPosition(board, color);

      expect(actualPosition).toBe(expectedPosition);
    }
  );

  it('should throw an exception when the king of specified color is not found on the board', () => {
    const board = { ...UntouchedBoard, e1: null };

    expect(() => findKingPosition(board, 'white')).toThrow(
      'white king not found on board'
    );
  });
});
