import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import {
  Board,
  BOARD_UPDATED_EVENT,
  BoardUpdatedEventPayload,
  Color,
  getAvailablePositions,
  Letter,
  MAKE_MOVE_COMMAND,
  Position,
  RowNumber,
  UntouchedBoard,
} from '@chess-logic';
import { Cell } from '../../types/cell';
import { Player } from '../../types/player';
import { Row, Rows } from '../../types/row';
import { CellClass } from '../../types/cell-class';
import { GameMediator } from '../game-mediator/game-mediator';

@Injectable({
  providedIn: 'root',
})
export class GameStateStore {
  public readonly $player: Signal<Player | null>;
  public readonly $opponent: Signal<Player | null>;
  public readonly $isPlayerTurn = computed(() => !!this.player()?.isTurn);
  public readonly $rows: Signal<Rows>;
  public readonly $cellColorMap = computed<Map<Position, Color>>(() => {
    const rows = this.rows();
    if (!rows) return new Map();

    const cellColorEntries: [Position, Color][] = rows.flatMap(
      (row) =>
        row.cells.map((cell) => [cell.position, cell.color]) as [
          Position,
          Color
        ][]
    );
    return new Map<Position, Color>(cellColorEntries);
  });

  private readonly rows = signal<Rows>(null);
  private readonly board = signal<Board>(UntouchedBoard);
  private readonly highlightedPositions = signal<Position[] | null>(null);
  private readonly selectedPosition = signal<Position | null>(null);
  private readonly player = signal<Player | null>(null);
  private readonly opponent = signal<Player | null>(null);
  private readonly gameMediator = inject(GameMediator);

  constructor() {
    this.$rows = this.rows.asReadonly();
    this.$player = this.player.asReadonly();
    this.$opponent = this.opponent.asReadonly();

    this.gameMediator.subscribe(
      BOARD_UPDATED_EVENT,
      this.handleBoardUpdatedEvent.bind(this)
    );
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
            occupiedBy: computed(() => this.board()[position]),
            modifierClasses: this.createModifierClassesSignal(position, color),
          };
        }),
      };
    });

    this.rows.set(playerColor === 'white' ? rows.reverse() : rows);
  }

  public handleBoardUpdatedEvent(boardUpdate: BoardUpdatedEventPayload): void {
    this.board.update((board) => ({ ...board, ...boardUpdate }));
    this.highlightedPositions.set(null);
    this.selectedPosition.set(null);
    this.player.update((player) => ({
      ...player,
      isTurn: !this.$isPlayerTurn(),
    }));
  }

  public handleCellClick({ occupiedBy, position }: Cell): void {
    const currentSelectedPosition = this.selectedPosition();

    if (currentSelectedPosition) {
      const availablePositions = getAvailablePositions({
        board: this.board(),
        piecePosition: currentSelectedPosition,
      });

      if (availablePositions.includes(position)) {
        this.gameMediator.dispatch(MAKE_MOVE_COMMAND, {
          from: currentSelectedPosition,
          to: position,
        });
        this.highlightedPositions.set(null);
        this.selectedPosition.set(null);
        return;
      }
    }

    const isOwnPiece = occupiedBy()?.color === this.$player()?.color;
    this.highlightedPositions.set(
      isOwnPiece
        ? getAvailablePositions({
            board: this.board(),
            piecePosition: position,
          })
        : null
    );
    this.selectedPosition.set(isOwnPiece ? position : null);
  }

  public setPlayerName(name: string): void {
    this.player.update((player) => ({ ...player, name }));
  }

  public setPlayerColor(color: Color): void {
    this.player.update((player) => ({ ...player, color }));
  }

  public setOpponent(name: string, color: Color): void {
    this.opponent.set({ name, color });
  }

  public setPlayerTurn(): void {
    this.player.update((player) => ({ ...player, isTurn: true }));
  }

  public setOpponentTurn(): void {
    this.player.update((player) => ({ ...player, isTurn: false }));
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

      const board = this.board();
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

      if (this.player()?.color === board[position]?.color) {
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
