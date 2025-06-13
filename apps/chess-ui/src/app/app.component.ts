import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { GameLogs } from './components/game-logs/game-logs';
import { Log } from './models/log';
import { GameLogger } from './services/game-logger/game-logger';
import { Color } from '@chess-logic';
import { GameStateStore } from './services/game-state-store/game-state-store';
import { Player } from './types/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ChessBoardComponent, ReactiveFormsModule, GameLogs],
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

  private socket!: Socket;

  constructor(
    private readonly gameStateStore: GameStateStore,
    private readonly gameLogger: GameLogger
  ) {
    this.player = this.gameStateStore.$player;
  }

  public ngOnInit(): void {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    this.socket.on(
      'gameStarted',
      ({ color, opponent }: { color: Color; opponent: string }) => {
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

    this.socket.on('gameEnded', (data: string) => {
      this.gameLogger.log(Log.of(data));
      this.gameStarted.set(false);
      alert(data);
    });
  }

  protected joinGame(): void {
    this.usernameControl.disable();
    const username = this.usernameControl.value;

    if (!username) return;

    this.socket
      .timeout(5000)
      .emit('joinGame', username, (err: unknown, response: string) => {
        if (err) {
          alert(err);
          this.usernameControl.enable();
        } else {
          this.gameLogger.log(Log.of(response));
          this.gameStateStore.setPlayerName(username);
        }
      });
  }

  protected leaveGame(): void {
    this.socket.emit('leaveGame');
    this.gameStarted.set(false);
  }
}
