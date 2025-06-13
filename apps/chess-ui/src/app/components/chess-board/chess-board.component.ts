import { NgClass } from '@angular/common';
import { Component, computed, Signal } from '@angular/core';
import { GameStateStore } from '../../services/game-state-store/game-state-store';
import { Cell } from '../../types/cell';
import { Board } from '../../types/board';

@Component({
  selector: 'app-chess-board',
  imports: [NgClass],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css',
})
export class ChessBoardComponent {
  protected readonly active: Signal<boolean>;
  protected playerColor = computed(() => this.gameStateStore.$player()?.color);

  protected readonly board: Signal<Board>;
  protected readonly letters = new Array(8)
    .fill(null)
    .map((_, index) => String.fromCharCode(index + 65));

  constructor(private readonly gameStateStore: GameStateStore) {
    this.board = this.gameStateStore.$board;
    this.active = this.gameStateStore.$isPlayerTurn;
  }

  protected onCellClick(cell: Cell): void {
    this.gameStateStore.handleCellClick(cell);
  }
}
