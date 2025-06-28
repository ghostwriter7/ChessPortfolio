import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { User } from '../../auth/model/user';
import { MatButton } from '@angular/material/button';
import { io } from 'socket.io-client';
import {
  CHALLENGE_PLAYER_COMMAND,
  GAME_REQUESTED_EVENT,
  GameRequestedEventPayload,
  LOGIN_COMMAND,
  PLAYER_JOINED_EVENT,
  PLAYER_LEFT_EVENT,
  PLAYER_LIST_CHANGED_EVENT,
  PlayerJoinedEventPayload,
  PlayerListChangedEventPayload,
  PLAYERS_MATCHED_EVENT,
  PlayersMatchedEventPayload,
} from '@chess-logic';
import { AuthService } from '../../auth/services/auth/auth.service';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby-page',
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatButton,
    SpinnerComponent,
  ],
  templateUrl: './lobby-page.component.html',
  styleUrl: './lobby-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyPageComponent implements OnInit, OnDestroy {
  protected readonly players = signal<User[]>([]);
  protected readonly displayedColumns: Iterable<string> = [
    'index',
    'username',
    'action',
  ];

  private readonly authService = inject(AuthService);
  private readonly socket = io('http://localhost:4204', {
    transports: ['websocket'],
    withCredentials: true,
  });
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    const token = this.authService.token;
    if (!token) {
      throw new Error('Token is not set');
    }
    this.socket.emit(LOGIN_COMMAND, { token });

    this.socket.on(
      PLAYER_JOINED_EVENT,
      ({ username }: PlayerJoinedEventPayload) => {
        this.players.update((players) => [...players, new User(username)]);
      }
    );

    this.socket.on(
      PLAYER_LEFT_EVENT,
      ({ username }: PlayerJoinedEventPayload) => {
        this.players.update((players) =>
          players.filter((player) => player.username !== username)
        );
      }
    );

    this.socket.on(
      PLAYER_LIST_CHANGED_EVENT,
      ({ usernames }: PlayerListChangedEventPayload) => {
        this.players.set(usernames.map((player) => new User(player)));
      }
    );

    this.socket.on(
      GAME_REQUESTED_EVENT,
      (
        { opponent }: GameRequestedEventPayload,
        ack: (response: boolean) => void
      ) => {
        const response = confirm(
          `You are being challenged by ${opponent}. Do you want to accept?`
        );
        ack(response);
      }
    );

    this.socket.on(
      PLAYERS_MATCHED_EVENT,
      ({ gameId, playerA, playerB }: PlayersMatchedEventPayload) => {
        this.socket.disconnect();
        this.router.navigate(['/game', gameId], {
          queryParams: { playerA, playerB },
        });
      }
    );
  }

  public ngOnDestroy(): void {
    if (!this.socket.disconnected) this.socket.disconnect();
  }

  protected async challengePlayer(opponent: string): Promise<void> {
    try {
      const { response, message } = (await this.socket
        .timeout(20000)
        .emitWithAck(CHALLENGE_PLAYER_COMMAND, { opponent })) as {
        response: boolean;
        message?: string;
      };

      alert(
        response
          ? 'Challenge has been accepted. The game will start shortly.'
          : message
      );
    } catch (err) {
      alert('Network error');
      console.log(err);
    }
  }
}
