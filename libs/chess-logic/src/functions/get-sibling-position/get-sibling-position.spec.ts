import { Position } from '../../types/position';
import {
  getBottomSibling,
  getLeftBottomSibling,
  getLeftSibling,
  getLeftTopSibling,
  getRightBottomSibling,
  getRightSibling,
  getRightTopSibling,
  getSiblingPosition,
  getTopSibling,
} from './get-sibling-position';

describe('getSiblingPosition', () => {
  test.each([
    { position: 'a1', columnOffset: 3, rowOffset: 0, expectedPosition: 'd1' },
    { position: 'a1', columnOffset: 0, rowOffset: 3, expectedPosition: 'a4' },
    { position: 'h8', columnOffset: 1, rowOffset: 0, expectedPosition: null },
    { position: 'h8', columnOffset: 0, rowOffset: 1, expectedPosition: null },
    { position: 'a1', columnOffset: -1, rowOffset: 0, expectedPosition: null },
    { position: 'a1', columnOffset: 0, rowOffset: -1, expectedPosition: null },
    { position: 'd4', columnOffset: 2, rowOffset: 2, expectedPosition: 'f6' },
    { position: 'e5', columnOffset: -2, rowOffset: -2, expectedPosition: 'c3' },
    { position: 'g7', columnOffset: 3, rowOffset: 2, expectedPosition: null },
    { position: 'b2', columnOffset: -2, rowOffset: -3, expectedPosition: null },
  ])(
    'should return $expectedPosition when $position and $columnOffset and $rowOffset is passed',
    ({ position, columnOffset, rowOffset, expectedPosition }) =>
      expect(
        getSiblingPosition(position as Position, columnOffset, rowOffset)
      ).toEqual(expectedPosition)
  );
});

type TestCase = {
  position: Position;
  expectedPosition: Position | null;
};

describe('getLeftSibling', () => {
  test.each<TestCase>([
    { position: 'a1', expectedPosition: null },
    { position: 'b1', expectedPosition: 'a1' },
    { position: 'b8', expectedPosition: 'a8' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getLeftSibling(position)).toEqual(expectedPosition)
  );
});

describe('getRightSibling', () => {
  test.each<TestCase>([
    { position: 'a1', expectedPosition: 'b1' },
    { position: 'h8', expectedPosition: null },
    { position: 'g7', expectedPosition: 'h7' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getRightSibling(position)).toEqual(expectedPosition)
  );
});

describe('getTopSibling', () => {
  test.each<TestCase>([
    { position: 'a1', expectedPosition: 'a2' },
    { position: 'a8', expectedPosition: null },
    { position: 'a7', expectedPosition: 'a8' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getTopSibling(position)).toEqual(expectedPosition)
  );
});

describe('getBottomSibling', () => {
  test.each<TestCase>([
    { position: 'a1', expectedPosition: null },
    { position: 'a8', expectedPosition: 'a7' },
    { position: 'a2', expectedPosition: 'a1' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getBottomSibling(position)).toEqual(expectedPosition)
  );
});

describe('getLeftBottomSibling', () => {
  test.each<TestCase>([
    { position: 'b2', expectedPosition: 'a1' },
    { position: 'a1', expectedPosition: null },
    { position: 'h8', expectedPosition: 'g7' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getLeftBottomSibling(position)).toEqual(expectedPosition)
  );
});

describe('getRightBottomSibling', () => {
  test.each<TestCase>([
    { position: 'b2', expectedPosition: 'c1' },
    { position: 'a1', expectedPosition: null },
    { position: 'g8', expectedPosition: 'h7' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getRightBottomSibling(position)).toEqual(expectedPosition)
  );
});

describe('getRightTopSibling', () => {
  test.each<TestCase>([
    { position: 'b2', expectedPosition: 'c3' },
    { position: 'h8', expectedPosition: null },
    { position: 'g7', expectedPosition: 'h8' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getRightTopSibling(position)).toEqual(expectedPosition)
  );
});

describe('getLeftTopSibling', () => {
  test.each<TestCase>([
    { position: 'b2', expectedPosition: 'a3' },
    { position: 'h8', expectedPosition: null },
    { position: 'h7', expectedPosition: 'g8' },
  ])(
    'should return $expectedPosition when $position is passed',
    ({ position, expectedPosition }) =>
      expect(getLeftTopSibling(position)).toEqual(expectedPosition)
  );
});
