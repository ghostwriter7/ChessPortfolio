import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { Log } from '../../models/log';
import { GameLogger } from '../../services/game-logger/game-logger';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-game-logs',
  imports: [
    DatePipe
  ],
  templateUrl: './game-logs.html',
  styleUrl: './game-logs.css'
})
export class GameLogs {
  protected readonly logs: Signal<Log[]>;

  constructor(private readonly gameLogger: GameLogger) {
    this.logs = this.gameLogger.$logs;
  }

}
