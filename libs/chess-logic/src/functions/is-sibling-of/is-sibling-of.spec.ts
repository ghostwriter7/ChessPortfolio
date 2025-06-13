import { Position } from '../../types/position';
import { isSiblingOf } from './is-sibling-of';

type TestCase = {
  position: Position;
  anotherPosition: Position;
  expected: boolean;
};

describe('isSiblingOf', () => {
  test.each<TestCase>([
    { position: 'a1', anotherPosition: 'a2', expected: true },
    { position: 'a1', anotherPosition: 'a3', expected: false },
    { position: 'a1', anotherPosition: 'b1', expected: true },
    { position: 'a1', anotherPosition: 'b2', expected: true },
    { position: 'd5', anotherPosition: 'e4', expected: true },
    { position: 'd5', anotherPosition: 'g5', expected: false },
    { position: 'd5', anotherPosition: 'd7', expected: false },
    { position: 'd5', anotherPosition: 'f3', expected: false },
    { position: 'd5', anotherPosition: 'b5', expected: false },
    { position: 'd5', anotherPosition: 'e5', expected: true },
  ])(
    'should return $expected when $position and $anotherPosition is passed',
    ({ position, anotherPosition, expected }) =>
      expect(isSiblingOf(position, anotherPosition)).toEqual(expected)
  );
});
