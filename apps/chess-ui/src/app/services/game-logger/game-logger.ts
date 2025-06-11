import { Injectable, Signal, signal } from '@angular/core';
import { Log } from '../../models/log';

@Injectable({ providedIn: 'root' })
export class GameLogger {
  public readonly $logs: Signal<Log[]>;

  private readonly logs = signal<Log[]>([]);

  constructor() {
    this.$logs = this.logs.asReadonly();
  }

  public log(log: Log): void {
    this.logs.update((logs) => [...logs, log]);
  }
}
