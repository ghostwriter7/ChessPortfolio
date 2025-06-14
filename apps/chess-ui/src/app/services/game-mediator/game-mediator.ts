import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CommandInstance, EventClass, EventHandler } from '@chess-logic';

@Injectable({ providedIn: 'root' })
export class GameMediator {
  private readonly eventHandlers = new Map<
    EventClass<any>,
    EventHandler<any>[]
  >();

  private readonly socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
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

  public subscribe<TPayload>(
    event: EventClass<TPayload>,
    handler: EventHandler<TPayload>
  ): void {
    const eventName = event.prototype.name;
    const existingHandlers = this.eventHandlers.get(eventName) || [];
    this.eventHandlers.set(eventName, [...existingHandlers, handler]);
    this.socket.on(eventName, handler);
  }

  public unsubscribe<TPayload>(
    event: EventClass<TPayload>,
    handler: EventHandler<TPayload>
  ): void {
    const eventName = event.prototype.name;
    const existingHandlers = this.eventHandlers.get(eventName) || [];
    this.eventHandlers.set(
      eventName,
      existingHandlers.filter((existingHandler) => existingHandler !== handler)
    );
    this.socket.off(eventName, handler);
  }

  public dispatch<TPayload, TResponse = unknown>(
    command: CommandInstance<TPayload>,
    timeout?: number,
    responseHandler?: (err: unknown, response: TResponse) => void
  ): void {
    if (timeout) {
      this.socket
        .timeout(timeout)
        .emit(command.name, command.payload, responseHandler);
    } else {
      this.socket.emit(command.name, command.payload);
    }
  }
}
