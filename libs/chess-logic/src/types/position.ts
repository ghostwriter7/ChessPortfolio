import { letters } from "../consts/letters";

export type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Position = `${Letter}${RowNumber}`;

export const isValidRowIndex = (index: number): index is RowNumber => index >= 1 && index <= 8;

export const isValidLetter = (value: string): value is Letter => letters.includes(value as Letter);