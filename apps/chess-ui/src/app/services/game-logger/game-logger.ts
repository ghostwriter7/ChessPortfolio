import { Injectable, Signal, signal } from '@angular/core';
import { Log } from '../../models/log';
import { GameMediator } from '../game-mediator/game-mediator';
import { LogCreatedEvent } from '@chess-logic';

@Injectable({ providedIn: 'root' })
export class GameLogger {
  public readonly $logs: Signal<Log[]>;

  private readonly logs = signal<Log[]>([]);

  constructor(private readonly gameMediator: GameMediator) {
    this.$logs = this.logs.asReadonly();

    this.gameMediator.subscribe(
      LogCreatedEvent,
      (logCreated: LogCreatedEvent): void => {
        this.log(Log.from(logCreated));
      }
    );
  }

  public log(log: Log): void {
    this.logs.update((logs) => [...logs, log]);
  }
}
