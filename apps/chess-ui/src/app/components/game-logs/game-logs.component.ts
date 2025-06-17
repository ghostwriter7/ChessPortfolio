import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { Log } from '../../models/log';
import { GameLogger } from '../../services/game-logger/game-logger';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatDivider,
  MatList,
  MatListItem,
  MatListItemLine,
} from '@angular/material/list';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-game-logs',
  imports: [
    DatePipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatList,
    MatListItem,
    MatListItemLine,
    MatDivider,
  ],
  templateUrl: './game-logs.component.html',
  styleUrl: './game-logs.component.scss',
})
export class GameLogs {
  protected readonly logs: Signal<Log[]>;

  private readonly gameLogger = inject(GameLogger);

  constructor() {
    this.logs = this.gameLogger.$logs;
  }
}
