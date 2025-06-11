import { NgClass } from '@angular/common';
import { Component, computed, Signal } from '@angular/core';
import { GameStateStore } from '../../services/game-state-store/game-state-store';
import { Cell } from '../../types/cell';
import { Row } from '../../types/row';

@Component({
  selector: 'app-chess-board',
  imports: [
    NgClass
  ],
  templateUrl: './chess-board.html',
  styleUrl: './chess-board.css'
})
export class ChessBoard {
  protected readonly active: Signal<boolean>;
  protected playerColor = computed(() => this.gameStateStore.$player()?.color);

  protected readonly board: Signal<Row[]>;
  protected readonly letters =
    new Array(8).fill(null).map((_, index) => String.fromCharCode(index + 65));

  constructor(private readonly gameStateStore: GameStateStore) {
    this.board = this.gameStateStore.$board;
    this.active = this.gameStateStore.$isPlayerTurn;
  }

  protected selectCell(cell: Cell): void {
    this.gameStateStore.selectCell(cell);
  }
}
