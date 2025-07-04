import { CommonModule } from '@angular/common';
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
import { MatButton } from '@angular/material/button';
import {
  GAME_ENDED_EVENT,
  GAME_STARTED_EVENT,
  getOppositeColor,
  JOIN_GAME_COMMAND,
  LEAVE_GAME_COMMAND,
  LOGIN_COMMAND,
} from '@chess-logic';
import { AuthService } from '../../auth/services/auth/auth.service';
import { ChessBoard } from '../../components/chess-board/chess-board.component';
import { GameLogs } from '../../components/game-logs/game-logs.component';
import { GameMediator } from '../../services/game-mediator/game-mediator';
import { GameStateStore } from '../../services/game-state-store/game-state-store';
import { Player } from '../../types/player';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from '../../ui/alert-popup/alert-popup.component';

@Component({
  selector: 'app-game-page',
  imports: [CommonModule, ChessBoard, GameLogs, MatButton],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements OnInit {
  public gameId = input.required<string>();

  protected readonly gameStarted = signal(false);
  protected readonly isAnonymous = computed(
    () => !this.gameStateStore.$player()
  );
  protected readonly player: Signal<Player | null>;
  protected readonly opponentName = computed(
    () => this.gameStateStore.$opponent()?.name
  );

  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly gameStateStore = inject(GameStateStore);
  private readonly gameMediator = inject(GameMediator);

  constructor() {
    this.player = this.gameStateStore.$player;
  }

  public ngOnInit(): void {
    const token = this.authService.token;
    const username = this.authService.$user();

    if (token && username) {
      this.gameMediator.dispatch(LOGIN_COMMAND, { token });

      this.gameMediator.dispatch(
        JOIN_GAME_COMMAND,
        { gameId: this.gameId() },
        10000,
        (err: unknown) => {
          if (err) {
            this.dialog.open(AlertPopupComponent, {
              data: {
                title: 'Error',
                message:
                  typeof err === 'string' ? err : 'Internal Server Error',
              },
            });
          } else {
            this.gameStateStore.setPlayerName(username);
          }
        }
      );
    }

    this.gameMediator.subscribe(GAME_STARTED_EVENT, ({ white, black }) => {
      const playerName = this.gameStateStore.$player()?.name;
      const playerColor = playerName === white ? 'white' : 'black';
      const opponentName = playerName === white ? black : white;
      const opponentColor = getOppositeColor(playerColor);

      this.gameStateStore.setPlayerColor(playerColor);
      this.gameStateStore.setOpponent(opponentName, opponentColor);
      this.gameStateStore.initializeBoard(playerColor);

      if (playerColor === 'white') this.gameStateStore.setPlayerTurn();
      this.gameStarted.set(true);
    });

    this.gameMediator.subscribe(GAME_ENDED_EVENT, () => {
      this.gameStarted.set(false);
    });
  }

  protected leaveGame(): void {
    this.gameMediator.dispatch(LEAVE_GAME_COMMAND, {
      reason: 'User clicked leave button',
    });
    this.gameStarted.set(false);
  }
}
