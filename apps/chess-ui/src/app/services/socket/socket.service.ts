import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BaseEventSubClass, CommandInstance } from '@chess-logic';

@Injectable({ providedIn: 'root' })
export class SocketService {
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

  public doTaskOnEvent<TPayload>(
    event: BaseEventSubClass<TPayload>,
    handler: (payload: TPayload) => void
  ): void {
    this.socket.on(event.prototype.name, handler);
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
