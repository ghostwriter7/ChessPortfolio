export type PieceName = 'pawn' | 'knight' | 'king' | SlidingPieceName;

export type SlidingPieceName = 'queen' | 'rook' | 'bishop';

export const isSlidingPiece = (name: PieceName): name is SlidingPieceName =>
  ['queen', 'rook', 'bishop'].includes(name);

export const pieceNames: PieceName[] = [
  'pawn',
  'knight',
  'king',
  'queen',
  'rook',
  'bishop',
];
