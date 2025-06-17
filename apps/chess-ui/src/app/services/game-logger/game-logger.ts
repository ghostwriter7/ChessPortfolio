import {
  inject,
  Injectable,
  SecurityContext,
  Signal,
  signal,
} from '@angular/core';
import { Log } from '../../models/log';
import { GameMediator } from '../game-mediator/game-mediator';
import { LogCreatedEvent, pieceNames } from '@chess-logic';
import { GameStateStore } from '../game-state-store/game-state-store';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class GameLogger {
  public readonly $logs: Signal<Log[]>;

  private readonly logs = signal<Log[]>([]);
  private readonly gameMediator = inject(GameMediator);
  private readonly gameStateStore = inject(GameStateStore);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.$logs = this.logs.asReadonly();

    this.gameMediator.subscribe(
      LogCreatedEvent,
      ({ payload, createdAt }: LogCreatedEvent): void => {
        const player = this.gameStateStore.$player();
        const opponent = this.gameStateStore.$opponent();

        let formattedMessage = payload;

        if (player?.name && formattedMessage.includes(player.name)) {
          formattedMessage = formattedMessage.replace(
            player.name,
            `<span class="player ${player.color}">${player.name}</span>`
          );
        }

        if (opponent?.name && formattedMessage.includes(opponent.name)) {
          formattedMessage = formattedMessage.replace(
            opponent.name,
            `<span class="player ${opponent.color}">${opponent.name}</span>`
          );
        }

        const cellColorMap = this.gameStateStore.$cellColorMap();

        for (const [position, color] of cellColorMap) {
          if (formattedMessage.includes(position)) {
            formattedMessage = formattedMessage.replace(
              position,
              `<span class="cell ${color}">${position}</span>`
            );
          }
        }

        for (const pieceName of pieceNames) {
          if (formattedMessage.includes(pieceName)) {
            formattedMessage = formattedMessage.replace(
              pieceName,
              `<span class="piece ${pieceName}">${pieceName}</span>`
            );
          }
        }

        const sanitizedFormattedMessage = this.domSanitizer.sanitize(
          SecurityContext.HTML,
          formattedMessage
        );

        if (sanitizedFormattedMessage) {
          this.log(new Log(sanitizedFormattedMessage, createdAt));
        }
      }
    );
  }

  public log(log: Log): void {
    this.logs.update((logs) => [...logs, log]);
  }
}
