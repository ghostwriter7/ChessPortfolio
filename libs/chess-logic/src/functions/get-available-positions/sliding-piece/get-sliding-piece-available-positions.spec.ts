import { Board } from '../../../types/board';
import { UntouchedBoard } from '../../../consts/untouched-board';
import { Position } from '../../../types/position';
import { getSlidingPieceAvailablePositions } from './get-sliding-piece-available-positions';

type TestCase = {
  position: Position;
  board: Board;
  expectedPositions: Position[];
};

describe('getSlidingPieceAvailablePositions', () => {
  describe('Rook', () => {
    test.each<TestCase>([
      {
        position: 'a1',
        board: UntouchedBoard,
        expectedPositions: [],
      },
      {
        position: 'a1',
        board: { ...UntouchedBoard, a2: null },
        expectedPositions: ['a2', 'a3', 'a4', 'a5', 'a6', 'a7'],
      },
      {
        position: 'd5',
        board: { ...UntouchedBoard, d5: UntouchedBoard.a1, a1: null },
        expectedPositions: [
          'c5',
          'b5',
          'a5',
          'd6',
          'd7',
          'd4',
          'd3',
          'e5',
          'f5',
          'g5',
          'h5',
        ],
      },
    ])(
      'should compute available positions for a rook piece',
      ({ position, board, expectedPositions }) => {
        const actualPositions = getSlidingPieceAvailablePositions(
          board,
          'rook',
          position
        );

        expect(actualPositions.length).toBe(expectedPositions.length);
        expect(actualPositions).toEqual(
          expect.arrayContaining(expectedPositions)
        );
      }
    );
  });

  describe('Bishop', () => {
    test.each<TestCase>([
      {
        position: 'c1',
        board: UntouchedBoard,
        expectedPositions: [],
      },
      {
        position: 'c1',
        board: { ...UntouchedBoard, b2: null, d2: null },
        expectedPositions: ['b2', 'd2', 'a3', 'e3', 'f4', 'g5', 'h6'],
      },
      {
        position: 'f4',
        board: { ...UntouchedBoard, f4: UntouchedBoard.c1, c1: null },
        expectedPositions: ['d6', 'e5', 'g5', 'h6', 'g3', 'e3', 'c7'],
      },
    ])(
      'should compute available positions for a bishop piece',
      ({ position, board, expectedPositions }) => {
        const actualPositions = getSlidingPieceAvailablePositions(
          board,
          'bishop',
          position
        );

        expect(actualPositions.length).toBe(expectedPositions.length);
        expect(actualPositions).toEqual(
          expect.arrayContaining(expectedPositions)
        );
      }
    );
  });

  describe('Queen', () => {
    test.each<TestCase>([
      {
        position: 'd1',
        board: UntouchedBoard,
        expectedPositions: [],
      },
      {
        position: 'd8',
        board: UntouchedBoard,
        expectedPositions: [],
      },
      {
        position: 'd1',
        board: { ...UntouchedBoard, d2: null, d4: UntouchedBoard.d2 },
        expectedPositions: ['d2', 'd3'],
      },
      {
        position: 'e4',
        board: { ...UntouchedBoard, d1: null, e4: UntouchedBoard.d1 },
        expectedPositions: [
          'a4',
          'b4',
          'c4',
          'd4',
          'f4',
          'g4',
          'h4',
          'e3',
          'e5',
          'e6',
          'e7',
          'd5',
          'c6',
          'b7',
          'f5',
          'g6',
          'h7',
          'd3',
          'f3',
        ],
      },
    ])(
      'should compute available positions for a queen piece',
      ({ position, board, expectedPositions }) => {
        const actualPositions = getSlidingPieceAvailablePositions(
          board,
          'queen',
          position
        );

        expect(actualPositions.length).toBe(expectedPositions.length);
        expect(actualPositions).toEqual(
          expect.arrayContaining(expectedPositions)
        );
      }
    );
  });
});
