import { computed, Injectable, Signal, signal } from '@angular/core';
import {
  Color,
  EmptyBoard,
  getAvailablePositions,
  Letter,
  PieceName,
  Position,
  RowNumber,
} from '@chess-logic';
import { Cell } from '../../types/cell';
import { Player } from '../../types/player';
import { Row } from '../../types/row';
import { CellClass } from '../../types/cell-class';
import { Board } from '../../types/board';

type State = {
  player: Player | null;
  opponent: Player | null;
  isPlayerTurn: boolean;
  board: {
    [position in Position]: {
      name: PieceName;
      color: Color;
    } | null;
  };
};

@Injectable({
  providedIn: 'root',
})
export class GameStateStore {
  public readonly $player = computed(() => this.state().player);
  public readonly $opponent = computed(() => this.state().opponent);
  public readonly $isPlayerTurn = computed(() => this.state().isPlayerTurn);
  public readonly $board: Signal<Board>;

  private readonly board = signal<Board>(null);
  private readonly state = signal<State>({
    player: null,
    opponent: null,
    isPlayerTurn: false,
    board: EmptyBoard,
  });
  private readonly highlightedPositions = signal<Position[] | null>(null);
  private readonly selectedPosition = signal<Position | null>(null);

  constructor() {
    this.$board = this.board.asReadonly();
  }

  public initializeBoard(playerColor: Color): void {
    const isBlackCell = (cellIndex: number, rowIndex: number): boolean =>
      (cellIndex + rowIndex) % 2 === 1;

    const rows: Row[] = new Array(8).fill(null).map((_, index) => {
      const rowIndex = index + 1;
      return {
        index: rowIndex,
        cells: new Array(8).fill(null).map((_, index) => {
          const cellIndex = (index + 1) as RowNumber;
          const position = this.createPositionFromCellAndRowIndexes(
            cellIndex,
            rowIndex
          );
          const color = isBlackCell(cellIndex, rowIndex) ? 'black' : 'white';

          return {
            color,
            index: cellIndex,
            position,
            occupiedBy: computed(() => this.state().board[position]),
            modifierClasses: this.createModifierClassesSignal(position, color),
          };
        }),
      };
    });

    this.board.set(playerColor === 'white' ? rows.reverse() : rows);
  }

  public handleCellClick({ occupiedBy, position }: Cell): void {
    const currentSelectedPosition = this.selectedPosition();

    if (currentSelectedPosition) {
      const availablePositions = getAvailablePositions(
        this.state().board,
        currentSelectedPosition
      );

      if (availablePositions.includes(position)) {
        // move piece and return
      }
    }

    const isOwnPiece = occupiedBy()?.color === this.$player()?.color;
    this.highlightedPositions.set(
      isOwnPiece ? getAvailablePositions(this.state().board, position) : null
    );
    this.selectedPosition.set(isOwnPiece ? position : null);
  }

  public setPlayerName(name: string): void {
    this.state.update((state) => ({
      ...state,
      player: { ...state.player, name },
    }));
  }

  public setPlayerColor(color: Color): void {
    this.state.update((state) => ({
      ...state,
      player: { ...state.player!, color },
    }));
  }

  public setOpponent(name: string, color: Color): void {
    this.state.update((state) => ({ ...state, opponent: { name, color } }));
  }

  public setPlayerTurn(): void {
    this.state.update((state) => ({ ...state, isPlayerTurn: true }));
  }

  public setOpponentTurn(): void {
    this.state.update((state) => ({ ...state, isPlayerTurn: false }));
  }

  private getLetterFromCellIndex(cellIndex: number): Letter {
    return String.fromCharCode(cellIndex + 96) as Letter;
  }

  private createModifierClassesSignal(
    position: Position,
    color: Color
  ): Signal<CellClass[]> {
    return computed<CellClass[]>(() => {
      const highlightedPositions = this.highlightedPositions();

      const { board, player } = this.state();
      const isInHighlightedPositions = highlightedPositions?.includes(position);

      if (isInHighlightedPositions && board[position]) {
        return [color, 'capture'];
      }

      if (isInHighlightedPositions) {
        return [color, 'move'];
      }

      if (this.selectedPosition() === position) {
        return [color, 'active'];
      }

      if (player?.color === board[position]?.color) {
        return [color, 'selectable'];
      }

      return [color];
    });
  }

  private createPositionFromCellAndRowIndexes(
    cellIndex: number,
    rowIndex: number
  ): Position {
    return `${this.getLetterFromCellIndex(cellIndex)}${rowIndex}` as Position;
  }
}
