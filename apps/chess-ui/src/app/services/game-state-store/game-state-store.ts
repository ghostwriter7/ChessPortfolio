import { computed, Injectable, Signal, signal } from '@angular/core';
import {
  Board,
  BoardUpdatedEvent,
  Color,
  getAvailablePositions,
  Letter,
  MakeMoveCommand,
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

  private readonly rows = signal<Rows>(null);
  private readonly board = signal<Board>(UntouchedBoard);
  private readonly highlightedPositions = signal<Position[] | null>(null);
  private readonly selectedPosition = signal<Position | null>(null);
  private readonly player = signal<Player | null>(null);
  private readonly opponent = signal<Player | null>(null);

  constructor(private readonly gameMediator: GameMediator) {
    this.$rows = this.rows.asReadonly();
    this.$player = this.player.asReadonly();
    this.$opponent = this.opponent.asReadonly();

    this.gameMediator.subscribe(
      BoardUpdatedEvent,
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

  public handleBoardUpdatedEvent(boardUpdatedEvent: BoardUpdatedEvent): void {
    const boardUpdate = boardUpdatedEvent.payload;
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
      const availablePositions = getAvailablePositions(
        this.board(),
        currentSelectedPosition
      );

      if (availablePositions.includes(position)) {
        const makeMoveCommand = new MakeMoveCommand({
          from: currentSelectedPosition,
          to: position,
        });
        this.gameMediator.dispatch(makeMoveCommand);
        this.highlightedPositions.set(null);
        this.selectedPosition.set(null);
        return;
      }
    }

    const isOwnPiece = occupiedBy()?.color === this.$player()?.color;
    this.highlightedPositions.set(
      isOwnPiece ? getAvailablePositions(this.board(), position) : null
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
