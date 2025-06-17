import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
  ViewEncapsulation,
} from '@angular/core';
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
  MatListItemTitle,
} from '@angular/material/list';
import { Log } from '../../models/log';
import { GameLogger } from '../../services/game-logger/game-logger';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-game-logs',
  imports: [
    DatePipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatList,
    MatListItem,
    MatDivider,
    MatListItemTitle,
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
