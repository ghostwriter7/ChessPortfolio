import { Component, computed, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { ChessBoard } from './components/chess-board/chess-board';
import { GameLogs } from './components/game-logs/game-logs';
import { Log } from './models/log';
import { GameLogger } from './services/game-logger';
import { Color } from './types/color';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    ChessBoard,
    ReactiveFormsModule,
    GameLogs
  ],
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected isAnonymous = computed(() => !this.loggedAs());
  protected isPlaying = signal(false);
  protected loggedAs = signal('');
  protected opponent = signal('');
  protected usernameControl = new FormControl('', Validators.required);

  private socket!: Socket;

  constructor(private readonly gameLogger: GameLogger) {
  }

  public ngOnInit(): void {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    this.socket.on('gameStarted', ({ color, opponent }: { color: Color, opponent: string }) => {
      this.gameLogger.log(Log.of(`You're playing ${color} against ${opponent}`));
      this.opponent.set(opponent);
      this.isPlaying.set(true);
    });

    this.socket.on('gameEnded', (data: string) => {
      this.gameLogger.log(Log.of(data));
      this.isPlaying.set(false);
      this.opponent.set('');
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
          this.loggedAs.set(username);
        }
      });
  }

  protected leaveGame(): void {
    this.socket.emit('leaveGame');
    this.isPlaying.set(false);
    this.opponent.set('');
  }
}
