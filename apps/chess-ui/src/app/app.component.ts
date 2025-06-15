import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GameEndedEvent,
  GameStartedEvent,
  getOppositeColor,
  JoinGameCommand,
  LeaveGameCommand,
} from '@chess-logic';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { GameLogsComponent } from './components/game-logs/game-logs.component';
import { GameStateStore } from './services/game-state-store/game-state-store';
import { GameMediator } from './services/game-mediator/game-mediator';
import { Player } from './types/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ChessBoardComponent, ReactiveFormsModule, GameLogsComponent],
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  protected readonly gameStarted = signal(false);
  protected readonly isAnonymous = computed(
    () => !this.gameStateStore.$player()
  );
  protected readonly player: Signal<Player | null>;
  protected readonly opponentName = computed(
    () => this.gameStateStore.$opponent()?.name
  );
  protected readonly usernameControl = new FormControl(
    Math.random().toFixed(2).toString(),
    Validators.required
  );

  constructor(
    private readonly gameStateStore: GameStateStore,
    private readonly gameMediator: GameMediator
  ) {
    this.player = this.gameStateStore.$player;
  }

  public ngOnInit(): void {
    this.gameMediator.subscribe(
      GameStartedEvent,
      ({ payload: { color, opponent } }) => {
        this.gameStateStore.setPlayerColor(color);
        this.gameStateStore.setOpponent(opponent, getOppositeColor(color));
        this.gameStateStore.initializeBoard(color);
        if (color === 'white') this.gameStateStore.setPlayerTurn();
        this.gameStarted.set(true);
      }
    );

    this.gameMediator.subscribe(GameEndedEvent, () => {
      this.gameStarted.set(false);
    });
  }

  protected joinGame(): void {
    this.usernameControl.disable();
    const name = this.usernameControl.value;

    if (!name) return;

    this.gameMediator.dispatch(
      new JoinGameCommand({ name }),
      5000,
      (err: unknown) => {
        if (err) {
          alert(err);
          this.usernameControl.enable();
        } else {
          this.gameStateStore.setPlayerName(name);
        }
      }
    );
  }

  protected leaveGame(): void {
    this.gameMediator.dispatch(
      new LeaveGameCommand({ reason: 'User clicked leave button' })
    );
    this.gameStarted.set(false);
  }
}
