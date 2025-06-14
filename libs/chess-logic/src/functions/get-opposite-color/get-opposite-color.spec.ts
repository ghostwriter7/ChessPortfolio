import { getOppositeColor } from './get-opposite-color';

describe('getOppositeColor', () => {
  it('should return black', () =>
    expect(getOppositeColor('white')).toBe('black'));

  it('should return white', () =>
    expect(getOppositeColor('black')).toBe('white'));
});
