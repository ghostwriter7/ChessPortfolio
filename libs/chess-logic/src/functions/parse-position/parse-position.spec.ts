import { Letter, Position, RowNumber } from '../../types/position';
import { parsePosition } from './parse-position';

describe('parsePosition', () => {
  test.each<{ position: Position; expected: [Letter, RowNumber] }>([
    { position: 'a1', expected: ['a', 1] },
    { position: 'h8', expected: ['h', 8] },
    { position: 'a2', expected: ['a', 2] },
    { position: 'h7', expected: ['h', 7] },
    { position: 'a3', expected: ['a', 3] },
    { position: 'h6', expected: ['h', 6] },
  ])('should parse position', ({ position, expected }) =>
    expect(parsePosition(position)).toEqual(expected)
  );

  test.each<{ position: string; error: string }>([
    { position: 'a10', error: 'Position must be 2 characters long: a10' },
    { position: 'a0', error: 'Invalid row index: 0' },
    { position: 'a-1', error: 'Position must be 2 characters long: a-1' },
    { position: 'i1', error: 'Invalid letter: i' },
    { position: 'j5', error: 'Invalid letter: j' },
  ])(
    'should throw an exception when invalid position is passed',
    ({ error, position }) => {
      expect(() => parsePosition(position as Position)).toThrow(error);
    }
  );
});
