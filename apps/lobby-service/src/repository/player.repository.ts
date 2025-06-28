import { Socket } from 'socket.io';

export class PlayerRepository {
  private readonly usernameToSocketMap = new Map<string, Socket>();

  public add(username: string, socket: Socket): void {
    this.usernameToSocketMap.set(username, socket);
  }

  public getSocketByUsername(username: string): Socket | undefined {
    return this.usernameToSocketMap.get(username);
  }

  public getUsernames(): string[] {
    return this.usernameToSocketMap.keys().toArray();
  }

  public deleteByUsername(username: string): void {
    this.usernameToSocketMap.delete(username);
  }
}
