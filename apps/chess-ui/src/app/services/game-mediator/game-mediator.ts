import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AppEvent, Command, CommandPayload, EventHandler } from '@chess-logic';

@Injectable({ providedIn: 'root' })
export class GameMediator {
  private readonly eventHandlers = new Map<AppEvent, EventHandler<any>[]>();

  private readonly socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4202', {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  }

  public subscribe<T extends AppEvent>(
    event: T,
    handler: EventHandler<T>
  ): void {
    const existingHandlers = this.eventHandlers.get(event) || [];
    this.eventHandlers.set(event, [...existingHandlers, handler]);
    // @ts-ignore
    this.socket.on(event, handler);
  }

  public unsubscribe<T extends AppEvent>(
    event: T,
    handler: EventHandler<T>
  ): void {
    const existingHandlers = this.eventHandlers.get(event) || [];
    this.eventHandlers.set(
      event,
      existingHandlers.filter((existingHandler) => existingHandler !== handler)
    );
    // @ts-ignore
    this.socket.off<T>(event, handler);
  }

  public dispatch<TCommand extends Command, TResponse = unknown>(
    command: TCommand,
    payload: CommandPayload<TCommand>,
    timeout?: number,
    responseHandler?: (err: unknown, response: TResponse) => void
  ): void {
    if (timeout) {
      this.socket.timeout(timeout).emit(command, payload, responseHandler);
    } else {
      this.socket.emit(command, payload);
    }
  }
}
