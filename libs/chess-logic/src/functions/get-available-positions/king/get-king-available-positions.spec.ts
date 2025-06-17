import { Board } from '../../../types/board';
import { Position } from '../../../types/position';
import { getKingAvailablePositions } from './get-king-available-positions';
import { UntouchedBoard } from '../../../consts/untouched-board';
import { movePiece, mutateBoard } from '../../mutate-board/mutate-board';

describe('getKingAvailablePositions', () => {
  test.each<{
    board: Board;
    kingPosition: Position;
    expectedPositions: Position[];
    message: string;
  }>([
    {
      board: UntouchedBoard,
      kingPosition: 'e1',
      expectedPositions: [],
      message:
        'When white king is at e1 on initial board setup, then it should have no available moves',
    },
    {
      board: UntouchedBoard,
      kingPosition: 'e8',
      expectedPositions: [],
      message:
        'When black king is at e8 on initial board setup, then it should have no available moves',
    },
    {
      board: mutateBoard(movePiece('e2', 'e4')),
      kingPosition: 'e1',
      expectedPositions: ['e2'],
      message:
        'When pawn at e2 moves to e4, then white king at e1 should be able to move to e2',
    },
    {
      board: mutateBoard(movePiece('e1', 'e4'), movePiece('e8', 'e6')),
      kingPosition: 'e4',
      expectedPositions: ['d4', 'f4', 'd3', 'f3', 'e3'],
      message:
        'When white king is at e4 and black king at e6, then white king should have 5 available moves',
    },
  ])(
    'should return available positions when $message',
    ({ board, kingPosition, expectedPositions }) => {
      const actualPositions = getKingAvailablePositions(board, kingPosition);

      expect(actualPositions).toEqual(
        expect.arrayContaining(expectedPositions)
      );
    }
  );
});
