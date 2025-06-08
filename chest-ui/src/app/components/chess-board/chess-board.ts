import { NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Color } from '@app/types/color';

type Row = {
  cells: Cell[];
  index: number;
}

type Cell = {
  color: Color;
  occupiedBy: Figure | null;
  index: number;
  position: string;
}

type FigureName = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

type Figure = {
  name: FigureName;
  color: Color;
}

@Component({
  selector: 'app-chess-board',
  imports: [
    NgClass
  ],
  templateUrl: './chess-board.html',
  styleUrl: './chess-board.css'
})
export class ChessBoard implements OnInit {
  public rows = signal<Row[]>([]);

  public ngOnInit(): void {
    const rows = new Array(8).fill(null).map((_, index) => {
      const rowIndex = index + 1;
      const isOddRow = rowIndex % 2 === 1;
      return {
        index: rowIndex,
        cells: new Array(8).fill(null).map((_, index) => {
          const cellIndex = index + 1;
          const position = `${rowIndex}${this.getLetterFromCellIndex(cellIndex)}`;
          const isOddCell = cellIndex % 2 === 1;
          return {
            color: isOddRow ? (isOddCell ? 'black' : 'white') : (isOddCell ? 'white' : 'black'),
            index: cellIndex,
            position,
            occupiedBy: this.getDefaultFigureForPosition(position)
          };
        })
      }
    }).reverse() as Row[];

    this.rows.set(rows);
  }

  private getLetterFromCellIndex(cellIndex: number): string {
    return String.fromCharCode(cellIndex + 96);
  }

  private getDefaultFigureForPosition(position: string): Figure | null {
    const isWhitePawnRow = position.startsWith('2');
    if (isWhitePawnRow) {
      return { name: 'pawn', color: 'white' }
    }

    const isBlackPawnRow = position.startsWith('7');
    if (isBlackPawnRow) {
      return { name: 'pawn', color: 'black' }
    }

    if (position.startsWith('1')) {
      const name = this.getFigureNameFromPosition(position);
      if (name) return { name, color: 'white' }
    }

    if (position.startsWith('8')) {
      const name = this.getFigureNameFromPosition(position);
      if (name) return { name, color: 'black' }
    }

    return null;
  }

  private getFigureNameFromPosition(position: string): FigureName | null {
    if (position.endsWith('a') || position.endsWith('h'))
      return 'rook';

    if (position.endsWith('b') || position.endsWith('g'))
      return 'knight';

    if (position.endsWith('c') || position.endsWith('f'))
      return 'bishop';

    if (position.endsWith('d')) {
      return 'queen';
    }

    if (position.endsWith('e')) {
      return 'king';
    }

    return null;
  }

}
