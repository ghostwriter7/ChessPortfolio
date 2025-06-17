import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessBoard } from '../../components/chess-board/chess-board.component';
import { GameLogs } from '../../components/game-logs/game-logs.component';
import { MatButton } from '@angular/material/button';
import { Player } from '../../types/player';
import { GameStateStore } from '../../services/game-state-store/game-state-store';
import { GameMediator } from '../../services/game-mediator/game-mediator';
import {
  GameEndedEvent,
  GameStartedEvent,
  getOppositeColor,
  JoinGameCommand,
  LeaveGameCommand,
} from '@chess-logic';

@Component({
  selector: 'app-game-page',
  imports: [CommonModule, ChessBoard, GameLogs, MatButton],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements OnInit {
  public username = input.required<string>();

  protected readonly gameStarted = signal(false);
  protected readonly isAnonymous = computed(
    () => !this.gameStateStore.$player()
  );
  protected readonly player: Signal<Player | null>;
  protected readonly opponentName = computed(
    () => this.gameStateStore.$opponent()?.name
  );

  private readonly gameStateStore = inject(GameStateStore);
  private readonly gameMediator = inject(GameMediator);

  constructor() {
    this.player = this.gameStateStore.$player;
  }

  public ngOnInit(): void {
    this.joinGame(this.username());

    this.gameMediator.subscribe(GameStartedEvent, ({ payload }) => {
      const playerName = this.gameStateStore.$player()?.name;
      const playerColor = playerName === payload.white ? 'white' : 'black';
      const opponentColor = getOppositeColor(playerColor);

      this.gameStateStore.setPlayerColor(playerColor);
      this.gameStateStore.setOpponent(payload[opponentColor], opponentColor);
      this.gameStateStore.initializeBoard(playerColor);

      if (playerColor === 'white') this.gameStateStore.setPlayerTurn();
      this.gameStarted.set(true);
    });

    this.gameMediator.subscribe(GameEndedEvent, () => {
      this.gameStarted.set(false);
    });
  }

  protected joinGame(name: string): void {
    this.gameMediator.dispatch(
      new JoinGameCommand({ name }),
      5000,
      (err: unknown) => {
        if (err) {
          alert(err);
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
