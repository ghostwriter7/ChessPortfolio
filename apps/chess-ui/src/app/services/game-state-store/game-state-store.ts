import { computed, Injectable, signal } from '@angular/core';
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

type State = {
  highlightedPositions: Position[] | null;
  selectedPosition: Position | null;
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
  public readonly $board = computed(() => {
    const { board, highlightedPositions, selectedPosition } = this.state();

    const rows: Row[] = new Array(8).fill(null).map((_, index) => {
      const rowIndex = index + 1;
      const isOddRow = rowIndex % 2 === 1;
      return {
        index: rowIndex,
        cells: new Array(8).fill(null).map((_, index) => {
          const cellIndex = (index + 1) as RowNumber;
          const position = `${this.getLetterFromCellIndex(
            cellIndex
          )}${rowIndex}` as Position;
          const isOddCell = cellIndex % 2 === 1;
          const color = isOddRow
            ? isOddCell
              ? 'black'
              : 'white'
            : isOddCell
            ? 'white'
            : 'black';
          const modifierClasses = (
            highlightedPositions?.includes(position) && board[position]
              ? [color, 'capture']
              : highlightedPositions?.includes(position)
              ? [color, 'move']
              : selectedPosition === position
              ? [color, 'active']
              : [color]
          ) as CellClass[];

          return {
            color,
            index: cellIndex,
            position,
            occupiedBy: board[position],
            modifierClasses,
          };
        }),
      };
    });

    const player = this.state().player;
    if (!player || player!.color === 'white') return rows.reverse();

    return rows;
  });

  private readonly state = signal<State>({
    highlightedPositions: null,
    selectedPosition: null,
    player: null,
    opponent: null,
    isPlayerTurn: false,
    board: EmptyBoard,
  });

  public handleCellClick({ occupiedBy, position }: Cell): void {
    const currentSelectedPosition = this.state().selectedPosition;
    const isOwnPiece = occupiedBy?.color === this.$player()?.color;

    if (currentSelectedPosition) {
      const availablePositions = getAvailablePositions(
        this.state().board,
        currentSelectedPosition
      );

      if (availablePositions.includes(position)) {
        // move piece and return
      }
    }

    if (isOwnPiece) {
      const availablePositions = getAvailablePositions(
        this.state().board,
        position
      );
      this.state.update((state) => ({
        ...state,
        highlightedPositions: availablePositions,
        selectedPosition: position,
      }));
    } else {
      this.state.update((state) => ({
        ...state,
        highlightedPositions: null,
        selectedPosition: null,
      }));
    }
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
}
