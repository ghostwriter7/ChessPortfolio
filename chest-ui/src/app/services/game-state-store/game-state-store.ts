import { computed, Injectable, signal } from '@angular/core';
import { Player } from '@app/types/player';
import { Color, EmptyBoard, FigureName, Letter, Position, RowNumber } from '@chess-logic';
import { Row } from '@app/types/row';

type State = {
  player: Player | null;
  opponent: {
    name: string;
    color: Color;
  } | null;
  isPlayerTurn: boolean;
  board: {
    [position in Position]: {
    name: FigureName;
    color: Color;
  } | null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GameStateStore {
  public readonly $player = computed(() => this.state().player);
  public readonly $opponent = computed(() => this.state().opponent);
  public readonly $isPlayerTurn = computed(() => this.state().isPlayerTurn);
  public readonly $board = computed(() => {
    const board = this.state().board;

    const rows: Row[] = new Array(8).fill(null)
      .map((_, index) => {
        const rowIndex = index + 1;
        const isOddRow = rowIndex % 2 === 1;
        return {
          index: rowIndex,
          cells: new Array(8).fill(null).map((_, index) => {
            const cellIndex = index + 1 as RowNumber;
            const position = `${this.getLetterFromCellIndex(cellIndex)}${rowIndex}` as Position;
            const isOddCell = cellIndex % 2 === 1;
            return {
              color: isOddRow ? (isOddCell ? 'black' : 'white') : (isOddCell ? 'white' : 'black'),
              index: cellIndex,
              position,
              occupiedBy: board[ position ]
            };
          })
        }
      });

    const player = this.state().player;
    if (!player || player!.color === 'white') return rows.reverse();

    return rows;
  });

  private readonly state = signal<State>({ player: null, opponent: null, isPlayerTurn: false, board: EmptyBoard });

  public setPlayerName(name: string): void {
    this.state.update((state) => ({ ...state, player: { ...state.player, name } }));
  }

  public setPlayerColor(color: Color): void {
    this.state.update((state) => ({ ...state, player: { ...state.player!, color } }));
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
