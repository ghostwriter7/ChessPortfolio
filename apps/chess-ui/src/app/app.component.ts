import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GameEndedEvent,
  GameStartedEvent,
  JoinGameCommand,
  LeaveGameCommand,
} from '@chess-logic';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { GameLogsComponent } from './components/game-logs/game-logs.component';
import { Log } from './models/log';
import { GameLogger } from './services/game-logger/game-logger';
import { GameStateStore } from './services/game-state-store/game-state-store';
import { SocketService } from './services/socket/socket.service';
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
    private readonly gameLogger: GameLogger,
    private readonly socketService: SocketService
  ) {
    this.player = this.gameStateStore.$player;
  }

  public ngOnInit(): void {
    this.socketService.doTaskOnEvent(
      GameStartedEvent,
      ({ color, opponent }) => {
        this.gameLogger.log(
          Log.of(`You're playing ${color} against ${opponent}`)
        );
        this.gameStateStore.setPlayerColor(color);
        this.gameStateStore.setOpponent(
          opponent,
          color === 'white' ? 'black' : 'white'
        );
        this.gameStateStore.initializeBoard(color);
        if (color === 'white') this.gameStateStore.setPlayerTurn();
        this.gameStarted.set(true);
      }
    );

    this.socketService.doTaskOnEvent(GameEndedEvent, (data) => {
      this.gameLogger.log(Log.of(data));
      this.gameStarted.set(false);
      alert(data);
    });
  }

  protected joinGame(): void {
    this.usernameControl.disable();
    const name = this.usernameControl.value;

    if (!name) return;

    this.socketService.dispatch(
      new JoinGameCommand({ name }),
      5000,
      (err: unknown, response: string) => {
        if (err) {
          alert(err);
          this.usernameControl.enable();
        } else {
          this.gameLogger.log(Log.of(response));
          this.gameStateStore.setPlayerName(name);
        }
      }
    );
  }

  protected leaveGame(): void {
    this.socketService.dispatch(
      new LeaveGameCommand({ reason: 'User clicked leave button' })
    );
    this.gameStarted.set(false);
  }
}
