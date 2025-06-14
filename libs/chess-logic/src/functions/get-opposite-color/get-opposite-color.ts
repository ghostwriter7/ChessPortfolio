import { Color } from '../../types/color';

export function getOppositeColor(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}
