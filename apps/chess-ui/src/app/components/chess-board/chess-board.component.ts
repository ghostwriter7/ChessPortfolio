import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { GameStateStore } from '../../services/game-state-store/game-state-store';
import { Cell } from '../../types/cell';
import { Rows } from '../../types/row';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chess-board',
  imports: [NgClass],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css',
})
export class ChessBoardComponent {
  protected readonly active: Signal<boolean>;

  protected readonly rows: Signal<Rows>;
  protected readonly letters = new Array(8)
    .fill(null)
    .map((_, index) => String.fromCharCode(index + 65));

  constructor(private readonly gameStateStore: GameStateStore) {
    this.rows = this.gameStateStore.$rows;
    this.active = this.gameStateStore.$isPlayerTurn;
  }

  protected onCellClick(cell: Cell): void {
    this.gameStateStore.handleCellClick(cell);
  }
}
