import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { Log } from '../../models/log';
import { GameLogger } from '../../services/game-logger/game-logger';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-game-logs',
  imports: [DatePipe],
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
