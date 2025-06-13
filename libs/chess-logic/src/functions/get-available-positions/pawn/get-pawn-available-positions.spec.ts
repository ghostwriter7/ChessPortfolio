import { EmptyBoard } from '../../../consts/empty-board';
import { Board } from '../../../types/board';
import { Position } from '../../../types/position';
import { getPawnAvailablePositions } from './get-pawn-available-positions';

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
      message: 'White pawn is at its starting position on an empty board',
    },
    {
      board: () => EmptyBoard,
      position: 'd7',
      expectedPositions: ['d6', 'd5'],
      message: 'Black pawn is at its starting position on an empty board',
    },
    {
      board: () => {
        const board = structuredClone(EmptyBoard);
        board.c3 = board.b1;
        board.b1 = null;
        return board;
      },
      position: 'c2',
      expectedPositions: [],
      message: 'White knight blocks the path of a pawn',
    },
    {
      board: () => {
        const board = structuredClone(EmptyBoard);
        board.e6 = board.e2;
        board.e2 = null;
        return board;
      },
      position: 'e6',
      expectedPositions: ['d7', 'f7'],
      message:
        'White pawn can capture diagonally when enemy pieces are present',
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

  test.each<TestCase>([
    {
      board: () => EmptyBoard,
      expectedPositions: [],
      position: 'e2',
      message: 'White pawn is at its starting position on an empty board',
    },
    {
      board: () => EmptyBoard,
      expectedPositions: [],
      position: 'b7',
      message: 'Black pawn is at its starting position on an empty board',
    },
    {
      board: () => {
        const board = structuredClone(EmptyBoard);
        board.a6 = board.a2;
        board.a2 = null;
        return board;
      },
      expectedPositions: ['b7'],
      position: 'a6',
      message: 'White pawn can capture an enemy piece on the right diagonal',
    },
    {
      board: () => {
        const board = structuredClone(EmptyBoard);
        board.h6 = board.h2;
        board.h2 = null;
        return board;
      },
      expectedPositions: ['g7'],
      position: 'h6',
      message: 'White pawn can capture an enemy piece on the left diagonal',
    },
    {
      board: () => {
        const board = structuredClone(EmptyBoard);
        board.c6 = board.c2;
        board.c2 = null;
        return board;
      },
      expectedPositions: ['b7', 'd7'],
      position: 'c6',
      message: 'White pawn can capture enemy pieces on both diagonals',
    },
  ])(
    'should compute available attack positions when $message',
    ({ board, expectedPositions, position }) => {
      const actualPositions = getPawnAvailablePositions({
        board: board(),
        isAttackOnly: true,
        position,
      });

      expect(actualPositions).toEqual(
        expect.arrayContaining(expectedPositions)
      );
    }
  );
});
