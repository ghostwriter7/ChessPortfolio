import {
  getBottomSibling,
  getLeftBottomSibling,
  getLeftSibling,
  getLeftTopSibling,
  getRightBottomSibling,
  getRightSibling,
  getRightTopSibling,
  GetSiblingFn,
  getTopSibling,
} from '../functions/get-sibling-position/get-sibling-position';
import { SlidingPieceName } from '../types/piece-name';

export const slidingPieceMovementFns: Record<SlidingPieceName, GetSiblingFn[]> =
  {
    bishop: [
      getLeftTopSibling,
      getLeftBottomSibling,
      getRightBottomSibling,
      getRightTopSibling,
    ],
    rook: [getLeftSibling, getBottomSibling, getRightSibling, getTopSibling],
    queen: [
      getLeftTopSibling,
      getLeftSibling,
      getLeftBottomSibling,
      getBottomSibling,
      getRightBottomSibling,
      getRightSibling,
      getRightTopSibling,
      getTopSibling,
    ],
  };
